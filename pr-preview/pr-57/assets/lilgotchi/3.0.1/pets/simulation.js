import { now as clockNow, setSimulationTime } from './clock.js';
import { C } from './constants.js';
import { Evo } from './evolution.js';
import { elderFor } from './original-roster.js';
import { advanceWellbeing, sleepDecision } from './wellbeing.js';
import { limitAbsence } from './away.js';

export class PetSimulation {
  processMissedTime(){
    const end=clockNow(), st=this.state;
    if(st.vacationAt>0)return;
    if(st.isDead) { this.showDeath(); return; }
    const previous={...st};
    const skipped=limitAbsence(st,end);
    const start=st.lastProcessed;
    if(end<=start) return;
    if(st.wellbeingUpdatedAt<start)st.wellbeingUpdatedAt=start;
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
    this.growth?.observe(previous,st);
    if(st.isDead) this.showDeath();
    this.updateButtons();
    if(skipped>0)this.toast('Welcome back. Only eight hours passed for your pet.');
  }

  // -- GAME TICK --
  tick(){
    const st=this.state, now=clockNow();
    if(st.vacationAt>0)return;
    advanceWellbeing(st,now);
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
        this.cancelGame();
        st.save();
        this.sound.death(); this.showDeath();
      }
      if(!st.isDead&&['maskutchi','zuccitchi'].includes(st.character)&&st.discipline>=100&&st.age>=10&&Math.random()<.05){
        const elder=elderFor(st);
        if(!elder)return;
        const previous={...st};
        st.character=elder;
        this.sound.hatch();
        this.animState='evolve'; this.animTimer=clockNow();
        if(!this.catchingUp){this.growth?.observe(previous,st);this.landingAt=clockNow()+2000;}
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
    const shouldSleep=sleepDecision(st,(h>=sch.s||h<sch.w),clockNow());
    if(shouldSleep&&!st.isSleeping){
      st.isSleeping=true;
    }
    if(!shouldSleep&&st.isSleeping){
      st.isSleeping=false; st.lightOn=true;
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
      return;
    }
    if(st.happiness===0&&!st.attentionCallTime&&!st.isMisbehaving){
      st.attentionCallTime=clockNow(); st.attentionReason='sad';
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
    st.medDoses=1+Math.floor(Math.random()*3);
    st.sickCount++;
  }

  doEvolve(){
    const st=this.state;
    const r=Evo.evolve(st);
    if(!r) return;
    const previous={...st};
    const oldStage=st.stage;
    st.stage=r.stage; st.character=r.character; st.weight=r.weight;
    st.stageStartTime=clockNow();
    if(oldStage==='egg'){
      st.hunger=0; st.happiness=0;
      this.checkAttention();
    }
    if(r.stage==='teen') st.prevTeen=r.character;
    this.sound.hatch();
    this.animState='evolve'; this.animTimer=clockNow();
    if(!this.catchingUp){this.growth?.observe(previous,st);this.landingAt=clockNow()+2000;}
    const name=this.evolutionName?.(r.character)||r.character;
    this.toast(`Evolved into ${name}!`);
    if(!this.catchingUp) this.state.save();
    this.updateButtons();
  }

  maybeMisbehave(){
    const st=this.state;
    if(st.vacationAt>0)return;
    if(st.isDead||st.isSleeping||st.stage==='egg'||st.stage==='baby') return;
    if(Math.random()<.05&&!st.isMisbehaving&&st.hunger>0&&st.happiness>0){
      st.isMisbehaving=true;
      this.updateButtons();
    }
  }

}
