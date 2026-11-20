import test from 'node:test';
import assert from 'node:assert/strict';
import {scoutMoment as rawScoutMoment,elkMoment as rawElkMoment,chaseTrees,scoutSpeed} from '../scout.js';
const scoutMoment = time => rawScoutMoment(time/scoutSpeed);
const elkMoment = time => rawElkMoment(time/scoutSpeed);

test('Scout follows a long chase before the squirrel climbs safely away',()=>{
  assert.ok(scoutMoment(0).indoors);
  for(const time of [12000,23000,37000]) assert.ok(scoutMoment(time).walking);
  const watch=scoutMoment(44000);
  assert.ok(watch.watching&&watch.squirrel.climbing);
  assert.ok(watch.squirrel.y<watch.y-60);
  assert.ok(scoutMoment(67000).indoors);
});
test('each tree is visited and movement stays continuous through six trips',()=>{
  const trees=new Set();
  for(let cycle=0;cycle<6;cycle++) trees.add(scoutMoment(cycle*90000+45000).x);
  assert.equal(trees.size,chaseTrees.length);
  for(let t=10;t<540000;t+=10) {
    const a=scoutMoment(t-10),b=scoutMoment(t);
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1);
  }
});
test('elk sometimes flee and then return',()=>{
  assert.equal(elkMoment(14000).offset,0);
  assert.ok(elkMoment(104000).offset>0);
  assert.equal(elkMoment(153000).offset,0);
  assert.equal(elkMoment(194000).offset,0);
});

test('startup clock jitter cannot crash Scout',()=>{
 for(const time of [-1,NaN,undefined]) assert.ok(scoutMoment(time).indoors);
});


test('the squirrel faces its direction of travel on both legs of the chase',()=>{
  const directions=new Set();
  for(let t=12000;t<37000;t+=100) {
    const a=scoutMoment(t).squirrel,b=scoutMoment(t+10).squirrel;
    if(Math.abs(b.x-a.x)>.01) {
      assert.equal(a.direction,Math.sign(b.x-a.x));
      directions.add(a.direction);
    }
  }
  assert.equal(directions.size,2);
});
