import { careGrade } from './wellbeing.js';
import { characterName } from './skins.js';

export function periodAt(date) {
  const hour=date.getHours();
  return hour>=6&&hour<11?'morning':hour>=11&&hour<16?'afternoon':hour>=16&&hour<19?'evening':'night';
}
export function careAction(state) {
  return state.poopCount>0?'clean':state.isSleeping?'wake':'sleep';
}
export const sceneFor=(state,period)=>!state.lightOn?'dark':state.isSleeping?'sleep':period;
export function careHint(state) {
  if(state.isDead)return 'Your pet has passed away. Start again when you are ready.';
  if(state.vacationAt>0)return 'Vacation paused. Resume in Settings when you are ready.';
  if(state.stage==='egg')return 'Your egg takes 90 seconds to hatch. Care starts after hatching.';
  if(state.isSick)return 'Needs medicine. Open More care to help.';
  if(state.poopCount)return 'A little cleanup will help your pet feel better.';
  if(state.isSleeping)return 'Resting. Wake your pet before feeding or playing.';
  if(!state.hunger)return 'Hungry. Offer a meal before playing.';
  if(state.isMisbehaving)return 'Calling for attention with full needs. Discipline is in More care.';
  if(!state.happiness)return 'Could use some company. Play a round together.';
  if(state.energy<25)return 'Getting tired. A nap will restore energy.';
  return 'Feed, play, or settle down for a nap.';
}
export function updatePresentation(state,now,renderer) {
  const identity=document.getElementById('pet-identity');
  if(!identity)return;
  const date=new Date(now),period=periodAt(date),grade=careGrade(state);
  const icons={morning:'☀',afternoon:'☀',evening:'◒',night:'☾'};
  const clock=document.getElementById('pet-clock');
  clock.textContent=`${icons[period]} ${date.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}`;
  clock.setAttribute('aria-label',`${period}, ${date.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})} local time`);
  const scene=sceneFor(state,period);
  if(document.documentElement.dataset.scene!==scene){document.documentElement.dataset.scene=scene;renderer?.updateColors();}
  identity.textContent=`Care: ${state.vacationAt>0?'Paused':state.isDead?'Remembered':grade.label}`;
  identity.title='Care quality reflects your pet’s recent needs.';
  const meters=document.getElementById('care-meters');
  meters.hidden=state.stage==='egg'||state.isDead;
  if(!meters.hidden)meters.innerHTML=[['Food',`${state.hunger*25}%`],['Happy',`${state.happiness*25}%`],['Energy',`${Math.round(state.energy??100)}%`],['Health',`${Math.round(state.health??100)}%`]].map(([label,value])=>`<span class="need"><span>${label}</span><strong>${value}</strong></span>`).join('');
  const needs=document.getElementById('pet-needs');
  needs.hidden=state.stage!=='egg';
  document.getElementById('care-hint').textContent=careHint(state);
  const button=document.getElementById('care-btn');
  const action=careAction(state);
  button.querySelector('.label').textContent=action[0].toUpperCase()+action.slice(1);
  button.querySelector('.care-symbol').textContent=action==='clean'?'✧':action==='wake'?'☀':'☾';
  button.setAttribute('aria-label',`${action} pet`);
}

// Integer offsets preserve complete pixel cells and stay inside placement bounds.
export function motionOffset(time,kind='idle',options={}) {
  if(options.reducedMotion||options.eink||options.paused)return {x:0,y:0};
  const elapsed=Math.max(0,Number.isFinite(time)?time:0);
  if(kind==='land') {
    // One short drop, then a quiet settle. Never loop a falling character.
    if(elapsed>=650)return {x:0,y:0};
    const progress=Math.min(1,elapsed/450);
    return {x:0,y:Math.round(-2*(1-progress*progress))};
  }
  const bouncing=['eat','happy','play','evolve'].includes(kind);
  return {x:kind==='idle'?Math.round(Math.sin(elapsed/1600)):0,y:bouncing?-Math.round((Math.sin(elapsed/180)+1)/2):kind==='sleep'?-Math.round((Math.sin(elapsed/1300)+1)/2):0};
}

const tiltedFrames=new WeakMap();
export function tiltFrame(pixels,time) {
  // Small row shear gives a pixel tilt without resampling, cropping or moving effects.
  if(!pixels?.length||pixels[0].length>14)return pixels;
  const wave=Math.sin(time/1900),direction=wave>.45?1:wave<-.45?-1:0;
  if(!direction)return pixels;
  let cached=tiltedFrames.get(pixels);
  if(!cached){cached=new Map();tiltedFrames.set(pixels,cached);}
  if(cached.has(direction))return cached.get(direction);
  const width=pixels[0].length+2;
  const result=Object.freeze(pixels.map((row,y)=>{
    const shift=y<Math.ceil(pixels.length/2)?1+direction:1;
    return Object.freeze([...Array(shift).fill(0),...row,...Array(width-row.length-shift).fill(0)]);
  }));
  cached.set(direction,result);
  return result;
}
