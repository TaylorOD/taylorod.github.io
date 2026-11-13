const hour = 3600000;
const clamp = value => Math.max(0, Math.min(100, value));

// Additive companion metrics. Original P1 care and evolution rules stay separate.
export function initializeWellbeing(state, now) {
  if (!Number.isFinite(state.energy)) state.energy = 100;
  if (!Number.isFinite(state.health)) state.health = state.isSick ? 60 : 100;
  if (!Number.isFinite(state.wellbeingUpdatedAt)) state.wellbeingUpdatedAt = now;
  if (!Number.isFinite(state.careTotal)) state.careTotal = 0;
  if (!Number.isFinite(state.careDuration)) state.careDuration = 0;
  if (!['auto', 'sleep', 'wake'].includes(state.sleepOverride)) state.sleepOverride = 'auto';
  if (!Number.isFinite(state.sleepOverrideUntil)) state.sleepOverrideUntil = 0;
  return state;
}

export function advanceWellbeing(state, now) {
  initializeWellbeing(state, now);
  if (now <= state.wellbeingUpdatedAt) return state;
  const elapsed = Math.min(now - state.wellbeingUpdatedAt, 25 * 24 * hour);
  state.wellbeingUpdatedAt = now;
  if (state.isDead || state.stage === 'egg') return state;
  const hours = elapsed / hour;
  const beforeEnergy = state.energy, beforeHealth = state.health;
  state.energy = clamp(state.energy + hours * (state.isSleeping ? 20 : -5));
  const neglected = state.hunger === 0 || state.happiness === 0 || state.poopCount >= 3;
  state.health = clamp(state.health + hours * (state.isSick ? -8 : neglected ? -4 : 4));
  const score = (state.hunger * 25 + state.happiness * 25 + (beforeEnergy + state.energy) / 2 + (beforeHealth + state.health) / 2) / 4;
  state.careTotal += score * elapsed;
  state.careDuration += elapsed;
  return state;
}

export function applyWellbeingAction(state, action, now) {
  advanceWellbeing(state, now);
  if (state.isDead || state.stage === 'egg') return;
  if (action === 'play') state.energy = clamp(state.energy - 5);
  if (action === 'meal') state.energy = clamp(state.energy + 2);
  if (action === 'cured') state.health = clamp(state.health + 10);
}

export function setManualSleep(state, sleeping, now) {
  advanceWellbeing(state, now);
  if (state.isDead || state.stage === 'egg') return false;
  state.sleepOverride = sleeping ? 'sleep' : 'wake';
  state.sleepOverrideUntil = now + 2 * hour;
  state.isSleeping = sleeping;
  state.lightOn = !sleeping;
  if (!sleeping) {
    state.lastHungerDecay = now;
    state.lastHappyDecay = now;
    state.lastPoopTime = now;
  }
  return true;
}

export function sleepDecision(state, scheduled, now) {
  initializeWellbeing(state, now);
  const sleptLongEnough = now >= state.sleepOverrideUntil - 2 * hour + 300000;
  if (state.sleepOverride === 'sleep' && state.energy >= 100 && sleptLongEnough) {
    state.sleepOverride = 'wake';
    state.sleepOverrideUntil = now + 2 * hour;
  }
  if (now >= state.sleepOverrideUntil) state.sleepOverride = 'auto';
  if (state.sleepOverride === 'sleep') return true;
  if (state.sleepOverride === 'wake') return false;
  return scheduled;
}

export function careGrade(state) {
  if (!state.careDuration || state.careDuration < 600000) return { label: 'Getting started', score: null };
  const score = clamp(state.careTotal / state.careDuration);
  return { label: score >= 90 ? 'Perfect' : score >= 75 ? 'Good' : score >= 50 ? 'Normal' : 'Bad', score: Math.round(score) };
}
