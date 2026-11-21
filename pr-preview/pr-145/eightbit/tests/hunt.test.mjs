import test from 'node:test';
import assert from 'node:assert/strict';
import {discover,discoveries} from '../hunt.js';
import {loadProgress} from '../content.js';
const load=saved=>loadProgress({getItem:()=>JSON.stringify(saved)});
test('each discovery needs its own event and cannot be collected twice',()=>{
 const progress=load({});
 assert.equal(discover(progress,'delivery'),null);
 assert.equal(discover(progress,'fake'),null);
 for(const item of discoveries) {
  if(item.id==='slice')progress.pizza='delivered';
  assert.equal(discover(progress,item.event).id,item.id);
  assert.equal(discover(progress,item.event),null);
 }
 assert.equal(progress.found.length,4);
 assert.equal(progress.pet,'lilgotchi');
 assert.ok(progress.adopted);
 assert.deepEqual(load(progress).found,progress.found);
});
test('old companions and deliveries survive migration, corrupt discoveries do not',()=>{
 const progress=load({pet:'pixel',adopted:true,pizza:'delivered',stamps:['relay'],found:['fake','original','original']});
 assert.deepEqual(progress.found,['original','cypunk','slice']);
 assert.deepEqual(progress.stamps,['relay']);
 assert.equal(progress.pet,'cypunk');
 assert.deepEqual(load({}).found,[]);
});
