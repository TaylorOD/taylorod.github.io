import test from 'node:test';
import assert from 'node:assert/strict';
import { bikePosition } from '../bikes.js';
import { createResidents, arcadeRegulars } from '../residents.js';

test('bikes cross both edges before wrapping, in opposite directions', () => {
  assert.ok(bikePosition(0).x < -40);
  assert.ok(bikePosition(19800).x > 1060);
  assert.ok(bikePosition(19900).x < -40);
  assert.ok(bikePosition(1000).x > bikePosition(0).x);
  assert.ok(bikePosition(1000,1).x < bikePosition(0,1).x);
});

test('one wheelchair user travels between town and the arcade', () => {
  assert.equal(createResidents().filter(p => p.look.chair).length,1);
  assert.equal(arcadeRegulars.filter(p => p.look.chair).length,0);
});
