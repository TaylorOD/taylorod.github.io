import { C } from './constants.js';
import { now } from './clock.js';
import { petType } from './storage.js';

export function updateStatus(state) {
  const status = document.getElementById('pet-status');
  if (!status) return;
  let text;
  if (state.stage === 'egg') {
    const seconds = Math.max(0, Math.ceil((C.EGG_MS - (now() - state.stageStartTime)) / 1000));
    text = `hatching in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}. your egg takes five minutes.`;
  } else if (state.isDead) text = `lived for ${state.age} days. start a new egg when you’re ready.`;
  else text = `${state.stage} · ${state.age} days · food ${state.hunger}/4 · happy ${state.happiness}/4${state.isSleeping ? ' · sleeping' : ''}${state.isSick ? ' · needs medicine' : ''}${state.isMisbehaving ? ' · needs discipline' : ''}`;
  status.textContent = text;
  document.getElementById('lcd').setAttribute('aria-label', `${petType} pet. ${text}`);
}
