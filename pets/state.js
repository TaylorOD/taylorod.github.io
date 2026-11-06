const HOUR = 60 * 60 * 1000;
export const petTypes = ['classic', 'pizza', 'cyberpunk'];
export const saveKey = 'taylor-pocket-pets-v1';

export function newPet(now = Date.now()) {
  return { born: now, updated: now, food: 65, fun: 65, energy: 80, clean: 90, asleep: false, care: 0 };
}

export function restoreSave(value, now = Date.now()) {
  const saved = value && typeof value === 'object' ? value : {};
  const pets = {};
  for (const type of petTypes) {
    const pet = saved.pets?.[type];
    const valid = pet && ['born', 'updated', 'food', 'fun', 'energy', 'clean', 'care'].every(key => Number.isFinite(pet[key]));
    pets[type] = valid ? {
      born: Math.min(now, Math.max(0, pet.born)),
      updated: Math.min(now, Math.max(0, pet.updated)),
      ...Object.fromEntries(['food', 'fun', 'energy', 'clean'].map(key => [key, Math.min(100, Math.max(0, pet[key]))])),
      asleep: pet.asleep === true,
      care: Math.max(0, Math.floor(pet.care)),
    } : newPet(now);
  }
  return { selected: petTypes.includes(saved.selected) ? saved.selected : 'pizza', pets };
}

export function advancePet(pet, now = Date.now()) {
  // Returning after a long break should still leave a pet you can care for.
  const hours = Math.min(8, Math.max(0, now - pet.updated) / HOUR);
  pet.food = Math.max(0, pet.food - hours * (pet.asleep ? 3 : 6));
  pet.fun = Math.max(0, pet.fun - hours * (pet.asleep ? 1 : 4));
  pet.clean = Math.max(0, pet.clean - hours * 3);
  pet.energy = Math.min(100, Math.max(0, pet.energy + hours * (pet.asleep ? 18 : -5)));
  pet.updated = now;
  return pet;
}

export function stageOf(pet) {
  if (pet.care >= 20) return 'grown up';
  if (pet.care >= 6) return 'growing';
  return 'little';
}

export function careFor(pet, action) {
  if (action === 'sleep') {
    pet.asleep = !pet.asleep;
    return pet.asleep ? 'lights out. see you in a bit.' : 'hey, you’re back.';
  }
  if (pet.asleep) return 'a little busy sleeping. wake me up first.';
  const stat = { feed: 'food', clean: 'clean', play: 'fun' }[action];
  if (!stat) return '';
  if (pet[stat] >= 99) return { feed: 'still full. maybe later?', clean: 'already looking pretty good.', play: 'that was fun. one more?' }[action];
  pet[stat] = Math.min(100, pet[stat] + (action === 'clean' ? 40 : 25));
  pet.care += 1;
  if (action === 'play') pet.energy = Math.max(0, pet.energy - 5);
  return { feed: 'excellent snack. no notes.', clean: 'fresh again. thanks for that.', play: 'nice. let’s do that again.' }[action];
}

export function petMood(pet) {
  if (pet.asleep) return 'sleeping';
  if (pet.food < 30) return 'snack time?';
  if (pet.energy < 30) return 'getting sleepy';
  if (pet.clean < 30) return 'could use a bath';
  if (pet.fun < 30) return 'let’s play';
  return 'pretty happy';
}
