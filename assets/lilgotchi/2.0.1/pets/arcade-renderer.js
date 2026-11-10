import { classicSprites } from './classic-sprites.js';
import { FIELD_WIDTH, FIELD_HEIGHT, headingPose } from './arcade-geometry.js';

const arrowPixels = {
 left:[[2,0],[1,1],[0,2],[1,3],[2,4],[1,2],[2,2],[3,2],[4,2]],
 right:[[2,0],[3,1],[4,2],[3,3],[2,4],[0,2],[1,2],[2,2],[3,2]],
 up:[[2,0],[1,1],[3,1],[0,2],[4,2],[2,1],[2,2],[2,3],[2,4]],
};

export function drawArcade(q, s, sprite, palette = [], options = {}) {
 const reducedMotion = options.reducedMotion ?? globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
 const frames = options.frames || {idle1:sprite};
 const idle = frames.idle1 || sprite;
 const opponent = options.opponent;
 const rivalFrames = opponent?.frames || classicSprites.mametchi;
 const foreground = options.foreground || '#0f380f';
 const background = options.background || '#c4cfa1';
 const field = q('.arcade-field');
 field.width = FIELD_WIDTH; field.height = FIELD_HEIGHT;
 const ctx = field.getContext('2d');
 ctx.fillStyle = background; ctx.fillRect(0,0,FIELD_WIDTH,FIELD_HEIGHT);
 const rect = (x,y,w,h,color=foreground) => {ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 const pose = direction => frames[{left:'lookLeft',right:'lookRight',up:'lookUp'}[direction]] || idle;
 const pet = (frame, x, bottom, {rival=false,fallen=false}={}) => {
  const width = fallen ? frame.length : Math.max(...frame.map(row=>row.length));
  const height = fallen ? Math.max(...frame.map(row=>row.length)) : frame.length;
  const left=Math.max(0,Math.min(FIELD_WIDTH-width,Math.round(x)));
  const top=Math.max(0,Math.min(FIELD_HEIGHT-height,Math.round(bottom-height)));
  for(let row=0;row<frame.length;row++)for(let col=0;col<frame[row].length;col++){
   const pixel=frame[row][col];if(!pixel)continue;
   rect(left+(fallen?frame.length-1-row:col),top+(fallen?col:row),1,1,rival?(opponent?.palette[pixel]||foreground):palette[pixel]||foreground);
  }
 };
 const centered = (frame,bottom=24) => pet(frame,(FIELD_WIDTH-frame[0].length)/2,bottom);
 const arrow = (direction,x,y,color=foreground) => {for(const [dx,dy] of arrowPixels[direction]||[])rect(x+dx,y+dy,1,1,color);};
 const reaction = (x,y,good) => {
  if(good){rect(x+1,y,1,1);rect(x,y+1,3,1);rect(x+1,y+2,1,1);}
  else {rect(x+1,y,1,2);rect(x+1,y+3,1,1);}
 };

 if(s.id==='get'){
  const frame=s.reaction==='happy'?frames.happy||idle:s.reaction==='startled'?frames.sad||idle:idle;
  pet(frame,s.lane*10+5-frame[0].length/2,24);
  if(s.object){
   const occupiedTop=idle.findIndex(row=>row.some(Boolean));
   const catchY=FIELD_HEIGHT-idle.length+Math.max(0,occupiedTop)-2;
   const x=s.object.lane*10+4,y=s.object.y/10*catchY;
   if(s.object.kind==='note'){rect(x+2,y,1,3);rect(x,y+2,3,1);}
   else {rect(x+1,y,1,1,'#825b41');rect(x,y+1,3,2,'#825b41');}
  }
 }
 if(s.id==='heading'){
  const geometry=headingPose(idle,s.x,s.jump);
  pet(idle,geometry.left,geometry.top+idle.length);
  rect(s.ball.x,s.ball.y,2,2);
 }
 if(s.id==='bump'){
  const reveal=s.phase==='reveal',time=s.phaseTime||0;
  const contact=reveal&&time>=250&&time<1000;
  const fallen=contact&&!reducedMotion&&time>=400;
  const playerLoses=s.boutWon===false;
  const player=frames.lookRight||idle;
  pet(player,contact&&!playerLoses?5:1,24,{fallen:fallen&&playerLoses});
  pet(rivalFrames.lookLeft||rivalFrames.idle1,contact&&playerLoses?17:21,24,{rival:true,fallen:fallen&&!playerLoses});
  if(reveal)reaction(playerLoses?6:25,5,false);
 }
 if(s.id==='memory'){
  const direction=s.phase==='watch'?s.cue:s.lastInput;
  centered(pose(direction));
  if(direction)arrow(direction,14,3);
  if(s.result)reaction(14,3,s.result==='win');
 }
 if(s.id==='flag'){
  centered(pose(s.response));
  const flag=(left,raised)=>{
   const x=left?6:25,y=raised?10:18;
   rect(x,y,1,5);rect(left?x-3:x+1,y,3,2,left?'#365f54':'#934d42');
  };
  flag(true,s.response==='left'||s.response==='both');
  flag(false,s.response==='right'||s.response==='both');
  if(s.phase==='cue'){
   if(s.cue==='fake'){
    for(let i=0;i<5;i++){rect(14+i,2+i,1,1);rect(18-i,2+i,1,1);}
   }else if(s.cue==='both'){arrow('left',8,2);arrow('right',19,2);}
   else arrow(s.cue,14,2);
  }
  if(s.phase==='rest')reaction(14,3,s.correct);
 }
 q('.arcade-meter').hidden=!['bump','hoops'].includes(s.id);
 if(['bump','hoops'].includes(s.id)){
  const target=s.id==='bump'?s.target:[s.target.min*100,s.target.max*100];
  q('.arcade-meter span').style.cssText=`left:${target[0]}%;width:${target[1]-target[0]}%`;
  q('.arcade-meter i').style.left=`${s.id==='bump'?s.meter:s.marker*100}%`;
 }
 if(s.id==='sprint'){
  for(let y=0;y<FIELD_HEIGHT;y++)rect(31,y,1,1,y%2?background:foreground);
  const player=frames.lookRight||idle;
  const end=30-player[0].length;
  pet(player,Math.min(end,s.progress/s.finish*end),12);
  const rival=rivalFrames.lookRight||rivalFrames.idle1;
  pet(rival,Math.min(30-rival[0].length,s.opponent/s.finish*(30-rival[0].length)),24,{rival:true});
  if(s.phase==='countdown'||(s.phase==='race'&&s.elapsed<1000)){
   const active=s.phase==='race'?2:s.countdown>1500?0:1;
   rect(23,1,5,11,'#17282e');
   for(let i=0;i<3;i++)rect(24,2+i*3,3,2,i===active?['#ef7971','#f5d56e','#83da9c'][i]:'#455459');
  }
 }
 if(s.id==='hoops'){
  const frame=s.phase==='arc'?frames.eat||idle:frames.lookRight||idle;
  pet(frame,0,24);
  rect(30,3,1,20);rect(29,3,1,4);rect(27,23,5,1);
  rect(24,9,7,1,'#ad5a35');
  rect(25,10,1,2);rect(29,10,1,2);rect(26,12,1,2);rect(28,12,1,2);rect(26,13,3,1);
  if(s.ball){rect(s.ball.x,s.ball.y,2,2,'#f6a64b');rect(s.ball.x,s.ball.y+1,1,1,'#8a4726');}
 }
}
