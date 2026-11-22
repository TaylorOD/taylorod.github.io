import test from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../world.js';
import {scenes} from '../scenes.js';
import {interactionPose} from '../interaction-art.js';

test('every interaction enters and leaves continuously before returning to its path anchor',()=>{
  for(const [room,scene] of Object.entries(scenes))for(const point of scene.points){
    const world=Object.assign(Object.create(World.prototype),{player:{x:point.x,y:point.y},interaction:interactionPose(room,point),interactionStarted:0,reduced:{matches:false},last:320});
    const start=world.visualActor(0),end=world.visualActor(320);
    assert.equal(start.x,point.x);assert.equal(start.y,point.y);assert.equal(start.pose.blend,0);
    assert.equal(end.x,world.interaction.x);assert.equal(end.y,world.interaction.y);assert.equal(end.pose.blend,1);
    world.clearInteraction();const leaving=world.visualActor(320);
    assert.equal(leaving.x,end.x);assert.equal(leaving.y,end.y);assert.equal(leaving.pose.blend,1);
    const returned=world.visualActor(640);assert.equal(returned.x,point.x);assert.equal(returned.y,point.y);assert.equal(returned.pose.blend,0);
    let prior=leaving;
    for(let time=336;time<=640;time+=16){const frame=world.visualActor(time);assert.ok(Math.hypot(frame.x-prior.x,frame.y-prior.y)<4,`${room}/${point.id}`);prior=frame;}
  }
});
