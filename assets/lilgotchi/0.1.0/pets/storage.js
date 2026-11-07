export const petTypes = ['classic', 'pizza', 'cyberpunk'];
const requested = new URLSearchParams(globalThis.location?.search || '').get('pet');
export const petType = petTypes.includes(requested) ? requested : 'pizza';
export const saveKey = `taylor-pocket-pets-p1-v1-${petType}`;
const characters = ['egg','babytchi','marutchi','tamatchi','kuchitamatchi','mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi'];
const stages = ['egg','baby','child','teen','adult','dead'];
let bridge = null;
export function configureStorage(adapter) { bridge = adapter; }

export function validState(data) {
  if (!data || !stages.includes(data.stage) || !characters.includes(data.character)) return false;
  for (const key of ['age','weight','hunger','happiness','discipline','careMistakes','poopCount','bornAt','stageStartTime','lastHungerDecay','lastHappyDecay','lastPoopTime','lastAgeInc','lastProcessed','snacksInWindow','snackWindowStart','medDoses','sickCount']) {
    if (!Number.isFinite(data[key]) || data[key] < 0) return false;
  }
  if (data.hunger > 4 || data.happiness > 4 || data.discipline > 100 || data.poopCount > 4) return false;
  if (![data.hunger,data.happiness,data.discipline,data.poopCount].every(Number.isInteger)) return false;
  for (const key of ['isSick','isSleeping','lightOn','isDead','isMisbehaving']) if (typeof data[key] !== 'boolean') return false;
  return data.attentionCallTime === null || Number.isFinite(data.attentionCallTime);
}

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
