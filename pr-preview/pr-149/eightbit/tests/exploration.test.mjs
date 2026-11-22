import test from 'node:test';
import assert from 'node:assert/strict';
import { canEnter, hitTest, nearbyPath } from '../navigation.js';
import { scenes, isWalkable } from '../scenes.js';

test('rooftop access requires the completed delivery', () => {
  for (const pizza of ['none', 'carrying', undefined]) assert.equal(canEnter('rooftop', { pizza }), false);
  assert.equal(canEnter('rooftop', { pizza: 'delivered' }), true);
  assert.equal(canEnter('arcade', {}), true);
});

test('the ladder wins its overlapping building hit area', () => {
  assert.equal(hitTest(scenes.town, { x: 1420, y: 500 }).id, 'roof');
  assert.equal(hitTest(scenes.town, { x: 1304, y: 500 }).id, 'arcade');
  assert.equal(hitTest(scenes.town, { x: 1416, y: 200 }).id, 'cabin');
});

test('a blocked ground tap finds a nearby reachable tile', () => {
  const path = nearbyPath(scenes.town, scenes.town.spawn, { x: 200, y: 640 });
  assert.ok(path.length);
  assert.ok(path.every(point => isWalkable(scenes.town, point.x, point.y)));
  assert.ok(Math.hypot(path.at(-1).x - 200, path.at(-1).y - 640) < 60);
});

test('the indoor stairs connect the arcade and roof with clear landings', () => {
  const stair = scenes.arcade.points.find(point => point.id === 'roof');
  assert.equal(stair.action, 'roof');
  assert.equal(hitTest(scenes.arcade, { x: 680, y: 420 }).id, 'roof');
  assert.ok(isWalkable(scenes.arcade, stair.x, stair.y));
  assert.equal(scenes.rooftop.points.find(point => point.id === 'exit').action, 'room:arcade');
});
