import {sceneBodyScale} from './scale-rules.js';
import {roofRail} from './scene-fixtures.js';
// Hand positions are measured on the original furniture, in world pixels.
const cabinetCenters={lilgotchi:238,snowcrust:289,relay:338,fight:387,sweat:436,moonbean:486,reachoutt:531};
function cabinetPose(x,stature=1){let y=261;for(let i=0;i<6;i++)y=232+16*sceneBodyScale('arcade',y)*stature;return {x,y,direction:'up',action:'cabinet',hands:[[x-10,197],[x+10,197]]};}
export function interactionPose(room,point) {
  if(!point)return null;
  if(room==='arcade'&&cabinetCenters[point.id]) {
    const x=cabinetCenters[point.id];
    return cabinetPose(x);
  }
  if(room==='arcade'&&point.id==='pizza')return {x:400,y:480,direction:'left',action:'bar',hands:[[370,415],[365,423]]};
  if(room==='arcade'&&point.id==='poker')return {x:472,y:344,direction:'right',action:'poker',hands:[[501,293],[509,287]]};
  if(room==='cabin'&&point.id==='about')return {x:640,y:380,direction:'up',action:'type',hands:[[636,312],[652,315]]};
  if(room==='cabin'&&point.id==='books')return {x:384,y:328,direction:'up',action:'read',hands:[[357,265],[410,265]]};
  if(room==='cabin'&&point.id==='pets')return {x:350,y:344,direction:'left',action:'pet',hands:[[298,302],[300,304]]};
  if(room==='rooftop'&&point.id==='view')return {x:384,y:288,direction:'up',action:'idle'};
  if(point.id==='photo')return {x:point.x,y:point.y,direction:'down',action:'wave'};
  if(room==='town'&&point.id==='bench')return {x:point.x,y:point.y,direction:'up',action:'talk'};
  return {x:point.x,y:point.y,direction:point.hit&&point.hit[0]+point.hit[2]/2<point.x-40?'left':point.hit&&point.hit[0]>point.x+40?'right':'up',action:'idle'};
}

export function regularPose(resident) {
  if(resident.playing==='cabinet') {
    const x=Object.values(cabinetCenters).reduce((best,x)=>Math.abs(x-resident.x)<Math.abs(best-resident.x)?x:best,238);
    return cabinetPose(x,resident.look?.scale||1);
  }
  if(resident.playing==='bar')return {x:304,y:480,direction:'right',action:'bar',hands:[[340,415],[344,424]]};
  if(resident.playing==='poker')return {x:626,y:310,direction:'down',action:'poker',hands:[[616,270],[633,273]]};
  const first=resident.x>150;
  return first?{x:160,y:270,direction:'left',action:'pinball',hands:[[142,202],[131,212]]}:
    {x:130,y:308,direction:'left',action:'pinball',hands:[[113,250],[102,260]]};
}

// Redraw the original foreground pixels after each person. Unlike clipping a body
// rectangle, these masks follow the furniture edge and preserve arms above it.
export const furnitureMasks={
  arcade:[
    {behind:432,polygon:[[145,376],[151,364],[165,360],[335,360],[335,425],[326,432],[149,432]]},
    {behind:490,polygon:[[338,427],[366,427],[366,485],[358,493],[339,486]]},
    {behind:360,polygon:[[493,282],[505,266],[534,258],[571,254],[616,254],[652,260],[682,274],[694,292],[682,308],[663,353],[507,358],[493,320]]},
  ],
  cabin:[{behind:448,polygon:[[80,374],[115,381],[320,381],[328,431],[307,448],[84,448]]}],
  rooftop:[{behind:410,polygon:[[48,389],[718,389],[718,405],[48,405]]},
    {behind:410,polygon:[[48,356],[718,356],[718,361],[48,361]]},
    ...roofRail.posts.map(x=>({behind:410,polygon:[[x-3,354],[x+4,354],[x+4,403],[x-3,403]]})),
  ],
};

export function drawFurnitureFront(ctx,room,actor,image) {
  if(!image||!(image.width||image.naturalWidth))return;
  for(const mask of furnitureMasks[room]||[]) {
    const xs=mask.polygon.map(p=>p[0]);
    if(actor.y>mask.behind||actor.x<Math.min(...xs)-36||actor.x>Math.max(...xs)+36)continue;
    ctx.save();ctx.beginPath();mask.polygon.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(image,0,0,768,512);ctx.restore();
  }
  // Fingers rest above the tabletop while the torso and legs remain behind it.
  if(actor.hands&&['bar','poker'].includes(actor.action)&&actor.look) {
    ctx.fillStyle=actor.look.skin;
    for(const [x,y] of actor.hands)ctx.fillRect(Math.round(x)-3,Math.round(y)-2,6,4);
  }
}
