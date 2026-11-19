import test from 'node:test';
import assert from 'node:assert/strict';
import { followTrail } from '../companions.js';
import { scenes, isWalkable, findPath } from '../scenes.js';

test('companion follows a turning route around a cabinet without cutting through it', () => {
  const scene = scenes.arcade;
  const companion = { ...scene.spawn };
  const trail = [];
  const route = findPath(scene, scene.spawn, { x: 272, y: 496 });
  for (const player of route) {
    for (let tick = 0; tick < 8; tick++) {
      followTrail(companion, trail, player, 1 / 60);
      assert.ok(isWalkable(scene, companion.x, companion.y));
    }
  }
  assert.ok(Math.hypot(companion.x - 272, companion.y - 496) < 40);
});
