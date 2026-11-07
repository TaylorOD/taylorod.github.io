import { now as clockNow, setSimulationTime } from './clock.js';
// Adapted from plateaukao/tamagochi at 74c7a45. See NOTICE.md.
import { C } from './constants.js';
import { GameState, Evo } from './engine.js';
import { SoundManager } from './sound.js';
import { Renderer } from './renderer.js';
import { SP, characterName } from './skins.js';
import { updateStatus } from './status.js';
import { drawScene, centeredBody } from './layout.js';
import { Dialogue, contextFor } from './dialogue.js';
import { PF } from './font.js';
import { petType } from './storage.js';

export class TamagotchiApp {
  constructor(options={}){
    this.renderer=new Renderer(document.getElementById('lcd'));
    this.sound=new SoundManager();
    this.state=new GameState();
    this.frame=0;
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
    this.dialogue=new Dialogue(options.dialogueSend||(()=>{}),options.dialogueAvailable===true,(text,status)=>this.showDialogue(text,status));
    this.dialogue.enabled=options.dialogueEnabled===true;
    this.onDialogueChange=options.onDialogueChange||(()=>{});
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

    const toggle=document.getElementById('dialogue-toggle');
    toggle.disabled=!this.dialogue.available;
    toggle.setAttribute('aria-checked',String(this.dialogue.on));toggle.classList.toggle('on',this.dialogue.on);
    document.getElementById('dialogue-info').textContent=this.dialogue.available?'Optional personality replies from this site.':'Dialogue is unavailable. This site has no adapter configured.';
    toggle.addEventListener('click',()=>{
      this.dialogue.enabled=!this.dialogue.enabled;this.dialogue.cancel();this.onDialogueChange(this.dialogue.enabled);
      toggle.setAttribute('aria-checked',String(this.dialogue.enabled));toggle.classList.toggle('on',this.dialogue.enabled);
    });
    document.getElementById('dialogue-retry').addEventListener('click',()=>this.dialogue.retry());
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
      if(confirm(`Restart ${petType==='pizza'?'Slice':petType==='cyberpunk'?'Cyberpunk':'Default'}? This cannot be undone.`)){
        this.dialogue?.cancel(); this.state.clearSave(); this.state.reset(); this.animState=null; this.state.save();
        this.closeOverlay('settings-overlay'); this.closeOverlay('death-overlay');
        this.toast('New egg started!');
      }
    });
    document.getElementById('restart-btn').addEventListener('click',()=>{
      this.dialogue?.cancel(); this.state.clearSave(); this.state.reset();
      this.animState=null; this.state.save(); this.updateButtons();
      this.closeOverlay('death-overlay');
      this.toast('New egg started!');
    });

    // Visibility change
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden) this.state.save();
      else { this.processMissedTime(); this.updateButtons(); }
    });

    // Start loops
    setInterval(()=>this.tick(),1000);
    const renderLoop=()=>{ if(!document.hidden) this.render(); requestAnimationFrame(renderLoop); };
    requestAnimationFrame(renderLoop);
    setInterval(()=>this.state.save(),30000);
    setInterval(()=>this.maybeMisbehave(),600000);

    setInterval(()=>{if(this.dialogue.on&&!this.state.isDead&&!this.state.isSleeping&&this.state.stage!=='egg'&&Math.random()<.2)this.talk('idle');},300000);

    // Update button states immediately and periodically
    this.updateButtons();
    setInterval(()=>this.updateButtons(),2000);

    if(this.state.isDead) this.showDeath();
    this.state.save();
  }

  // -- TOAST NOTIFICATIONS --
  toast(msg){
    if(this.catchingUp) return;
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
    updateStatus(st);
    const btns=document.querySelectorAll('.ctrl-btn');
    btns.forEach(btn=>{
      const action=btn.dataset.action;
      let disabled=false;
      if(st.isDead&&action!=='mute') disabled=true;
      else switch(action){
        case 'feed': disabled=st.stage==='egg'||st.isSleeping; break;
        case 'light': disabled=st.stage==='egg'; break;
        case 'play': disabled=st.stage==='egg'||st.isSleeping||st.isSick; break;
        case 'medicine': disabled=!st.isSick; break;
        case 'clean': disabled=st.poopCount===0; break;
        case 'discipline': disabled=!st.isMisbehaving; break;
        case 'stats': disabled=st.stage==='egg'; break;
      }
      btn.classList.toggle('disabled',disabled);
      btn.disabled=disabled;
    });
  }

  // -- TIME CATCH-UP --
  processMissedTime(){
    const end=clockNow(), st=this.state;
    if(st.isDead) { this.showDeath(); return; }
    const start=Math.max(st.lastProcessed, end-25*86400000);
    if(end<=start) return;
    const sound=this.sound;
    this.sound=new Proxy({}, {get:()=>()=>{}});
    this.catchingUp=true;
    try {
      for(let time=Math.min(start+60000,end);;time=Math.min(time+60000,end)) {
        setSimulationTime(time);
        this.tick();
        if(Math.floor(time/600000)>Math.floor((time-60000)/600000)) this.maybeMisbehave();
        if(time===end || st.isDead) break;
      }
    } finally {
      setSimulationTime(null);
      this.sound=sound;
      this.catchingUp=false;
      this.animState=null;
    }
    this.state.lastProcessed=end;
    this.state.save();
    if(st.isDead) this.showDeath();
    this.updateButtons();
  }

  // -- GAME TICK --
  tick(){
    const st=this.state, now=clockNow();
    st.lastProcessed=now;
    if(st.isDead) return;

    if(st.stage==='egg'){
      if(Evo.shouldEvolve(st)) this.doEvolve();
      return;
    }

    if(now-st.lastAgeInc>=86400000){ st.age++; st.lastAgeInc+=86400000; }
    this.checkSleep();
    if(st.isSleeping) return;

    const hRate=C.HUNGER_DECAY[st.stage]||3600000;
    if(now-st.lastHungerDecay>=hRate){
      if(st.hunger>0) st.hunger--;
      st.lastHungerDecay=now;
    }
    const hpRate=C.HAPPY_DECAY[st.stage]||3600000;
    if(now-st.lastHappyDecay>=hpRate){
      if(st.happiness>0) st.happiness--;
      st.lastHappyDecay=now;
    }
    const pRate=C.POOP_RATE[st.stage]||10800000;
    if(now-st.lastPoopTime>=pRate&&st.poopCount<C.MAX_POOP){
      st.poopCount++; st.lastPoopTime=now;
    }
    if(st.poopCount>=3&&!st.isSick&&Math.random()<(this.catchingUp ? 1-Math.pow(.99,60) : .01)) this.makeSick();

    this.checkAttention();

    if(st.attentionCallTime&&now-st.attentionCallTime>=C.CARE_WINDOW){
      st.careMistakes++;
      st.attentionCallTime=null; st.attentionReason=null;
    }

    if(Evo.shouldEvolve(st)&&!st.isSick) this.doEvolve();

    if(st.stage==='adult'){
      if(st.careMistakes>=C.ADULT_MAX_MISTAKES||st.age>=C.MAX_AGE){
        st.isDead=true; st.stage='dead';
        this.sound.death(); this.showDeath();
      }
      if(!st.isDead&&Evo.checkOyajitchi(st)&&st.character!=='oyajitchi'&&Math.random()<.05){
        st.character='oyajitchi';
        this.sound.hatch();
        this.animState='evolve'; this.animTimer=clockNow();
        this.talk('evolved');
      }
    }

    if(this.catchingUp) return;
    const bar=document.getElementById('attention-bar');
    bar.classList.toggle('active',st.attentionCallTime!=null);

    if(st.attentionCallTime&&now%4000<1000) this.sound.attention();

    this.updateButtons();
  }

  checkSleep(){
    const st=this.state, h=new Date(clockNow()).getHours();
    const sch=C.SLEEP[st.stage];
    if(!sch) return;
    const shouldSleep=(h>=sch.s||h<sch.w);
    if(shouldSleep&&!st.isSleeping){
      st.isSleeping=true;
      this.talk('going_sleep');
    }
    if(!shouldSleep&&st.isSleeping){
      st.isSleeping=false; st.lightOn=true;
      this.talk('woke_up');
      st.lastHungerDecay=clockNow(); st.lastHappyDecay=clockNow(); st.lastPoopTime=clockNow();
    }
  }

  checkAttention(){
    const st=this.state;
    if(st.isSick&&!st.attentionCallTime){
      st.attentionCallTime=clockNow(); st.attentionReason='sick'; return;
    }
    if(st.hunger===0&&!st.attentionCallTime&&!st.isMisbehaving){
      st.attentionCallTime=clockNow(); st.attentionReason='hungry';
      this.talk('hungry');
      return;
    }
    if(st.happiness===0&&!st.attentionCallTime&&!st.isMisbehaving){
      st.attentionCallTime=clockNow(); st.attentionReason='sad';
      this.talk('sad');
      return;
    }
    if(!st.attentionCallTime&&st.isMisbehaving){
      st.attentionCallTime=clockNow(); st.attentionReason='misbehave';
    }
    if(st.attentionCallTime&&!st.isSick&&st.hunger>0&&st.happiness>0&&!st.isMisbehaving){
      st.attentionCallTime=null; st.attentionReason=null;
    }
  }

  makeSick(){
    const st=this.state;
    st.isSick=true;
    st.medDoses=1+Math.floor(Math.random()*2);
    st.sickCount++;
    this.talk('sick');
  }

  doEvolve(){
    const st=this.state;
    const r=Evo.evolve(st);
    if(!r) return;
    const oldStage=st.stage;
    st.stage=r.stage; st.character=r.character; st.weight=r.weight;
    st.stageStartTime=clockNow();
    if(r.stage!=='adult'){ st.hunger=C.MAX_HUNGER; st.happiness=C.MAX_HAPPY; }
    if(r.stage==='teen') st.prevTeen=r.character;
    this.sound.hatch();
    this.animState='evolve'; this.animTimer=clockNow();
    this.talk('evolved');
    const name=characterName(r.character);
    this.toast(`Evolved into ${name}!`);
    if(!this.catchingUp) this.state.save();
    this.updateButtons();
  }

  maybeMisbehave(){
    const st=this.state;
    if(st.isDead||st.isSleeping||st.stage==='egg'||st.stage==='baby') return;
    if(Math.random()<.05&&!st.isMisbehaving&&st.hunger>0&&st.happiness>0){
      st.isMisbehaving=true;
      this.talk('misbehave');
      this.updateButtons();
    }
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

    switch(action){
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
        this.talk('cleaned');
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
        this.talk('discipline');
        this.updateButtons();
        break;
    }
  }

  doFeed(type){
    const st=this.state;
    if(st.isSleeping||st.isDead) return;
    if(type==='meal'){
      if(st.hunger>=C.MAX_HUNGER){ this.toast('Not hungry!'); this.sound.denied(); return; }
      st.hunger=Math.min(st.hunger+1,C.MAX_HUNGER);
      st.weight=Math.min(st.weight+C.MEAL_WT,C.MAX_WEIGHT);
      this.toast('Yum! Hunger +1');
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
    this.talk(type==='meal'?'fed_meal':'fed_snack');
    this.sound.eat();
    this.animState='eat'; this.animTimer=clockNow();
    if(st.hunger>0&&st.happiness>0&&!st.isMisbehaving&&!st.isSick){
      st.attentionCallTime=null; st.attentionReason=null;
    }
    this.updateButtons();
  }

  showStats(){
    const st=this.state;
    const hF='\u2665', hE='\u2661';
    const hungerH=hF.repeat(st.hunger)+hE.repeat(C.MAX_HUNGER-st.hunger);
    const happyH=hF.repeat(st.happiness)+hE.repeat(C.MAX_HAPPY-st.happiness);
    const name=characterName(st.character);
    document.getElementById('stats-content').innerHTML=`
      <div class="stat-row"><span>Name</span><span>${name}</span></div>
      <div class="stat-row"><span>Stage</span><span>${st.stage}</span></div>
      <div class="stat-row"><span>Age</span><span>${st.age} days</span></div>
      <div class="stat-row"><span>Weight</span><span>${st.weight} lb</span></div>
      <div class="stat-row"><span>Hunger</span><span class="hearts">${hungerH}</span></div>
      <div class="stat-row"><span>Happy</span><span class="hearts">${happyH}</span></div>
      <div class="stat-row"><span>Discipline</span><span>${st.discipline}%</span></div>
    `;
    this.openOverlay('stats-overlay');
  }

  // -- MINI-GAME --
  startGame(){
    this.gameId=(this.gameId||0)+1;
    this.gameActive=true; this.gameRound=0; this.gameWins=0;
    this.gamePhase='waiting';
    this.nextGameRound();
    this.openOverlay('game-overlay');
  }

  nextGameRound(){
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
    this.talk(won?'played_won':'played_lost');
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
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) this.frame++;

    if(st.isDead){
      const items=[{name:'grave',pixels:SP.grave,x:13,y:8}];
      if(this.frame%90<45) items.push({name:'angel',pixels:SP.angel,x:13,y:1});
      drawScene(R,items);
      R.render(); return;
    }

    const now=clockNow();

    // Animation override
    if(this.animState&&now-this.animTimer<2000){
      this.renderAnim(R,st);
      R.render(st.isSleeping&&!st.lightOn); return;
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
        items.push({name:'sleeping body',pixels:f,x:cx,y:cy});
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
      const f=sp[fk]||sp.idle1;
      const cx=Math.floor((32-f[0].length)/2);
      const cy=Math.floor((16-f.length)/2)+1;
      items.push({name:`${st.character}.${fk}`,pixels:f,x:cx,y:cy});
    }

    // Poop
    for(let i=0;i<st.poopCount;i++){
      const px=27-(i%2)*5;
      const py=11-Math.floor(i/2)*5;
      items.push({name:`waste ${i+1}`,pixels:SP.poop,x:px,y:py});
    }

    // Skull if sick
    if(st.isSick&&this.frame%60<40) items.push({name:'sickness',pixels:SP.skull,x:1,y:1});

    // Misbehaving
    if(st.isMisbehaving&&this.frame%40<20) items.push({name:'attention',pixels:PF['!'],x:1,y:8});

    // Needs live below the LCD so they cannot overwrite the character.
    drawScene(R,items);
    R.render();
  }

  renderAnim(R,st){
    const sp=SP[st.character];
    if(!sp) return;
    const frame=sp[this.animState]||sp.eat||sp.idle1;
    const cx=Math.floor((32-frame[0].length)/2);
    const cy=Math.floor((16-frame.length)/2)+1;
    const items=[{name:`${st.character}.${this.animState}`,pixels:frame,x:cx,y:cy}];
    switch(this.animState){
      case 'eat':
        if(this.frame%30<15) items.push({name:'meal',pixels:SP.meal,x:cx-6,y:cy+2});
        break;
      case 'evolve':
        if(this.frame%20>=10) items.length=0;
        break;
      case 'discipline':
        if(this.frame%20<10) items.push({name:'discipline',pixels:PF['!'],x:cx+frame[0].length+1,y:cy});
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
    this.returnFocus=document.activeElement;
    overlay.classList.add('show');
    document.getElementById('device').inert=true;
    overlay.querySelector('button')?.focus();
  }
  closeOverlay(id){
    document.getElementById(id).classList.remove('show');
    document.getElementById('device').inert=false;
    this.returnFocus?.focus();
  }

  showDeath(){
    this.dialogue?.cancel();
    if(this.catchingUp) return;
    document.getElementById('death-msg').textContent=
      `Your ${this.state.character} lived for ${this.state.age} days.`;
    this.openOverlay('death-overlay');
    document.getElementById('attention-bar').classList.remove('active');
  }

  talk(event){
    if(this.catchingUp || this.state.isDead)return;
    this.dialogue?.talk(contextFor(this.state,event,{classic:'default',pizza:'slice',cyberpunk:'cyberpunk'}[petType],characterName(this.state.character)));
  }
  showDialogue(text,status){
    const el=document.getElementById('dialogue');
    if(!el)return;
    clearInterval(this.dialogueTyping);clearTimeout(this.dialogueHide);
    const content=document.getElementById('dialogue-text');
    document.getElementById('dialogue-retry').hidden=status!=='error';
    el.classList.toggle('show',!!text);el.setAttribute('aria-busy',String(status==='busy'));
    content.textContent='';
    if(status!=='reply' || globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches){content.textContent=text;}
    else {let i=0;this.dialogueTyping=setInterval(()=>{content.textContent=text.slice(0,++i);if(i>=text.length){clearInterval(this.dialogueTyping);this.dialogueHide=setTimeout(()=>el.classList.remove('show'),4000);}},40);}
    if(status==='reply' && content.textContent)this.dialogueHide=setTimeout(()=>el.classList.remove('show'),4000);
  }

}
