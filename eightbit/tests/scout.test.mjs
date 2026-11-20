import test from 'node:test';
import assert from 'node:assert/strict';
import { scoutMoment, scoutSpeed } from '../scout.js';

const at = time => scoutMoment(time / scoutSpeed);

test('Scout leaves through the door, chases a squirrel and returns inside', () => {
  assert.ok(at(0).indoors);
  const exit = at(5000), outside = at(12000), watching = at(16000), returning = at(29000);
  assert.equal(exit.indoors,false);
  assert.ok(outside.y > exit.y && outside.walking);
  assert.ok(watching.watching && watching.squirrel.climbing);
  assert.ok(at(19000).squirrel.y < watching.squirrel.y);
  assert.ok(returning.walking && returning.x < watching.x);
  const entry = at(33000);
  assert.ok(entry.indoors);
  assert.equal(entry.x,exit.x); assert.equal(entry.y,exit.y);
});

test('Scout alternates trees without jumping between route segments', () => {
  assert.ok(at(17000).x > 875);
  assert.ok(at(67000).x < 875);
  for (let time=5001; time<100000; time+=10) {
    const before=at(time-10), after=at(time);
    assert.ok(Math.hypot(after.x-before.x,after.y-before.y) < 2);
  }
});
