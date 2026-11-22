import test from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../world.js';
import { scenes,isWalkable,findSmoothPath } from '../scenes.js';
import { interactionPose,regularPose,furnitureMasks } from '../interaction-art.js';
import { facings,humanPose,characterScale } from '../character-art.js';
import { arcadeRegulars } from '../residents.js';

test('every interaction is reachable both ways with clearance along the entire route',()=>{
  for(const [room,scene] of Object.entries(scenes))for(const point of scene.points)for(const [from,to] of [[scene.spawn,point],[point,scene.spawn]]) {
    const route=findSmoothPath(scene,from,to);
    assert.ok(route.length,`${room}/${point.id}`);
    let start=from;
    for(const end of route){
      const steps=Math.ceil(Math.hypot(end.x-start.x,end.y-start.y)*2);
      for(let i=0;i<=steps;i++)assert.ok(isWalkable(scene,start.x+(end.x-start.x)*i/steps,start.y+(end.y-start.y)*i/steps),`${room}/${point.id} path`);
      start=end;
    }
    assert.deepEqual(start,{x:to.x,y:to.y});
  }
});

test('all arrival directions resolve to the object pose and release on movement',()=>{
  const keys=['matchMedia','ResizeObserver','document','window','requestAnimationFrame'];
  const previous=Object.fromEntries(keys.map(key=>[key,globalThis[key]]));
  Object.assign(globalThis,{matchMedia:()=>({matches:false}),ResizeObserver:class{observe(){}},document:{hidden:false,addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame:()=>1});
  try{
    class HeadlessWorld extends World{draw(){}}
    const canvas={dataset:{},getContext:()=>({}),getBoundingClientRect:()=>({width:960,height:620}),addEventListener(){}};
    const actions=[];
    const world=new HeadlessWorld(canvas,{progress:{pizza:'delivered'},onAction:action=>actions.push(action)});
    world.residents=[];
    for(const [room,scene] of Object.entries(scenes))for(const point of scene.points)for(const direction of facings){
      world.enter(room);world.direction=direction;actions.length=0;world.goTo(point.id);
      let time=world.last;
      for(let i=0;i<6000&&!actions.length;i++){time+=16;world.tick(time);assert.ok(isWalkable(scene,world.player.x,world.player.y));}
      assert.deepEqual(actions,[point.action],`${room}/${point.id} from ${direction}`);
      assert.deepEqual(world.interaction,interactionPose(room,point));
      assert.equal(world.direction,world.interaction.direction);
      world.tick(time+16);assert.equal(actions.length,1);
      world.walk('arrowdown',true);assert.equal(world.interaction,null);
    }
  }finally{for(const key of keys){if(previous[key]===undefined)delete globalThis[key];else globalThis[key]=previous[key];}}
});

test('furniture anchors stay within arm reach and behind the correct foreground',()=>{
  const poses=Object.entries(scenes).flatMap(([room,scene])=>scene.points.map(point=>[room,interactionPose(room,point)]));
  poses.push(...arcadeRegulars.map(resident=>['arcade',regularPose(resident)]));
  for(const [room,pose] of poses){
    const body=humanPose(pose.direction,pose.action),scale=characterScale(room,pose.y);
    for(const [x,y] of pose.hands||[]){
      const shoulder=[pose.x+(body.side?body.face*3:Math.sign(x-pose.x)*body.width/2)*scale,pose.y+(body.shoulder+3)*scale];
      assert.ok(Math.hypot(x-shoulder[0],y-shoulder[1])<31*scale,`${room} ${pose.action} arm reach`);
    }
  }
  const bartender=regularPose(arcadeRegulars.find(r=>r.playing==='bar'));
  assert.ok(bartender.x>165&&bartender.x<335&&bartender.y>432&&bartender.y<492,'bartender is inside the lower L shaped service area');
  const customer=interactionPose('arcade',{id:'pizza'});
  assert.ok(customer.x>369,'customer is outside the short return');
  assert.equal(bartender.direction,'right');assert.equal(customer.direction,'left');
  for(const pose of [bartender,customer]){
    const body=humanPose(pose.direction,pose.action),scale=characterScale('arcade',pose.y);
    const head=pose.y+body.top*scale,shoulder=pose.y+body.shoulder*scale;
    const counter=pose.hands[0][1];
    assert.ok(counter-head>42,'the full head and shoulders clear the counter');
    assert.ok(counter>shoulder&&counter<shoulder+26*scale,'counter is between shoulder and relaxed hand height');
  }
  for(const r of arcadeRegulars.filter(r=>r.playing==='cabinet')){
    const pose=regularPose(r),body=humanPose(pose.direction,pose.action);
    assert.equal(pose.y+body.seat[1]*characterScale('arcade',pose.y),232);
  }
});
