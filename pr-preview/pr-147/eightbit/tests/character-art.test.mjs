import test from 'node:test';
import assert from 'node:assert/strict';
import { humanPose,humanActions,facings,playerLook,frameIndex,drawHuman } from '../character-art.js';
import { scenePalette,applyPalette } from '../pixel-renderer.js';

test('every human action has four explicit facings and stable ground anchors',()=>{
  for(const action of humanActions)for(const direction of facings)for(let frame=0;frame<4;frame++){
    const pose=humanPose(direction,action,frame);
    assert.equal(pose.direction,direction);assert.equal(pose.action,action);
    assert.ok(pose.hands.flat().every(Number.isFinite));
    assert.deepEqual(pose.feet.map(p=>p[1]),[0,0]);
  }
  assert.throws(()=>humanPose('diagonal','idle'));
  assert.throws(()=>humanPose('up','missing'));
});

test('side bodies are narrower, sitting bends the body and walking uses discrete frames',()=>{
  assert.ok(humanPose('left').width<humanPose('down').width);
  assert.equal(humanPose('left','sit').seated,true);
  assert.ok(humanPose('left','sit').top>humanPose('left','idle').top);
  assert.equal(frameIndex(129,true),0);assert.equal(frameIndex(130,true),1);
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
  assert.equal(scenePalette.length,256);
  const allowed=new Set(scenePalette.map(color=>color.join(',')));
  const data=new Uint8ClampedArray(4096*4);
  for(let i=0;i<data.length;i++)data[i]=(i*71+19)%256;
  applyPalette(data);
  for(let i=0;i<data.length;i+=4)assert.ok(allowed.has(Array.from(data.slice(i,i+3)).join(',')));
});

test('walking shoes touch a leg in every direction and frame',()=>{
  for(const direction of facings)for(const time of [0,130,260,390]){
    const rectangles=[];
    const ctx={save(){},restore(){},translate(){},scale(){},fillRect(x,y,w,h){rectangles.push({x,y,w,h,color:this.fillStyle});}};
    drawHuman(ctx,{x:0,y:0,direction,action:'walk',time});
    for(const shoe of rectangles.filter(r=>r.color===playerLook.shoes)){
      assert.ok(rectangles.some(leg=>leg.color===playerLook.skin&&leg.y<-3&&leg.y+leg.h>=shoe.y&&leg.x<shoe.x+shoe.w&&leg.x+leg.w>shoe.x),`${direction} at ${time}`);
    }
  }
});
