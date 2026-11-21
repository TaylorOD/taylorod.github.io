import { box, polygon } from './art.js';
import { drawResident } from './residents.js';

export function castMoment(time) {
  const phase = (time % 12000) / 12000;
  const casting = phase < .4;
  const swing = casting ? Math.sin(phase / .4 * Math.PI * 4) : 1;
  return { phase, casting, angle: -.9 + swing * .85, drift: casting ? 0 : (phase - .4) / .6 };
}

export const raftScale = .65;

export function raftPosition(time) {
  return { x: 1630 - (time / 36 % 1750), y: 758 + Math.sin(time / 2700) };
}

function stroke(ctx, points, color, width = 1) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.stroke();
}

function fisher(ctx, time) {
  const hand = [95,752];
  drawResident(ctx, { x:83, y:779, direction:'right', walking:false,
    contacts:[hand,[93,757]],look:{skin:'#b58261',hair:'#dad4bd',shirt:'#b46f44',width:23,hat:true} },0,true);
  const cast = castMoment(time);
  const tip = [hand[0] + Math.cos(cast.angle) * 54, hand[1] + Math.sin(cast.angle) * 54 - 27];
  stroke(ctx, [hand, [hand[0]+(tip[0]-hand[0])*.6, hand[1]+(tip[1]-hand[1])*.6-4], tip], '#54573c', 2);
  stroke(ctx, [[91,757],[99,746]], '#bc9562', 3);
  box(ctx,90,756,5,5,'#c9c4a6');box(ctx,92,758,2,2,'#384c49');
  ctx.strokeStyle='#e4dcc0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...tip);
  if(cast.casting) {
    const reach = Math.sin(cast.phase/.4*Math.PI*4)*62;
    ctx.bezierCurveTo(tip[0]+reach,tip[1]-28,tip[0]+reach+22,tip[1]-20,tip[0]+reach-12,tip[1]+10);
  } else {
    const flyX=188-cast.drift*31, flyY=734+cast.drift*14;
    ctx.quadraticCurveTo(169,712,flyX,flyY);
    box(ctx,flyX,flyY,2,1,'#f0dab2');
  }
  ctx.stroke();
}

export function drawRiverLife(ctx,time,reduced=false) {
  const t=reduced?5200:time;
  ctx.save();ctx.beginPath();ctx.rect(0,680,820,92);ctx.rect(979,680,557,92);ctx.clip();
  for(let i=0;i<42;i++) {
    const x=(1536+i*127-t/90%1536)%1536,y=710+(i*19)%59;
    box(ctx,x,y,8+i%4*5,1,i%3?'#75aaa3':'#b1d0bd');
  }
  // The fixed wave holds its crest while foam washes downstream.
  for(let row=0;row<4;row++) for(let i=0;i<13;i++) {
    const x=526+i*9-row*5, y=721+row*6+Math.sin(i*.8+t/450)*2;
    box(ctx,x,y,7,2,row%2?'#cbdcd0':'#8fbdb4');
    box(ctx,x-9-(t/100%9),y+3,4,1,'#b0cec1');
  }
  const surfX=579+Math.sin(t/1400)*23, surfY=735+Math.sin(t/750)*3;
  polygon(ctx,[[surfX-17,surfY],[surfX-10,surfY-3],[surfX+18,surfY-2],[surfX+12,surfY+3]],'#e1ad56');
  stroke(ctx,[[surfX-9,surfY-2],[surfX-4,surfY-12],[surfX+4,surfY-16],[surfX+10,surfY-2]],'#344b53',3);
  polygon(ctx,[[surfX-5,surfY-24],[surfX+5,surfY-25],[surfX+6,surfY-14],[surfX-3,surfY-12]],'#b85e48');
  box(ctx,surfX-3,surfY-33,8,8,'#c89c76');box(ctx,surfX-3,surfY-35,9,4,'#38433a');
  stroke(ctx,[[surfX-14,surfY-20],[surfX-4,surfY-23],[surfX+4,surfY-22],[surfX+16,surfY-17]],'#c89c76',3);
  const raft=raftPosition(t), x=0, y=0;
  ctx.save();ctx.translate(raft.x,raft.y);ctx.scale(raftScale,raftScale);
  polygon(ctx,[[x-30,y-10],[x+25,y-10],[x+34,y],[x+25,y+10],[x-30,y+10],[x-38,y]],'#ba6749');
  polygon(ctx,[[x-25,y-5],[x+23,y-5],[x+26,y+4],[x-26,y+4]],'#344e4d');
  for(const offset of [-15,12]) {
    box(ctx,x+offset-5,y-13,10,12,'#d5a34a');box(ctx,x+offset-4,y-21,8,8,'#bb9270');box(ctx,x+offset-5,y-24,10,5,'#698d91');
    const paddle=Math.sin(t/420+offset)*5;
    stroke(ctx,[[x+offset,y-9],[x+offset-16,y+12+paddle]],'#d7c39a',2);
    stroke(ctx,[[x+offset-16,y+12+paddle],[x+offset-22,y+18+paddle]],'#dfb367',4);
  }
  ctx.restore();ctx.restore();
  fisher(ctx,t);
}

