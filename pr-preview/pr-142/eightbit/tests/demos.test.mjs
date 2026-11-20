import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemo, advanceDemo, demoView } from '../demos.js';

test('pizza stays unbaked until it goes through the oven', () => {
  let state = createDemo('snowcrust');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'toppings ready');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'in the oven');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'golden crust. ready to go.');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'out for delivery');
  assert.deepEqual(advanceDemo(state), createDemo('snowcrust'));
});

test('recovery uses a probe before traffic returns', () => {
  let state = advanceDemo(createDemo('relay'));
  assert.equal(demoView(state).title, 'east circuit open');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'one recovery probe');
  state = advanceDemo(state);
  assert.equal(demoView(state).title, 'east is back online');
});

test('care demo fills the belly and resets without changing the original state', () => {
  const original = createDemo('lilgotchi');
  let state = original;
  for (let i = 0; i < 3; i++) state = advanceDemo(state);
  assert.equal(demoView(state).value, 1);
  assert.equal(original.meals, 0);
  assert.deepEqual(advanceDemo(state), original);
});
