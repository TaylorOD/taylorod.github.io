import { C } from './constants.js';
import { now } from './clock.js';
import { petType } from './storage.js';
import { characterName } from './skins.js';

export function updateStatus(state) {
  const status = document.getElementById('pet-status');
  if (!status) return;
  let text;
  if (state.stage === 'egg') {
    const seconds = Math.max(0, Math.ceil((C.EGG_MS - ((state.vacationAt || now()) - state.stageStartTime)) / 1000));
    text = `hatching in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}. your egg takes 90 seconds.`;
  } else if (state.isDead) text = `lived for ${state.age} days. start again when you’re ready.`;
  else text = `${state.stage} · ${state.age} days · food ${state.hunger}/4 · happy ${state.happiness}/4${state.isSleeping ? ' · sleeping' : ''}${state.isSick ? ' · needs medicine' : ''}${state.isMisbehaving ? ' · needs discipline' : ''}`;
  if(state.vacationAt>0)text = `Vacation paused. ${text}`;
  status.textContent = ((petType === 'pizza' || petType === 'cyberpunk' || petType === 'lilgotchi') && state.stage !== 'egg' && !state.isDead ? characterName(state.character)+' · ' : '') + text.replace(/ · food \d\/4 · happy \d\/4/,'');
  status.hidden=state.stage==='egg';
  const needs=document.getElementById('pet-needs');
  if(needs) {
    const hearts=count=>'♥'.repeat(count)+'♡'.repeat(4-count);
    needs.textContent=state.stage==='egg'?`${characterName('egg').toUpperCase()} · ${text.split('.')[0]}`:state.isDead?'Rest in peace':`Food ${hearts(state.hunger)} ${state.hunger}/4 · Happy ${hearts(state.happiness)} ${state.happiness}/4`;
  }
  const familyName={classic:'Original',pizza:'Slice',cyberpunk:'Cypunk',lilgotchi:'Lilgotchi'}[petType]||petType;
  document.getElementById('lcd').setAttribute('aria-label', `${familyName} pet. ${text}`);
}


