import { now as clockNow, setSimulationTime } from './clock.js';
// Adapted from plateaukao/tamagochi at 74c7a45. See NOTICE.md.
import { C } from './constants.js';
import { initializeWellbeing, advanceWellbeing, applyWellbeingAction, setManualSleep, sleepDecision, careGrade } from './wellbeing.js';
import { updatePresentation, careAction, motionOffset, tiltFrame } from './presentation.js';
import { GrowthCelebration } from './celebrations.js';
import { overlayControls } from './focus.js';
import { limitAbsence, resumeVacation } from './away.js';
import { GameState, Evo } from './engine.js';
import { SoundManager } from './sound.js';
import { Renderer } from './renderer.js';
import { SP, characterName } from './skins.js';
import { updateStatus } from './status.js';
import { drawScene, centeredBody } from './layout.js';
import { PF } from './font.js';
import { petType, selectedCharacter } from './storage.js';

import { PetSimulation } from './simulation.js';

export class TamagotchiApp extends PetSimulation {
  constructor(options={}){
    super();
    this.evolutionName=characterName;
    this.renderer=new Renderer(document.getElementById('lcd'));
    this.sound=new SoundManager();
    this.state=new GameState();
    this.frame=0;
    this.presentationEnabled=true;
    this.panelVisible=true;
    this.growth=new GrowthCelebration(document.getElementById('growth-notice'));
    this.animState=null;
    this.animTimer=0;
    this.gameActive=false;
    this.gameRound=0;
    this.gameWins=0;
    this.gameDir=0;
    this.gamePhase='idle';
    this.toastTimer=null;
    this.eink=options.eink===true;
    this.onThemeChange=options.onThemeChange||(()=>{});
    this.scanlines=options.scanlines===true;
    this.onScanlinesChange=options.onScanlinesChange||(()=>{});
    this.init();
  }

  applyTheme(){
    document.documentElement.classList.toggle('eink',this.eink);
    const toggle=document.getElementById('eink-toggle');
    toggle.classList.toggle('on',this.eink);
    toggle.setAttribute('aria-checked',String(this.eink));
    this.renderer.updateColors();
  }

  init(){
    this.applyTheme();
    this.loadedSave=this.state.load();
    if(this.loadedSave){
      this.processMissedTime();
    } else {
      this.state.reset();
    }
    initializeWellbeing(this.state,clockNow());
    document.getElementById('vacation-toggle')?.addEventListener('click',()=>this.toggleVacation());
    const scanlineToggle=document.getElementById('scanline-toggle');
    document.documentElement.classList.toggle('scanlines',this.scanlines);
    scanlineToggle?.setAttribute('aria-checked',String(this.scanlines));
    scanlineToggle?.classList.toggle('on',this.scanlines);
    scanlineToggle?.addEventListener('click',()=>{
      const enabled=document.documentElement.classList.toggle('scanlines');
      scanlineToggle.setAttribute('aria-checked',String(enabled));
      scanlineToggle.classList.toggle('on',enabled);
      this.onScanlinesChange(enabled);
    });
    // Init audio on first interaction
    const initAudio=()=>{ this.sound.init(); };
    document.addEventListener('touchstart',initAudio,{once:true});
    document.addEventListener('click',initAudio,{once:true});

    // Control button handlers
    document.querySelectorAll('.ctrl-btn').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();
        this.sound.init(); // ensure audio context
        this.sound.btnPress();
        this.handleAction(btn.dataset.action); this.state.save();
      });
    });

    // Feed overlay buttons
    document.getElementById('feed-meal-btn').addEventListener('click',e=>{
      e.preventDefault(); this.doFeed('meal'); this.state.save(); this.closeOverlay('feed-overlay');
    });
    document.getElementById('feed-snack-btn').addEventListener('click',e=>{
      e.preventDefault(); this.doFeed('snack'); this.state.save(); this.closeOverlay('feed-overlay');
    });

    // Close overlays
    document.querySelectorAll('[data-close]').forEach(el=>{
      el.addEventListener('click',e=>{ e.preventDefault(); this.closeOverlay(el.dataset.close); });
    });

    // Game arrows
    document.getElementById('guess-left').addEventListener('click',()=>this.gameGuess(0));
    document.getElementById('guess-right').addEventListener('click',()=>this.gameGuess(1));

    document.getElementById('settings-btn').addEventListener('click',()=>this.openOverlay('settings-overlay'));
    document.getElementById('eink-toggle').addEventListener('click',()=>{
      this.eink=!this.eink; this.applyTheme(); this.onThemeChange(this.eink);
      this.toast(this.eink?'E-ink theme on':'Default theme');
    });
    document.getElementById('reset-game-btn').addEventListener('click',()=>{
      if(confirm(`Restart ${selectedCharacter.name}? This cannot be undone.`)){
        this.growth?.clear();this.landingAt=null;
        this.state.clearSave(); this.state.reset(); this.animState=null; this.state.save();
        this.closeOverlay('settings-overlay'); this.closeOverlay('death-overlay');
        this.toast(`${selectedCharacter.name} started again.`);
      }
    });
    document.getElementById('restart-btn').addEventListener('click',()=>{
      this.growth?.clear();this.landingAt=null;
      this.state.clearSave(); this.state.reset();
      this.animState=null; this.state.save(); this.updateButtons();
      this.closeOverlay('death-overlay');
      this.toast(`${selectedCharacter.name} started again.`);
    });

    // Visibility change
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden) this.state.save();
      else { this.processMissedTime(); this.updateButtons(); }
    });

    // Start loops
    setInterval(()=>this.tick(),1000);
    const renderLoop=()=>{ if(!document.hidden&&this.panelVisible!==false) this.render(); requestAnimationFrame(renderLoop); };
    requestAnimationFrame(renderLoop);
    setInterval(()=>this.state.save(),30000);
    setInterval(()=>this.maybeMisbehave(),600000);


    // Update button states immediately and periodically
    this.updateButtons();
    setInterval(()=>this.updateButtons(),2000);

    if(this.state.isDead) this.showDeath();
    this.state.save();
  }

  // -- TOAST NOTIFICATIONS --
  toast(msg){
    if(this.catchingUp||this.panelVisible===false) return;
    const el=document.getElementById('toast');
    el.textContent=msg;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer=setTimeout(()=>el.classList.remove('show'),2000);
  }

  // -- BUTTON STATE UPDATES --
  updateButtons(){
    if(this.catchingUp) return;
    const st=this.state;
    const vacation=document.getElementById('vacation-toggle');
    const attention=document.getElementById('attention-bar');
    if(attention?.style)attention.style.animationName=this.motionDisabled()?'none':'';
    vacation?.setAttribute?.('aria-checked',String(st.vacationAt>0));
    vacation?.classList.toggle('on',st.vacationAt>0);
    updateStatus(st);
    updatePresentation(st,clockNow(),this.renderer);
    if(document.getElementById('stats-overlay')?.classList.contains?.('show')) this.renderStats();
    const btns=document.querySelectorAll('.ctrl-btn');
    btns.forEach(btn=>{
      const action=btn.dataset.action;
      let disabled=false;
      if(st.vacationAt>0&&!['mute','stats'].includes(action)) disabled=true;
      else if(st.isDead&&action!=='mute') disabled=true;
      else switch(action){
        case 'feed': disabled=st.stage==='egg'||st.isSleeping; break;
        case 'light': disabled=st.stage==='egg'; break;
        case 'play': disabled=st.stage==='egg'||st.isSleeping||st.isSick; break;
        case 'medicine': disabled=!st.isSick; break;
        case 'clean': disabled=st.poopCount===0; break;
        case 'discipline': disabled=!st.isMisbehaving; break;
        case 'stats': disabled=false; break;
        case 'care': disabled=st.stage==='egg'; break;
      }
      btn.classList.toggle('disabled',disabled);
      btn.disabled=disabled;
      btn.title=disabled?(st.vacationAt>0?'Resume Vacation in Settings':st.stage==='egg'?'Available after hatching':st.isSleeping?'Wake your pet first':action==='play'&&st.isSick?'Needs medicine before playing':action==='medicine'?'Medicine is only needed when sick':action==='discipline'?'No misbehavior to correct':action==='clean'?'Already clean':'Unavailable right now'):'';
    });
  }

  // -- TIME CATCH-UP --
  toggleVacation(){
    const st=this.state, now=clockNow();
    if(st.vacationAt>0){
      resumeVacation(st,now);
      this.toast('Vacation ended. Your pet is ready.');
    } else {
      if(st.isDead){this.toast('Start again to care for a new pet.');return;}
      this.processMissedTime();
      if(st.isDead)return;
      st.vacationAt=now;
      this.gameActive=false;this.gameId=(this.gameId||0)+1;this.animState=null;
      this.closeOverlay('game-overlay');this.closeOverlay('feed-overlay');
      this.toast('Vacation on. Care and growth are paused.');
    }
    st.save();this.updateButtons();
  }

  // -- ACTIONS --
  handleAction(action){
    const st=this.state;

    // Mute always works
    if(action==='mute'){
      this.sound.toggleMute();
      const mb=document.getElementById('mute-btn');
      mb.querySelector('.icon-color').innerHTML=this.sound.muted?'&#128263;':'&#128264;';
      const svg=document.getElementById('mute-icon-mono');
      svg.innerHTML=this.sound.muted
        ?'<polygon points="6,9 2,9 2,15 6,15 11,19 11,5" fill="currentColor" stroke="none"/><line x1="16" y1="8" x2="22" y2="16"/><line x1="22" y1="8" x2="16" y2="16"/>'
        :'<polygon points="6,9 2,9 2,15 6,15 11,19 11,5" fill="currentColor" stroke="none"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 7a7 7 0 0 1 0 10"/>';
      mb.querySelector('.label').textContent=this.sound.muted?'Muted':'Sound';
      this.toast(this.sound.muted?'Sound off':'Sound on');
      return;
    }

    if(st.isDead){ this.toast('Your pet has passed away...'); return; }

    if(st.vacationAt>0&&action!=='stats'){this.toast('Vacation is on. Resume in Settings.');return;}
    if(!st.vacationAt)advanceWellbeing(st,clockNow());
    switch(action){
      case 'care': {
        if(st.stage==='egg')return;
        const next=careAction(st);
        if(next==='clean'){this.handleAction('clean');return;}
        setManualSleep(st,next==='sleep',clockNow());
        this.toast(next==='sleep'?'Settling down for a nap.':'Awake and ready for company.');
        this.updateButtons();
        break;
      }
      case 'feed':
        if(st.stage==='egg'){ this.toast('Egg is hatching... wait!'); this.sound.denied(); return; }
        if(st.isSleeping){ this.toast('Shh... sleeping!'); this.sound.denied(); return; }
        this.openOverlay('feed-overlay');
        break;

      case 'light':
        if(st.stage==='egg'){ this.toast('Egg is hatching... wait!'); this.sound.denied(); return; }
        st.lightOn=!st.lightOn;
        this.toast(st.lightOn?'Light on':'Light off');
        break;

      case 'play':
        if(st.stage==='egg'){ this.toast('Egg is hatching... wait!'); this.sound.denied(); return; }
        if(st.isSleeping){ this.toast('Shh... sleeping!'); this.sound.denied(); return; }
        if(st.isSick){ this.toast('Too sick to play!'); this.sound.denied(); return; }
        if(st.hunger===0){ this.toast('Too hungry to play! Feed first.'); this.sound.denied(); return; }
        this.startGame();
        break;

      case 'medicine':
        if(!st.isSick){ this.toast('Not sick!'); this.sound.denied(); return; }
        st.medDoses--;
        this.sound.medicine();
        this.animState='medicine'; this.animTimer=clockNow();
        if(st.medDoses<=0){
          st.isSick=false; st.medDoses=0;
          applyWellbeingAction(st,'cured',clockNow());
          st.attentionCallTime=null; st.attentionReason=null;
          this.toast('Cured!');
        } else {
          this.toast('Medicine given... needs more');
        }
        this.updateButtons();
        break;

      case 'clean':
        if(st.poopCount===0){ this.toast('Already clean!'); this.sound.denied(); return; }
        st.poopCount=0;
        this.sound.clean();
        this.animState='clean'; this.animTimer=clockNow();
        this.toast('Cleaned up!');
        this.updateButtons();
        break;

      case 'stats':
        if(st.stage==='egg'){
          const pct=Math.min(100,Math.floor((clockNow()-st.stageStartTime)/C.EGG_MS*100));
          this.toast(`Hatching: ${pct}%`);
          return;
        }
        this.showStats();
        break;

      case 'discipline':
        if(!st.isMisbehaving){ this.toast('Not misbehaving!'); this.sound.denied(); return; }
        st.discipline=Math.min(st.discipline+C.DISC_INC,C.MAX_DISC);
        st.isMisbehaving=false;
        st.attentionCallTime=null; st.attentionReason=null;
        this.sound.discipline();
        this.animState='discipline'; this.animTimer=clockNow();
        this.toast(`Discipline: ${st.discipline}%`);
        this.updateButtons();
        break;
    }
  }

  doFeed(type){
    const st=this.state;
    if(st.vacationAt>0)return;
    if(st.isSleeping||st.isDead) return;
    advanceWellbeing(st,clockNow());
    if(type==='meal'){
      if(st.hunger>=C.MAX_HUNGER){ this.toast('Not hungry!'); this.sound.denied(); return; }
      st.hunger=Math.min(st.hunger+1,C.MAX_HUNGER);
      st.weight=Math.min(st.weight+C.MEAL_WT,C.MAX_WEIGHT);
      applyWellbeingAction(st,'meal',clockNow());
      this.toast('Yum! Food +1');
    } else {
      if(st.happiness>=C.MAX_HAPPY){ this.toast('Already happy!'); this.sound.denied(); return; }
      st.happiness=Math.min(st.happiness+1,C.MAX_HAPPY);
      st.weight=Math.min(st.weight+C.SNACK_WT,C.MAX_WEIGHT);
      const now=clockNow();
      if(now-st.snackWindowStart>600000){ st.snacksInWindow=0; st.snackWindowStart=now; }
      st.snacksInWindow++;
      if(st.snacksInWindow>=C.SNACK_SICK) this.makeSick();
      this.toast('Yum! Happy +1');
    }
    this.sound.eat();
    this.animState='eat'; this.animTimer=clockNow();
    if(st.hunger>0&&st.happiness>0&&!st.isMisbehaving&&!st.isSick){
      st.attentionCallTime=null; st.attentionReason=null;
    }
    this.updateButtons();
  }

  showStats(){
    this.renderStats();
    this.openOverlay('stats-overlay');
  }

  renderStats(){
    const st=this.state;
    const hF='\u2665', hE='\u2661';
    const hungerH=hF.repeat(st.hunger)+hE.repeat(C.MAX_HUNGER-st.hunger);
    const happyH=hF.repeat(st.happiness)+hE.repeat(C.MAX_HAPPY-st.happiness);
    const name=characterName(st.character);
    document.getElementById('stats-content').innerHTML=`
      <div class="stat-row"><span>Name</span><span>${name}</span></div>
      <div class="stat-row"><span>Stage</span><span>${st.stage[0].toUpperCase()+st.stage.slice(1)}</span></div>
      <div class="stat-row"><span>Age</span><span>${st.age} days</span></div>
      <div class="stat-row"><span>Weight</span><span>${st.weight} lb</span></div>
      <div class="stat-row"><span>Food</span><span class="hearts">${hungerH} ${st.hunger}/4</span></div>
      <div class="stat-row"><span>Happy</span><span class="hearts">${happyH} ${st.happiness}/4</span></div>
      <div class="stat-row"><span>Energy</span><span>${Math.round(st.energy??100)}%</span></div>
      <div class="stat-row"><span>Health</span><span>${Math.round(st.health??100)}%</span></div>
      <div class="stat-row"><span>Care</span><span>${careGrade(st).label}</span></div>
      <div class="stat-row"><span>Discipline</span><span>${st.discipline}%</span></div>
    `;
  }

  // -- MINI-GAME --
  startGame(){
    if(this.state.vacationAt>0||this.state.isDead)return;
    applyWellbeingAction(this.state,'play',clockNow());
    this.gameId=(this.gameId||0)+1;
    this.gameActive=true; this.gameRound=0; this.gameWins=0;
    this.gamePhase='waiting';
    this.nextGameRound();
    this.openOverlay('game-overlay');
  }

  nextGameRound(){
    if(this.state.isDead||this.state.vacationAt>0)return;
    if(this.gameRound>=5){ this.finishGame(); return; }
    this.gameDir=Math.random()<.5?0:1;
    this.gamePhase='waiting';
    document.getElementById('game-score').textContent=`Round ${this.gameRound+1}/5 | Wins: ${this.gameWins}`;
    document.getElementById('game-result').innerHTML='Tap an arrow!';
    document.getElementById('guess-left').classList.remove('disabled');
    document.getElementById('guess-right').classList.remove('disabled');
    const sp=SP[this.state.character];
    if(sp) this.renderer.renderToCanvas(document.getElementById('game-pet-canvas'),sp.idle1);
  }

  gameGuess(dir){
    if(this.state.vacationAt>0||this.state.isDead)return;
    if(this.gamePhase!=='waiting'||!this.gameActive) return;
    this.gamePhase='reveal';
    document.getElementById('guess-left').classList.add('disabled');
    document.getElementById('guess-right').classList.add('disabled');
    const won=dir===this.gameDir;
    if(won) this.gameWins++;
    this.state.weight=Math.max(1,this.state.weight-C.GAME_WT_LOSS);
    const dirText=this.gameDir===0?'LEFT':'RIGHT';
    document.getElementById('game-result').textContent=`Pet went ${dirText}! ${won?'Correct!':'Wrong!'}`;
    document.getElementById('game-score').textContent=`Round ${this.gameRound+1}/5 | Wins: ${this.gameWins}`;
    const sp=SP[this.state.character];
    if(sp){
      const frame=won?'happy':'sad';
      this.renderer.renderToCanvas(document.getElementById('game-pet-canvas'),sp[frame]||sp.idle1);
    }
    this.sound[won?'happy':'sad']();
    this.gameRound++;
    const gameId=this.gameId;
    setTimeout(()=>{
      if(!this.gameActive || this.gameId!==gameId) return;
      if(this.gameRound>=5) this.finishGame();
      else this.nextGameRound();
    },1200);
  }

  finishGame(){
    if(this.state.vacationAt>0||this.state.isDead)return;
    this.gameActive=false;
    const won=this.gameWins>=3;
    if(won){
      this.state.happiness=Math.min(this.state.happiness+1,C.MAX_HAPPY);
      this.sound.gameWin();
      document.getElementById('game-result').textContent=`You won ${this.gameWins}/5! +1 Happy`;
    } else {
      this.sound.gameLose();
      document.getElementById('game-result').textContent=`You lost ${this.gameWins}/5. Try again!`;
    }
    document.getElementById('game-score').textContent='Game Over!';
    document.getElementById('guess-left').classList.add('disabled');
    document.getElementById('guess-right').classList.add('disabled');
    this.state.save();
    const gameId=this.gameId;
    setTimeout(()=>{if(this.gameId===gameId){this.closeOverlay('game-overlay'); this.updateButtons();}},2500);
  }

  // -- RENDERING --
  render(){
    const R=this.renderer, st=this.state;
    R.clear();
    const still=this.motionDisabled();
    if(!still) this.frame++;

    if(st.isDead){
      const items=[{name:'grave',pixels:SP.grave,x:13,y:8}];
      if(still||this.frame%90<45) items.push({name:'angel',pixels:SP.angel,x:13,y:1});
      drawScene(R,items);
      R.render(); return;
    }

    const now=st.vacationAt||clockNow();

    // Animation override
    if(this.animState&&now-this.animTimer<2000){
      this.renderAnim(R,st);
      R.render(!st.lightOn); return;
    }
    this.animState=null;

    if(st.stage==='egg'){
      const sp=this.frame%90<45?SP.egg.idle1:SP.egg.idle2;
      drawScene(R,[{name:'egg',pixels:sp,x:Math.floor((32-sp[0].length)/2),y:2}],[{left:6,top:12,right:25,bottom:14}]);
      // Show hatching progress bar
      const frac=(now-st.stageStartTime)/C.EGG_MS;
      R.drawBar(6,12,20,frac);
      R.render(); return;
    }

    if(st.isSleeping){
      const items=[];
      const sp=SP[st.character];
      if(sp){
        const f=sp.sleep||sp.idle1;
        const cx=Math.floor((32-f[0].length)/2);
        const cy=Math.floor((16-f.length)/2)+1;
        const offset=this.petMotion('sleep');
        items.push({name:'sleeping body',pixels:f,x:cx+offset.x,y:cy+offset.y});
      }
      items.push({name:'sleep mark',pixels:SP.zzz,x:this.frame%60<30?23:24,y:this.frame%60<30?1:2});
      drawScene(R,items);
      R.render(!st.lightOn); return;
    }

    // Normal idle
    const sp=SP[st.character];
    const items=[];
    if(sp){
      const fk=this.frame%90<45?'idle1':'idle2';
      const original=sp[fk]||sp.idle1;
      const f=this.canTilt()?tiltFrame(original,clockNow()):original;
      const cx=Math.floor((32-f[0].length)/2);
      const cy=Math.floor((16-f.length)/2)+1;
      const offset=this.petMotion();
      items.push({name:`${st.character}.${fk}`,pixels:f,x:cx+offset.x,y:cy+offset.y});
    }

    // Poop
    for(let i=0;i<st.poopCount;i++){
      const px=27-(i%2)*5;
      const py=11-Math.floor(i/2)*5;
      items.push({name:`waste ${i+1}`,pixels:SP.poop,x:px,y:py});
    }

    // Skull if sick
    if(st.isSick&&(still||this.frame%60<40)) items.push({name:'sickness',pixels:SP.skull,x:1,y:1});

    // Misbehaving
    if(st.isMisbehaving&&(still||this.frame%40<20)) items.push({name:'attention',pixels:PF['!'],x:1,y:8});

    // Needs live below the LCD so they cannot overwrite the character.
    drawScene(R,items);
    R.render(!st.lightOn);
  }

  petMotion(kind='idle'){
    if(!this.presentationEnabled||this.motionDisabled())return {x:0,y:0};
    const elapsed=clockNow()-this.landingAt;
    if(this.landingAt&&elapsed>=0&&elapsed<650)return motionOffset(elapsed,'land');
    return motionOffset(clockNow(),kind);
  }

  canTilt(){
    const st=this.state;
    return this.presentationEnabled&&!this.motionDisabled()&&!st.poopCount&&!st.isSick&&!st.isMisbehaving;
  }

  motionDisabled(){return this.state.vacationAt>0||this.eink||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}

  cancelGame(){this.gameActive=false;this.gamePhase='idle';this.gameId=(this.gameId||0)+1;}

  renderAnim(R,st){
    const sp=SP[st.character];
    if(!sp) return;
    const frame=sp[this.animState]||sp.eat||sp.idle1;
    const cx=Math.floor((32-frame[0].length)/2);
    const cy=Math.floor((16-frame.length)/2)+1;
    const offset=this.petMotion(this.animState);
    const items=[{name:`${st.character}.${this.animState}`,pixels:frame,x:cx+offset.x,y:cy+offset.y}];
    switch(this.animState){
      case 'eat':
        if(this.motionDisabled()||this.frame%30<15) items.push({name:'meal',pixels:SP.meal,x:cx-6,y:cy+2});
        break;
      case 'evolve':
        if(!this.presentationEnabled&&this.frame%20>=10) items.length=0;
        break;
      case 'discipline':
        if(this.motionDisabled()||this.frame%20<10) items.push({name:'discipline',pixels:PF['!'],x:cx+frame[0].length+1,y:cy});
        break;
      case 'medicine':
        if(PF['+']) items.push({name:'medicine',pixels:PF['+'],x:cx-4,y:cy});
        break;
      case 'clean':
        items[0]=centeredBody(sp.happy||sp.idle1,`${st.character}.happy`);
        break;
      default:
        break;
    }
    drawScene(R,items);
  }

  // -- UI --
  openOverlay(id){
    const overlay=document.getElementById(id);
    if(overlay.classList.contains?.('show'))return;
    const active=[...document.querySelectorAll('.overlay.show')];
    if(!active.length)this.returnFocus=document.activeElement;
    for(const previous of active)previous.classList.remove('show');
    overlay.classList.add('show');
    document.getElementById('device').inert=true;
    overlayControls(overlay)[0]?.focus();
  }
  closeOverlay(id){
    const overlay=document.getElementById(id);
    if(!overlay?.classList.contains?.('show'))return;
    overlay.classList.remove('show');
    const remaining=[...document.querySelectorAll('.overlay.show')].at(-1);
    document.getElementById('device').inert=!!remaining;
    if(remaining)overlayControls(remaining)[0]?.focus();
    else this.returnFocus?.focus();
  }

  showDeath(){
    this.cancelGame();
    if(this.catchingUp) return;
    document.getElementById('death-msg').textContent=
      `${characterName(this.state.character)} lived for ${this.state.age} ${this.state.age===1?'day':'days'}. Their memory stays in Settings.`;
    this.openOverlay('death-overlay');
    document.getElementById('attention-bar').classList.remove('active');
  }

}
