import test from 'node:test';
import assert from 'node:assert/strict';
import { advancePet, careFor, newPet, restoreSave, stageOf } from './state.js';

test('each pet keeps its own progress through a save round trip', () => {
  const save = restoreSave(null, 1000);
  careFor(save.pets.pizza, 'feed');
  save.selected = 'cyberpunk';
  const loaded = restoreSave(JSON.parse(JSON.stringify(save)), 2000);
  assert.equal(loaded.selected, 'cyberpunk');
  assert.equal(loaded.pets.pizza.food, 90);
  assert.equal(loaded.pets.classic.food, 65);
  assert.equal(loaded.pets.cyberpunk.food, 65);
});

test('sleep restores energy and prevents feeding until waking', () => {
  const pet = newPet(0);
  pet.energy = 10;
  careFor(pet, 'sleep');
  careFor(pet, 'feed');
  assert.equal(pet.food, 65);
  advancePet(pet, 3600000);
  assert.equal(pet.energy, 28);
  careFor(pet, 'sleep');
  careFor(pet, 'feed');
  assert.equal(pet.food, 87);
});

test('long absences are bounded and repeated catch up does not double count', () => {
  const pet = newPet(0);
  advancePet(pet, 3600000 * 100);
  assert.equal(pet.food, 17);
  const snapshot = { ...pet };
  advancePet(pet, 3600000 * 100);
  assert.deepEqual(pet, snapshot);
});

test('invalid saves recover and saved numbers are clamped', () => {
  const saved = restoreSave({ selected: 'bad', pets: { classic: { food: 'oops' }, pizza: { ...newPet(5000), food: 900, energy: -50 } } }, 1000);
  assert.equal(saved.selected, 'pizza');
  assert.deepEqual(saved.pets.classic, newPet(1000));
  assert.equal(saved.pets.pizza.food, 100);
  assert.equal(saved.pets.pizza.energy, 0);
  assert.equal(saved.pets.pizza.updated, 1000);
});

test('care grows the pet without credit for feeding a full pet', () => {
  const pet = newPet(0);
  pet.care = 5;
  careFor(pet, 'feed');
  assert.equal(stageOf(pet), 'growing');
  careFor(pet, 'feed');
  careFor(pet, 'feed');
  assert.equal(pet.care, 7);
  pet.care = 20;
  assert.equal(stageOf(pet), 'grown up');
});
