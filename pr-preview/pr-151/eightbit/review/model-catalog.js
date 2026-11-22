import { drawHuman,playerLook,facings,humanActions,characterScale,companionScale } from '../character-art.js';
import { looks } from '../residents.js';
import { students } from '../campus-life.js';
import { visitors,dogLooks,dog,jogger } from '../trail-visitors.js';
import { drawScout,drawSquirrel } from '../scout.js';
import { drawCompanion } from '../companions.js';
import { grazer } from '../wildlife.js';
import { drawBike } from '../bikes.js';
import { horse,carouselHorses } from '../carousel.js';
import { fisher,drawSurfer,drawRaft,raftPosition } from '../river-life.js';

const side=direction=>direction==='left'?-1:1;
const human=(id,name,look)=>({id,name,human:true,look,directions:facings,actions:humanActions,
  draw:(ctx,direction,action,time,room='town')=>drawHuman(ctx,{x:0,y:0,look,direction,action,time,scale:(look.scale||1)*characterScale(room,480),carrying:action==='carry'})});
const at=(ctx,x,y,draw)=>{ctx.save();ctx.translate(-x,-y);draw();ctx.restore();};
const horseLooks=carouselHorses(0);
export const models=[
  human('player','Taylor',playerLook),
  ...looks.map((look,i)=>human(`neighbor-${i}`,`Neighbor ${i+1}`,look)),
  ...students.map((look,i)=>human(`student-${i}`,`Student ${i+1}`,look)),
  ...visitors.map((look,i)=>look.kind==='dog'?human(`walker-${i}`,`Dog walker ${i-1}`,look):
    {id:`jogger-${i}`,name:`Jogger ${i+1}`,directions:['left','right'],actions:['run'],draw:(ctx,direction,action,time)=>jogger(ctx,{...look,x:0,y:0,direction:side(direction)},time)}),
  ...[0,1].map(i=>({id:`cyclist-${i}`,name:`Cyclist ${i+1}`,directions:['left','right'],actions:['ride'],draw:(ctx,direction,action,time)=>drawBike(ctx,{x:0,y:0,facing:side(direction)},time,i)})),
  {id:'fisher',name:'Fisher',directions:['right'],actions:['cast','drift'],draw:(ctx,d,a,t)=>at(ctx,83,779,()=>fisher(ctx,a==='cast'?t%4800:5200+t%6000))},
  {id:'surfer',name:'Surfer',directions:['right'],actions:['surf'],draw:(ctx,d,a,t)=>at(ctx,579+Math.sin(t/1400)*23,728+Math.sin(t/750)*3,()=>drawSurfer(ctx,t))},
  ...[0,1].map(i=>({id:`rafter-${i}`,name:`Rafter ${i+1}`,directions:['left'],actions:['paddle'],draw:(ctx,d,a,t)=>{const p=raftPosition(t);at(ctx,p.x,p.y,()=>drawRaft(ctx,t,[i?12:-15]));}})),
  ...['original','slice','lilgotchi','cypunk'].map(kind=>({id:kind,name:kind,directions:facings,actions:['idle','walk','sleep','happy'],draw:(ctx,d,a,t,room='town')=>drawCompanion(ctx,0,0,kind,t,a==='sleep',companionScale(room,480),d,a==='happy')})),
  {id:'scout',name:'Scout',directions:facings,actions:['idle','walk','watch','jump','sleep'],draw:(ctx,d,a,t,room='town')=>drawScout(ctx,{x:0,y:0,scale:characterScale(room,480),direction:side(d),vertical:['up','down'].includes(d),entering:d==='up',walking:a==='walk',watching:a==='watch',jump:a==='jump'?Math.max(0,Math.sin(t/200))*8:0},t,a==='sleep')},
  {id:'squirrel',name:'Squirrel',directions:['left','right','up'],actions:['run','climb'],supports:(direction,action)=>(direction==='up')===(action==='climb'),draw:(ctx,d,a,t)=>drawSquirrel(ctx,{x:0,y:0,depth:1,direction:side(d),climbing:a==='climb'},t)},
  ...[true,false].flatMap(elk=>[0,1].map(i=>({id:`${elk?'elk':'deer'}-${i}`,name:`${elk?'Elk':'Deer'} ${i+1}${elk?'':' (unused)'}`,directions:['left','right'],actions:['idle','graze'],draw:(ctx,d,a,t)=>grazer(ctx,0,0,i?.48:.65,elk,side(d),a==='graze'?4000:0,0)}))),
  ...dogLooks.map((look,i)=>({id:`dog-${i}`,name:`Trail dog ${i+1}`,directions:['left','right'],actions:['walk','sniff','wait'],draw:(ctx,d,a,t)=>dog(ctx,{...look,dogX:0,dogY:0,direction:side(d),activity:a,sniff:a==='sniff'?Math.max(0,Math.sin(t/400)):0},t)})),
  ...Array.from({length:6},(_,i)=>({id:`horse-${i}`,name:`Carousel horse ${i+1}`,directions:['left','right'],actions:['turn'],draw:(ctx,d,a,t)=>at(ctx,260,717,()=>horse(ctx,{...carouselHorses(t).find(item=>item.coat===horseLooks[i].coat),x:260,y:717,facing:side(d)}))})),
];

// Stature refers to the body, not hats, rods, boats or a bounding box around equipment.
for(const model of models){
  model.referenceDepth=/^(elk|deer)/.test(model.id)?.55:1;
  if(model.human)model.physicalReference=`${Math.round(175*(model.look.scale||1))} cm standing stature`;
  else if(/^(jogger|cyclist|fisher|surfer|rafter)/.test(model.id))model.physicalReference='175 cm adult, posed for the activity';
  else if(model.id==='scout')model.physicalReference='55 cm shoulder, 64 cm head, curled pose when sleeping';
  else if(model.id==='squirrel')model.physicalReference='34 cm including the raised tail';
  else if(model.id.startsWith('dog-')){const look=dogLooks[Number(model.id.slice(4))];model.physicalReference=`${Math.round(56.25*look.size*(look.long?.75:1))} cm shoulder`;}
  else if(/^(elk|deer)/.test(model.id))model.physicalReference=`${model.id.endsWith('0')?140:105} cm shoulder on the distant woodland plane`;
  else if(model.id.startsWith('horse-'))model.physicalReference='100 cm carousel pony shoulder, depth changes through the turn';
  else model.physicalReference='70 to 100 cm fictional companion, shape depends on family';
}
