import test from 'node:test';
import assert from 'node:assert/strict';
import {bodyReference,projectHeight,dimensionReport} from '../scale-rules.js';
import {humanPose,facings,characterScale} from '../character-art.js';
import {campusScale} from '../campus-life.js';
import {landmarks} from '../scale-landmarks.js';

test('shorter legs preserve the head and floor anchors in every standing facing',()=>{
  for(const direction of facings){
    const current=humanPose(direction,'idle');
    const before=humanPose(direction,'idle',0,undefined,{...bodyReference,legUnits:23,torsoUnits:17});
    assert.equal(current.top,before.top);
    assert.equal(current.shoulder,before.shoulder);
    assert.deepEqual(current.feet,before.feet);
    assert.ok(current.hip>before.hip);
  }
});

test('physical height projection agrees with rendered adults through room and campus depth',()=>{
  for(const room of ['town','arcade','cabin','rooftop'])for(const y of [303,430,488,576]){
    const scale=characterScale(room,y)*(room==='town'?campusScale(420,y):1);
    const head=y+humanPose('down','idle').top*scale;
    assert.ok(Math.abs(projectHeight(room,[420,y],bodyReference.heightCm).y-head)<1e-8);
  }
});

test('every scene reference fits while uncertain anchors remain provisional',()=>{
  for(const item of landmarks){assert.notEqual(dimensionReport(item).status,'mismatch',item.id);assert.notEqual(dimensionReport(item).status,'unmeasured',item.id);}
  assert.equal(dimensionReport({...landmarks[0],confidence:'unknown'}).status,'unmeasured');
  assert.equal(dimensionReport(landmarks.find(item=>item.id==='keyboard')).status,'provisional');
  assert.equal(dimensionReport(landmarks.find(item=>item.id==='desk')).status,'within range');
});

test('the house path changes scale continuously and meets its door reference',()=>{
  const near=projectHeight('town',[1460,558],175),far=projectHeight('town',[1416,251],175);
  assert.equal(558-near.y,42);
  assert.ok(Math.abs(251-far.y-33.6)<1e-8);
  for(let y=252;y<558;y++)assert.ok(Math.abs(campusScale(1416,y)-campusScale(1416,y-1))<.001);
});
