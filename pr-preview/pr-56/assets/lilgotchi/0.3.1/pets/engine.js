import { now as clockNow } from './clock.js';
import { initializeWellbeing } from './wellbeing.js';
import { C } from './constants.js';
import { saveState, loadState, clearState, selectedCharacter } from './storage.js';

export class GameState {
  constructor(choice=selectedCharacter){ Object.defineProperty(this,'preset',{value:choice}); this.reset(); }
  reset(){
    const now=clockNow();
    Object.assign(this,{
      stage:this.preset.stage, character:this.preset.character, age:0, weight:C.BASE_WT[this.preset.stage] || 5,
      hunger:0, happiness:0, discipline:0,
      careMistakes:0, poopCount:0,
      isSick:false, isSleeping:false, lightOn:true,
      isDead:false, isMisbehaving:false,
      bornAt:now, stageStartTime:now, lastProcessed:now,
      lastHungerDecay:now, lastHappyDecay:now,
      lastPoopTime:now, lastAgeInc:now,
      attentionCallTime:null, attentionReason:null,
      snacksInWindow:0, snackWindowStart:now,
      medDoses:0, prevTeen:null, sickCount:0,
      energy:100, health:100, wellbeingUpdatedAt:now, careTotal:0, careDuration:0,
      sleepOverride:'auto', sleepOverrideUntil:0,
      vacationAt:0,
    });
  }
  save(){ return saveState(this); }
  load(){
    // Leave known fields enumerable so the storage adapter can copy new saves.
    this.energy=undefined; this.health=undefined; this.wellbeingUpdatedAt=undefined;
    const loaded=loadState(this);
    initializeWellbeing(this,this.lastProcessed);
    return loaded;
  }
  clearSave(){ clearState(); }
}

export const Evo = {
  evolve(st){
    switch(st.stage){
      case 'egg': return {stage:'baby',character:'babytchi',weight:C.BASE_WT.baby};
      case 'baby': return {stage:'child',character:'marutchi',weight:C.BASE_WT.child};
      case 'child':
        if(st.careMistakes<=1)
          return {stage:'teen',character:'tamatchi',weight:C.BASE_WT.teen};
        return {stage:'teen',character:'kuchitamatchi',weight:C.BASE_WT.teen};
      case 'teen': return Evo.toAdult(st);
      default: return null;
    }
  },
  toAdult(st){
    const d=st.discipline, cm=st.careMistakes;
    if(st.character==='tamatchi'){
      if(cm<=2&&d>=100) return {stage:'adult',character:'mametchi',weight:25};
      if(cm<=2&&d>=75) return {stage:'adult',character:'ginjirotchi',weight:30};
      if(cm<=4&&d>=50) return {stage:'adult',character:'maskutchi',weight:30};
      if(d>=50) return {stage:'adult',character:'kuchipatchi',weight:35};
      if(d>=25) return {stage:'adult',character:'nyorotchi',weight:30};
      return {stage:'adult',character:'tarakotchi',weight:35};
    }
    if(d>=75) return {stage:'adult',character:'kuchipatchi',weight:35};
    if(d>=50) return {stage:'adult',character:'nyorotchi',weight:30};
    return {stage:'adult',character:'tarakotchi',weight:35};
  },
  shouldEvolve(st){
    const e=clockNow()-st.stageStartTime;
    switch(st.stage){
      case 'egg': return e>=C.EGG_MS;
      case 'baby': return e>=C.BABY_MS;
      case 'child': return e>=C.CHILD_MS;
      case 'teen': return e>=C.TEEN_MS;
      default: return false;
    }
  },
  checkOyajitchi(st){
    return st.character==='maskutchi'&&st.discipline>=100&&st.age>=10;
  }
};

