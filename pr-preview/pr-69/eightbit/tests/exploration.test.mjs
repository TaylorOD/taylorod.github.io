import test from 'node:test';
import assert from 'node:assert/strict';
import { canEnter, hitTest, nearbyPath, mapPosition } from '../navigation.js';
import { scenes, isWalkable } from '../scenes.js';

test('rooftop access requires the completed delivery', () => {
  for (const pizza of ['none', 'carrying', undefined]) assert.equal(canEnter('rooftop', { pizza }), false);
  assert.equal(canEnter('rooftop', { pizza: 'delivered' }), true);
  assert.equal(canEnter('arcade', {}), true);
});

test('the ladder wins its overlapping building hit area', () => {
  assert.equal(hitTest(scenes.town, { x: 692, y: 350 }).id, 'roof');
  assert.equal(hitTest(scenes.town, { x: 512, y: 280 }).id, 'arcade');
  assert.equal(hitTest(scenes.town, { x: 864, y: 200 }).id, 'cabin');
});

test('a blocked ground tap finds a nearby reachable tile', () => {
  const path = nearbyPath(scenes.town, scenes.town.spawn, { x: 200, y: 640 });
  assert.ok(path.length);
  assert.ok(path.every(point => isWalkable(scenes.town, point.x, point.y)));
  assert.ok(Math.hypot(path.at(-1).x - 200, path.at(-1).y - 640) < 60);
});

test('map marker follows outdoor movement and identifies indoor buildings', () => {
  assert.deepEqual(mapPosition('town', { x: 512, y: 384 }), { x: 70, y: 48 });
  assert.deepEqual(mapPosition('cabin', {}), { x: 118, y: 29 });
});
