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

export { Evo } from './evolution.js';
