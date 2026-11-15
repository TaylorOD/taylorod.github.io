import test from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../world.js';

test('click travel reaches a cabinet and triggers its action once', () => {
  const previous = Object.fromEntries(['matchMedia', 'ResizeObserver', 'document', 'window', 'requestAnimationFrame'].map(key => [key, globalThis[key]]));
  globalThis.matchMedia = () => ({ matches: false });
  globalThis.ResizeObserver = class { observe() {} };
  globalThis.document = { hidden: false, addEventListener() {} };
  globalThis.window = { addEventListener() {} };
  globalThis.requestAnimationFrame = () => 1;
  try {
    const actions = [];
    const canvas = { width: 800, height: 600, dataset: {}, getContext: () => ({}), getBoundingClientRect: () => ({ width: 1200, height: 900 }), addEventListener() {} };
    class HeadlessWorld extends World { draw() {} }
    const world = new HeadlessWorld(canvas, { progress: { pet: 'sprout', stamps: [] }, onAction: action => actions.push(action) });
    world.enter('arcade'); world.goTo('lilgotchi');
    let time = world.last;
    for (let i = 0; i < 1000; i++) { time += 16; world.tick(time); }
    assert.deepEqual(actions, ['project:lilgotchi']);
    assert.deepEqual(world.player, { x: 272, y: 496 });
    world.walk('arrowdown', true); world.walk('arrowdown', false);
    assert.equal(world.player.y, 504, 'a quick direction tap moves between frames');
    world.player.y = 496;
    world.pause(true); world.walk('arrowdown', true); world.tick(time + 16);
    assert.deepEqual(world.player, { x: 272, y: 496 }, 'dialogs pause movement');
  } finally { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } }
});
