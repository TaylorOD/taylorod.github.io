import { PetSimulation } from '../pets/simulation.js';

export function careNeeds(state, memorialSeen) {
  if (!state || state.vacationAt > 0) return [];
  if (state.isDead) return String(state.bornAt) === memorialSeen ? [] : ['Remember your pet'];
  if (state.stage === 'egg') return [];
  return [state.hunger === 0 && 'Food', state.happiness === 0 && 'Play',
    state.isSick && 'Medicine', state.poopCount > 0 && 'Cleaning',
    state.isMisbehaving && 'Discipline'].filter(Boolean);
}

// Run the same absence simulation as the game, without mounting its UI or saving
// through standalone storage. The caller holds the family's save ownership.
export function advanceSavedPet(saved) {
  const app = Object.create(PetSimulation.prototype);
  app.state = structuredClone(saved);
  Object.defineProperty(app.state, 'save', { value() {} });
  app.sound = new Proxy({}, { get: () => () => {} });
  app.toast = app.updateButtons = app.showDeath = app.cancelGame = () => {};
  app.processMissedTime();
  return JSON.parse(JSON.stringify(app.state));
}

export async function refreshCare(store, families, activeFamily, advance = advanceSavedPet) {
  const entries = [];
  for (const family of families) {
    let acquired = false;
    try {
      // Never reload an active writer's revision or simulate its state twice.
      if (family === activeFamily) continue;
      const raw = store.raw(family);
      if (!raw) continue;
      const recent=JSON.parse(raw)?.state;
      if(recent && (Date.now()-recent.lastProcessed<60000 || recent.vacationAt>0 || recent.isDead)){
        const saved=store.load(family);
        entries.push({family,state:saved.state,stale:false});continue;
      }
      acquired = await store.acquire(family);
      const saved = store.load(family);
      if (!saved) continue;
      let state = saved.state;
      if (acquired) { state = advance(state); store.save(family, state); }
      entries.push({ family, state, stale: !acquired });
    } catch {
      // Keep the previous count if storage is unavailable or a save needs recovery.
    } finally {
      if (acquired) store.release(family);
    }
  }
  return entries;
}
