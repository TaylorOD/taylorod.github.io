import test from 'node:test';
import assert from 'node:assert/strict';
import {Sound} from '../sound.js';

const sound = () => {
  const value=Object.create(Sound.prototype);
  value.context={state:'running',currentTime:1};value.enabled=true;
  value.notes=[];value.note=(...args)=>value.notes.push(args);
  return value;
};

test('music schedules once per beat and never catches up in a burst',()=>{
  const value=sound();value.playMusic();const first=value.notes.length;
  value.playMusic();assert.equal(value.notes.length,first);
  value.context.currentTime=120;value.playMusic();assert.equal(value.musicIndex,2);
  value.context.state='suspended';value.context.currentTime=140;value.playMusic();assert.equal(value.musicIndex,2);
});

test('scout only woofs nearby outside with a quiet interval between pairs',()=>{
  const value=sound(), calls=[];value.woof=delay=>calls.push(delay);
  value.scoutVoice('cabin',{x:1400,y:350},15000);assert.equal(calls.length,0);
  value.scoutVoice('town',{x:100,y:600},15000);assert.equal(calls.length,0);
  value.scoutVoice('town',{x:1400,y:350},15000);assert.deepEqual(calls,[0,.25]);
  value.scoutVoice('town',{x:1400,y:350},15500);assert.equal(calls.length,2);
});
