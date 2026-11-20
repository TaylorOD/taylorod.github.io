import test from 'node:test';
import assert from 'node:assert/strict';
import { campusWalker, campusScale } from '../campus-life.js';
import { scenes, findPath } from '../scenes.js';

test('the campus trail reaches the entrance from main street', () => {
  const path = findPath(scenes.town, scenes.town.spawn, { x: 192, y: 288 });
  assert.ok(path.length);
  assert.deepEqual(path.at(-1), { x: 192, y: 288 });
  assert.equal(findPath(scenes.town, scenes.town.spawn, { x: 192, y: 240 }).length, 0);
});

test('campus walkers recede toward the door and return at street size', () => {
  const street = campusWalker(0), door = campusWalker(33000), home = campusWalker(66000);
  assert.ok(door.y < street.y && door.look.scale < street.look.scale);
  assert.equal(door.y, 273);
  assert.deepEqual(home, street);
  assert.equal(campusWalker(50000).direction, 'down');
  assert.ok(campusScale(192, 288) < campusScale(164, 440));
  assert.equal(campusScale(512, 488), 1);
});
