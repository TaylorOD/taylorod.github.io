import test from 'node:test';
import assert from 'node:assert/strict';
import { scoutMoment } from '../scout.js';

test('Scout leaves through the door, chases a squirrel and returns inside', () => {
  assert.ok(scoutMoment(0).indoors);
  const exit = scoutMoment(5000), outside = scoutMoment(12000), watching = scoutMoment(16000), returning = scoutMoment(29000);
  assert.equal(exit.indoors,false);
  assert.ok(outside.y > exit.y && outside.walking);
  assert.ok(watching.watching && watching.squirrel.climbing);
  assert.ok(scoutMoment(19000).squirrel.y < watching.squirrel.y);
  assert.ok(returning.walking && returning.x < watching.x);
  const entry = scoutMoment(33000);
  assert.ok(entry.indoors);
  assert.equal(entry.x,exit.x); assert.equal(entry.y,exit.y);
});

test('Scout alternates trees without jumping between route segments', () => {
  assert.ok(scoutMoment(17000).x > 875);
  assert.ok(scoutMoment(67000).x < 875);
  for (let time=5001; time<100000; time+=10) {
    const before=scoutMoment(time-10), after=scoutMoment(time);
    assert.ok(Math.hypot(after.x-before.x,after.y-before.y) < 2);
  }
});
