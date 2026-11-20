import test from 'node:test';
import assert from 'node:assert/strict';
import { castMoment, raftPosition, raftScale } from '../river-life.js';
test('fly casting alternates with a longer downstream drift',()=>{
  assert.ok(castMoment(1000).casting);
  assert.notEqual(castMoment(1000).angle,castMoment(3000).angle);
  assert.equal(castMoment(6000).casting,false);
  assert.ok(castMoment(11000).drift>castMoment(6000).drift);
});
test('raft travels downstream and wraps beyond both visible edges',()=>{
  assert.ok(raftPosition(10000).x>raftPosition(20000).x);
  assert.ok(raftPosition(0).x>1536+38);
  assert.ok(raftPosition(62990).x < -38);
});

test('raft clears the surfboard throughout its crossing',()=>{
  for(let time=0;time<63000;time+=100) {
    const raft=raftPosition(time);
    const surfBottom=735+Math.sin(time/750)*3+3;
    assert.ok(raft.y-24*raftScale>surfBottom);
  }
});
