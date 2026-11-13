import { frameCharacter } from './catalog.js';
export const selectedCharacter=frameCharacter(new URLSearchParams(globalThis.location?.search || ''));
export const petTypes = ['classic', 'pizza', 'cyberpunk', 'lilgotchi'];
export const petType = selectedCharacter.skin;
export const saveKey = ['default','slice','cyberpunk'].includes(selectedCharacter.id) ? `taylor-pocket-pets-p1-v1-${petType}` : `lilgotchi:standalone:${selectedCharacter.id}`;
import { validState } from './valid-state.js';
export { validState } from './valid-state.js';
let bridge = null;
export function configureStorage(adapter) { bridge = adapter; }

function status(text) {
  const element = globalThis.document?.getElementById('save-status');
  if (element) element.textContent = text;
}

export function saveState(state) {
  if (bridge) { bridge.save(JSON.parse(JSON.stringify(state))); return true; }
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
    status('saved in this browser');
    return true;
  } catch {
    status('saving unavailable. progress lasts for this visit.');
    return false;
  }
}

export function loadState(state) {
  if (bridge) {
    const data = bridge.load();
    if (!validState(data)) return false;
    for (const key of Object.keys(state)) if (Object.hasOwn(data,key)) state[key]=data[key];
    return true;
  }
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!validState(data)) return false;
    // Only copy known state fields, not arbitrary properties from saved JSON.
    for (const key of Object.keys(state)) if (Object.hasOwn(data, key)) state[key] = data[key];
    return true;
  } catch { return false; }
}

export function clearState() {
  if (bridge) return;
  try { localStorage.removeItem(saveKey); } catch {}
}
