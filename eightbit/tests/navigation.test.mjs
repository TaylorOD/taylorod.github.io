import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes, findPath, isWalkable } from '../scenes.js';
import { loadProgress } from '../content.js';

for (const [id, scene] of Object.entries(scenes)) {
  test(`${id}: every interaction can be reached without crossing scenery`, () => {
    assert.ok(isWalkable(scene, scene.spawn.x, scene.spawn.y), 'spawn is walkable');
    for (const target of scene.points) {
      assert.ok(isWalkable(scene, target.x, target.y), `${target.id} approach is clear`);
      const path = findPath(scene, scene.spawn, target);
      assert.ok(path.length, `${target.id} has a route`);
      let previous = scene.spawn;
      for (const step of path) {
        for (let fraction = 0; fraction <= 1; fraction += .1) {
          assert.ok(isWalkable(scene, previous.x + (step.x - previous.x) * fraction, previous.y + (step.y - previous.y) * fraction), `${target.id} path stays clear`);
        }
        previous = step;
      }
      assert.deepEqual(path.at(-1), { x: target.x, y: target.y });
    }
  });
}

test('the river and buildings cannot be crossed, but the bridge can', () => {
  assert.equal(isWalkable(scenes.town, 200, 640), false);
  assert.equal(isWalkable(scenes.town, 512, 640), true);
  assert.equal(isWalkable(scenes.town, 512, 320), false);
  assert.deepEqual(findPath(scenes.town, scenes.town.spawn, { x: 512, y: 320 }), []);
});

test('saved progress is validated and deduplicated', () => {
  const progress = loadProgress({ getItem: () => JSON.stringify({ pet: 'unknown', stamps: ['relay', 'relay', 'fake'], pizza: 'bad', adopted: true }) });
  assert.equal(progress.pet, 'slice'); assert.deepEqual(progress.stamps, ['relay']); assert.equal(progress.pizza, 'none'); assert.equal(progress.adopted, true);
});

test('blocked or corrupt storage does not stop the game', () => {
  assert.equal(loadProgress({ getItem() { throw new Error('blocked'); } }).pet, 'slice');
  assert.deepEqual(loadProgress({ getItem: () => '{' }).stamps, []);
  assert.deepEqual(loadProgress({ getItem: () => 'null' }).stamps, []);
});

test("old companion choices migrate without losing progress", () => {
  assert.equal(loadProgress({ getItem: () => JSON.stringify({ pet: "sprout" }) }).pet, "lilgotchi");
  assert.equal(loadProgress({ getItem: () => JSON.stringify({ pet: "pixel" }) }).pet, "cypunk");
});


test('both river banks have continuous paths connected by the bridge', () => {
  for (const y of [576, 704]) {
    for (let x = 48; x <= 976; x += 8) assert.ok(isWalkable(scenes.town, x, y), `${x},${y}`);
    const route = findPath(scenes.town, { x: 48, y }, { x: 976, y });
    assert.ok(route.length);
    assert.ok(route.every(step => step.y === y));
  }
  const crossing = findPath(scenes.town, { x: 48, y: 576 }, { x: 976, y: 704 });
  assert.ok(crossing.length);
  assert.ok(crossing.filter(step => step.y > 600 && step.y < 680).every(step => step.x >= 464 && step.x <= 560));
});
