import test from 'node:test';
import assert from 'node:assert/strict';
import { bikePosition } from '../bikes.js';

test('bikes cross both edges before wrapping, in opposite directions', () => {
  assert.ok(bikePosition(0).x < -40);
  assert.ok(bikePosition(19800).x > 1060);
  assert.ok(bikePosition(19900).x < -40);
  assert.ok(bikePosition(1000).x > bikePosition(0).x);
  assert.ok(bikePosition(1000,1).x < bikePosition(0,1).x);
});
