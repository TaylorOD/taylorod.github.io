import test from 'node:test';
import assert from 'node:assert/strict';
import { trailVisitors } from '../trail-visitors.js';
import { isWalkable, scenes } from '../scenes.js';

test('visitors and their dogs stay on both river paths through full cycles', () => {
  const banks = new Set(), kinds = new Set();
  for (let time = 0; time < 200000; time += 100) {
    for (const visitor of trailVisitors(time)) {
      banks.add(visitor.y); kinds.add(visitor.kind);
      for (const [x, y] of [[visitor.x, visitor.y], [visitor.dogX, visitor.dogY]]) {
        if (x >= 40 && x <= 984) assert.ok(isWalkable(scenes.town, x, y), `${x},${y}`);
      }
      assert.ok(Math.hypot(visitor.dogX - visitor.x, visitor.dogY - visitor.y) < 32);
    }
  }
  assert.deepEqual([...banks].sort(), [576, 704]);
  assert.equal(kinds.size, 2);
});

test('runners have quiet gaps and nobody wraps while visible', () => {
  let quiet = 0;
  for (let time = 0; time < 200000; time += 100) {
    const now = trailVisitors(time), next = trailVisitors(time + 100);
    if (!now.some(visitor => visitor.kind === 'jogger')) quiet++;
    for (const visitor of now) {
      const following = next.find(item => item.id === visitor.id);
      if (following) assert.ok(Math.abs(following.x - visitor.x) <= 8.3);
      else assert.ok(visitor.x < -50 || visitor.x > 1074);
    }
    for (const visitor of next.filter(item => !now.some(old => old.id === item.id))) assert.ok(visitor.x < -50 || visitor.x > 1074);
  }
  assert.ok(quiet > 800);
});

test('reduced motion keeps all trail visitors in a fixed pose', () => {
  assert.deepEqual(trailVisitors(0, true), trailVisitors(170000, true));
});
