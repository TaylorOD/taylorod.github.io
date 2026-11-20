import test from 'node:test';
import assert from 'node:assert/strict';
import { daylight, dayLength } from '../daylight.js';

test('the outdoor clock visits every phase and wraps without a lighting jump', () => {
  assert.equal(dayLength, 360000);
  const labels = new Set();
  for (let time=0;time<dayLength;time+=1000) {
    const light=daylight(time); labels.add(light.label);
    assert.ok(light.night>=0 && light.night<=.48);
    assert.ok(light.lights>=0 && light.lights<=1);
    assert.ok(light.stars>=0 && light.stars<=1.000001);
    const next=daylight(time+1);
    assert.ok(Math.abs(next.night-light.night)<.001);
    assert.ok(Math.abs(next.sun.x-light.sun.x)<.001);
  }
  assert.deepEqual([...labels],['sunset','blue hour','night','dawn','daytime']);
  assert.deepEqual(daylight(0),daylight(dayLength));
  assert.ok(Math.abs(daylight(dayLength-1).sun.y-daylight(0).sun.y)<.01);
});

test('stars and lamps come on at night, with a warm fixed sunset for reduced motion', () => {
  const night=daylight(dayLength*.4), day=daylight(dayLength*.8), sunset=daylight(dayLength*.06);
  assert.equal(night.lights,1); assert.ok(night.stars>.99); assert.ok(night.moon.y<100);
  assert.equal(day.lights,0); assert.equal(day.stars,0);
  assert.ok(sunset.warmth>day.warmth); assert.equal(sunset.label,'sunset');
  assert.deepEqual(daylight(0,true),daylight(dayLength*.4,true));
});
