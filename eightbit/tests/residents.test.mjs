import test from 'node:test';
import assert from 'node:assert/strict';
import { createResidents, updateResidents } from '../residents.js';
import { scenes, isWalkable } from '../scenes.js';

test('town residents keep to reachable routes for a full walk cycle', () => {
  const residents = createResidents(scenes.town, 'town');
  assert.equal(residents.length, 9);
  assert.ok(residents.some(person => person.look.chair));
  assert.ok(residents.some(person => person.look.cane));
  const visited = new Set();
  for (let tick = 0; tick < 18000; tick++) {
    updateResidents(residents, scenes.town, 1 / 60, { x: -100, y: -100 });
    residents.forEach(person => visited.add(person.room));
    for (const person of residents) assert.ok(person.seated || isWalkable(scenes[person.room], person.x, person.y));
  }
  assert.ok(visited.has('arcade'));
  assert.ok(!visited.has('workshop'));
  assert.equal(scenes.workshop, undefined);
  assert.ok(!visited.has('cabin'));
});


test('neighbors rest, chat, go home through the Wilma and return after dawn', () => {
  const residents = createResidents(), activities = new Set();
  for (let tick = 0; tick < 36000; tick++) {
    const time = tick * 1000 / 60;
    updateResidents(residents, scenes.town, 1 / 60, { x: -100, y: -100 }, 'town', time);
    for (const resident of residents) {
      if (resident.resting) activities.add(resident.resting);
      if (resident.home) { assert.equal(resident.x, 64); assert.equal(resident.y, 464); }
    }
    if (tick === 13000) assert.ok(residents.filter(r => r.home).length >= 5);
    if (tick === 17000) assert.equal(residents.filter(r => r.home).length, 0);
  }
  assert.ok(activities.has('sit'));
  assert.ok(activities.has('talk'));
});
