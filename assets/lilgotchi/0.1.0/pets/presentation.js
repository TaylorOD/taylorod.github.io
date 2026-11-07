import { careGrade } from './wellbeing.js';
import { characterName } from './skins.js';

export function periodAt(date) {
  const hour=date.getHours();
  return hour>=6&&hour<11?'morning':hour>=11&&hour<16?'afternoon':hour>=16&&hour<19?'evening':'night';
}
export function careAction(state) {
  return state.poopCount>0?'clean':state.isSleeping?'wake':'sleep';
}
export function careHint(state) {
  if(state.isDead)return 'Your pet has passed away. Start again when you are ready.';
  if(state.stage==='egg')return 'Your egg takes five minutes to hatch. Care starts after hatching.';
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
  const scene=state.isSleeping?'sleep':period;
  if(document.documentElement.dataset.scene!==scene){document.documentElement.dataset.scene=scene;renderer?.updateColors();}
  identity.textContent=`${characterName(state.character)} · ${state.stage}`;
  identity.title=`Starting character and current identity are independent. Care: ${grade.label}.`;
  const meters=document.getElementById('care-meters');
  meters.hidden=state.stage==='egg'||state.isDead;
  if(!meters.hidden)meters.innerHTML=[['Food',`${state.hunger*25}%`],['Happy',`${state.happiness*25}%`],['Energy',`${Math.round(state.energy??100)}%`],['Health',`${Math.round(state.health??100)}%`]].map(([label,value])=>`<span class="need"><span>${label}</span><strong>${value}</strong></span>`).join('')+`<span class="care-grade">Care: ${grade.label}</span>`;
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
export function motionOffset(time,kind='idle') {
  return {x:kind==='idle'?Math.round(Math.sin(time/1600)):0,y:kind==='eat'||kind==='happy'?-Math.round((Math.sin(time/180)+1)/2):kind==='sleep'?-Math.round((Math.sin(time/1300)+1)/2):0};
}
