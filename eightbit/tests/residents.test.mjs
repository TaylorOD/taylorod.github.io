import test from 'node:test';
import assert from 'node:assert/strict';
import { createResidents, updateResidents } from '../residents.js';
import { scenes, isWalkable } from '../scenes.js';

test('town residents keep to reachable routes for a full walk cycle', () => {
  const residents = createResidents(scenes.town, 'town');
  assert.equal(residents.length, 8);
  assert.ok(residents.some(person => person.look.chair));
  assert.ok(residents.some(person => person.look.cane));
  for (let tick = 0; tick < 18000; tick++) {
    updateResidents(residents, scenes.town, 1 / 60, { x: -100, y: -100 });
    for (const person of residents) assert.ok(isWalkable(scenes.town, person.x, person.y));
  }
});
