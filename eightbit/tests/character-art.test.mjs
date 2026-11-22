import test from 'node:test';
import assert from 'node:assert/strict';
import { humanPose,humanActions,facings,playerLook,frameIndex,drawHuman,gaitFrame,companionScale,characterScale } from '../character-art.js';
import { scenePalette,applyPalette,pixelGrid } from '../pixel-renderer.js';

test('every human action has four explicit facings and stable idle ground anchors',()=>{
  for(const action of humanActions)for(const direction of facings)for(let frame=0;frame<8;frame++){
    const pose=humanPose(direction,action,frame);
    assert.equal(pose.direction,direction);assert.equal(pose.action,action);
    assert.ok(pose.hands.flat().every(Number.isFinite));
    if(action!=='walk')assert.deepEqual(pose.feet.map(p=>p[1]),[0,0]);
  }
  assert.throws(()=>humanPose('diagonal','idle'));
  assert.throws(()=>humanPose('up','missing'));
});

test('side bodies are narrower, sitting bends the body and walking uses discrete frames',()=>{
  assert.ok(humanPose('left').width<humanPose('down').width);
  assert.equal(humanPose('left','sit').seated,true);
  assert.ok(humanPose('left','sit').top>humanPose('left','idle').top);
  assert.equal(frameIndex(64,true),0);assert.equal(frameIndex(65,true),1);
  assert.equal(frameIndex(520,true),0);
});

test('contact hands stay on their prop through all action frames',()=>{
  const hands=[[91,64],[109,64]];
  for(let time=0;time<1200;time+=100){
    const rectangles=[];
    const ctx={save(){},restore(){},translate(){},scale(){},fillRect(...r){rectangles.push([...r,this.fillStyle]);}};
    drawHuman(ctx,{x:100,y:100,look:playerLook,direction:'up',action:'cabinet',contacts:hands,time,scale:1});
    for(const [hx,hy] of hands)assert.ok(rectangles.some(([x,y,w,h,color])=>color===playerLook.skin&&x<=hx-100&&x+w>hx-100&&y<=hy-100&&y+h>hy-100));
  }
});

test('final pixels are confined to the same 256 colors for every layer',()=>{
  assert.equal(pixelGrid,1,'the renderer must not discard half the sprite detail');
  assert.equal(scenePalette.length,256);
  const allowed=new Set(scenePalette.map(color=>color.join(',')));
  const data=new Uint8ClampedArray(4096*4);
  for(let i=0;i<data.length;i++)data[i]=(i*71+19)%256;
  applyPalette(data);
  for(let i=0;i<data.length;i+=4)assert.ok(allowed.has(Array.from(data.slice(i,i+3)).join(',')));
});

test('walking shoes touch a leg in every direction and frame',()=>{
  for(const direction of facings)for(const time of [0,65,130,195,260,325,390,455]){
    const rectangles=[];
    const ctx={save(){},restore(){},translate(){},scale(){},fillRect(x,y,w,h){rectangles.push({x,y,w,h,color:this.fillStyle});}};
    drawHuman(ctx,{x:0,y:0,direction,action:'walk',time});
    for(const shoe of rectangles.filter(r=>r.color===playerLook.shoes)){
      assert.ok(rectangles.some(leg=>leg.color===playerLook.skin&&leg.y<shoe.y&&leg.y+leg.h>=shoe.y&&leg.x<shoe.x+shoe.w&&leg.x+leg.w>shoe.x),`${direction} at ${time}`);
    }
  }
});

test('the planted side foot cancels forward travel during its stance',()=>{
  for(const direction of ['left','right']){
    const sign=direction==='left'?-1:1;
    for(let frame=0;frame<5;frame++){
      const pose=humanPose(direction,'walk',gaitFrame(frame*4));
      assert.equal(frame*4*sign+pose.feet[0][0],8*sign);
      assert.equal(pose.feet[0][1],0);
    }
  }
  assert.equal(gaitFrame(32),0);
});

test('companions keep their size relative to adults in every room',()=>{
  for(const room of ['town','arcade','cabin','rooftop'])for(const y of [260,380,480]){
    assert.ok(Math.abs(companionScale(room,y)/characterScale(room,y)-.75/.7)<.00001);
  }
});
