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

test('unverified dimensions never pass and known painting conflicts remain visible',()=>{
  for(const id of ['cabinet','front-guard'])assert.equal(dimensionReport(landmarks.find(item=>item.id===id)).status,'mismatch');
  assert.equal(dimensionReport(landmarks.find(item=>item.id==='wilma-building')).status,'unmeasured');
  assert.equal(dimensionReport(landmarks.find(item=>item.id==='keyboard')).status,'provisional');
  assert.equal(dimensionReport(landmarks.find(item=>item.id==='desk')).status,'within range');
});
