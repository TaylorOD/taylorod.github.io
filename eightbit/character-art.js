// One body model for the player, neighbors, students and arcade regulars.
export const characterSizes={town: .8, arcade:1.75, cabin:2, rooftop:1.25};
export const facings=['down','left','right','up'];
export const humanActions=['idle','walk','carry','talk','sit','cabinet','pinball','poker','bar','read','type','wave'];
export const playerLook={skin:'#d5aa86',hair:'#684c3b',shirt:'#82b5d9',pants:'#253039',shoes:'#ef553e',width:21,bald:true,beard:true,hoodie:true,shorts:true};
export const frameIndex=(time,walking=false)=>Math.floor(Math.max(0,time)/(walking?130:300))%4;

export function humanPose(direction='down',action='idle',frame=0,look=playerLook) {
  if(!facings.includes(direction)||!humanActions.includes(action)) throw new Error('Unknown character pose');
  const side=direction==='left'||direction==='right',face=direction==='left'?-1:1;
  const seated=['sit','poker','type','cabinet'].includes(action),stride=action==='walk'?[0,3,0,-3][frame%4]:0;
  const width=side?Math.round((look.width||21)*.65):look.width||21;
  const top=action==='type'?-52:seated&&action!=='cabinet'?-40:-46,shoulder=top+19,hip=seated&&action!=='cabinet'?-13:-16;
  const hands=side?[[face*7,shoulder+15],[face*4,shoulder+14]]:[[-width/2-2,shoulder+15+stride],[width/2+2,shoulder+15-stride]];
  if(['cabinet','pinball','read','type','poker','bar'].includes(action)) {
    hands[0]=[side?face*16:-7,shoulder+8];hands[1]=[side?face*18:8,shoulder+8];
  }
  if(action==='carry') {hands[0]=[side?face*17:-7,-16];hands[1]=[side?face*22:8,-16];}
  if(action==='wave'||action==='talk'){hands[1]=[side?face*13:width/2+7,shoulder-(frame%2)*2];}
  return {direction,action,side,face,seated,stride,width,top,shoulder,hip,hands,feet:[[side?-3:-6,0],[side?4:6,0]],seat:[0,hip]};
}

function pixelLine(rect,from,to,color,width=3){
  let x=Math.round(from[0]),y=Math.round(from[1]);const tx=Math.round(to[0]),ty=Math.round(to[1]);
  const dx=Math.abs(tx-x),sx=x<tx?1:-1,dy=-Math.abs(ty-y),sy=y<ty?1:-1;let err=dx+dy;
  for(;;){rect(x-1,y-1,width,width,color);if(x===tx&&y===ty)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}
}

export function drawHuman(ctx,{x,y,look=playerLook,direction='down',action='idle',scale=1,time=0,contacts=null,carrying=false}) {
  const pose=humanPose(direction,action,frameIndex(time,action==='walk'),look);
  const {side,face,seated,stride,width,top,shoulder,hip}=pose;
  const skin=look.skin,pants=look.pants||'#324354',shoes=look.shoes||'#1f2632',shirt=look.shirt;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
  const rect=(a,b,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h));};
  rect(-width/2-2,1,width+4,2,'#203b3d');
  // Legs bend at the knee when sitting. Side views no longer keep a front torso.
  if(seated){
    if(side){rect(-5,hip,15,5,pants);rect(face>0?7:-8,hip+3,5,-hip-3,look.shorts?skin:pants);rect(face>0?6:-10,-2,9,3,shoes);}
    else {for(const dx of [-8,3]){rect(dx,hip,8,6,pants);rect(dx+1,hip+5,5,-hip-5,look.shorts?skin:pants);rect(dx,-2,9,3,shoes);}}
  } else {
    for(const [dx,swing] of [[side?-4:-8,stride],[side?2:3,-stride]]){
      const foot=action==='walk'?swing:0;
      rect(dx,hip,6,-hip-2,look.shorts?skin:pants);
      if(look.shorts)rect(dx,hip,7,7,pants);
      rect(dx+(side?foot:0),-2-(side?Math.abs(foot)/3:foot),8,3,shoes);
    }
  }
  rect(-width/2,shoulder,width,hip-shoulder+2,shirt);
  rect(width/2-3,shoulder+3,3,hip-shoulder-1,look.shade||'#496475');
  if(look.hoodie){
    rect(-width/2+1,shoulder+2,6,4,'#b7d8e9');rect(0,shoulder+8,side?5:9,5,'#a4cfe6');
    if(direction==='up'){rect(-7,shoulder,14,5,'#b7d8e9');rect(-5,shoulder+4,10,2,'#669ec9');}
    if(direction==='down'){rect(-4,shoulder+5,8,4,'#f8e7bd');rect(3,shoulder+4,3,4,'#f8e7bd');rect(-4,shoulder+9,2,2,'#f8e7bd');rect(2,shoulder+9,2,2,'#f8e7bd');}
  }
  const hands=contacts?contacts.map(([hx,hy])=>[(hx-x)/scale,(hy-y)/scale]):carrying?humanPose(direction,'carry',0,look).hands:pose.hands;
  for(let i=0;i<2;i++){
    if(side&&i===0&&!contacts&&!carrying)continue;
    const start=[side?face*3:(i?-1:1)*(-width/2),shoulder+3];
    const hand=hands[i]||hands[0];
    const elbow=[start[0]+(hand[0]-start[0])*.35,Math.max(start[1]+4,hand[1]+3)];
    pixelLine(rect,start,elbow,shirt,4);pixelLine(rect,elbow,hand,skin,3);rect(hand[0]-2,hand[1]-1,4,3,skin);
  }
  rect(-3,top+15,6,5,skin);
  rect(side?-6:-8,top+3,side?13:17,14,skin);rect(side?-3:-5,top,side?9:11,4,skin);
  if(!look.bald){
    rect(side?-7:-9,top,side?14:19,5,look.hair);
    if(direction==='up')rect(-8,top+3,17,14,look.hair);
    else if(side)rect(face>0?-7:1,top+3,7,10,look.hair);
    if(look.curls)for(let i=0;i<4;i++)rect(-10+i*5,top-2+i%2*2,6,6,look.hair);
    if(look.long){if(side)rect(face>0?-8:4,top+3,5,20,look.hair);else{rect(-9,top+3,4,20,look.hair);rect(7,top+3,4,20,look.hair);if(direction==='up')rect(-8,top+10,17,13,look.hair);}}
  }
  if(direction!=='up'){
    if(look.beard){rect(side?(face>0?0:-7):-7,top+12,side?8:15,7,look.hair);rect(side?(face>0?1:-6):-4,top+17,side?6:9,3,look.hair);}
    rect(side?(face>0?4:-5):-4,top+9,2,2,'#17292f');if(!side)rect(4,top+9,2,2,'#17292f');
    if(side)rect(face>0?7:-9,top+11,3,3,skin);
  }
  if(look.hat){rect(-10,top-2,20,6,'#daa34d');rect(side?(face>0?-9:-14):-13,top+3,side?24:27,3,'#daa34d');}
  if(look.cane){const hx=side?face*9:width/2+4;rect(hx,-16,2,18,'#b99c74');rect(hx-3,-17,5,2,'#b99c74');}
  if(carrying||action==='carry'){
    const px=side?(face>0?8:-26):-11,py=-23;
    if(direction!=='up'){rect(px,py,23,9,'#80664a');rect(px+1,py+1,21,6,'#e2bd85');rect(px+3,py+3,17,1,'#b77a54');}
    else {rect(-12,py,4,7,'#e2bd85');rect(9,py,4,7,'#e2bd85');}
  }
  ctx.restore();return pose;
}
