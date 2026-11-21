import { characterSizes } from './character-art.js';
import { lMountain } from './l-mountain.js';
import { woodlandTrees, woodlandForeground, behindWoodlandBuildings } from './woodland.js';
import { hiddenFriends } from './hunt-art.js';
import { drawRiverLife } from './river-life.js';
import { box, polygon, person, pet, text } from './art.js';
import { daylight, paintSky } from './daylight.js';
import { drawResident } from './residents.js';
import { trailActors, trailVisitors } from './trail-visitors.js';
import { drawBike } from './bikes.js';
import { horse, carouselHorses } from './carousel.js';
import { campusActors, campusScale } from './campus-life.js';
import { scoutActors, elkMoment } from './scout.js';
import { grazer } from './wildlife.js';
import { riverTree } from './town-trees.js';
import { riverTrees, treeOpacity } from './depth.js';
import { townLayout } from './town-layout.js';

let painting;
export function loadTownArt() {
  if (painting || typeof Image === 'undefined') return;
  painting = new Image();
  painting.src = new URL('./assets/town.png', import.meta.url).href;
}

function sky(ctx,light) {
  // Mask follows the mountain skyline so the painted hills retain their detail.
  ctx.save();
  const skyline = [[0,0],[1536,0],[1536,94],[1455,147],[1455,121],[1444,121],[1444,144],
    [1415,94],[1387,146],[1367,142],[1350,143],[1326,148],[1277,126],[1200,85],[1171,59],
    [1150,72],[1132,72],[1115,79],[1105,89],[1078,102],[994,156],[980,148],[962,156],
    [910,136],[857,125],[820,94],[780,116],[766,116],[674,160],[534,84],[425,110],
    [356,68],[214,150],[74,110],[56,108],[26,90],[0,104]];
  ctx.beginPath(); skyline.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
  ctx.clip();
  ctx.globalAlpha=1;
  paintSky(ctx,1536,210,light);
  ctx.globalAlpha=1; lMountain(ctx);
  ctx.restore();
}

function lampGlow(ctx,x,y,radius,strength) {
  const opacity=ctx.globalAlpha;
  for(let dy=-radius;dy<radius;dy+=4) for(let dx=-radius;dx<radius;dx+=4) {
    const falloff=Math.max(0,1-Math.hypot(dx+2,dy+2)/radius);
    if(!falloff) continue;
    ctx.globalAlpha=opacity*strength*falloff*falloff;
    box(ctx,x+dx,y+dy,4,4,'#ffd398');
  }
  ctx.globalAlpha=opacity;
}

function lighting(ctx,light) {
  ctx.save();ctx.globalAlpha=light.night;box(ctx,0,0,1536,1024,'#07162f');ctx.restore();

  ctx.save();ctx.globalAlpha=light.lights;
  for(const [x,y] of [[55,562],[802,561],[1441,560],[101,880],[436,840],[736,894]]) {
    lampGlow(ctx,x,y,40,.32);box(ctx,x-5,y-7,10,12,'#ffe2a9');
  }
  for(const [x,y] of [[133,510],[602,487],[743,490],[900,490],[1076,489],[1305,516],[1416,218]]) lampGlow(ctx,x,y,28,.22);
  ctx.globalAlpha=light.lights*.13;
  polygon(ctx,[[1288,554],[1319,554],[1357,599],[1251,599]],'#ffdb9d');ctx.restore();
}

function carousel(ctx,time,reduced) {
  ctx.save();ctx.beginPath();ctx.rect(187,880,191,60);ctx.clip();
  // Reuse the turning horse animation, positioned inside the painted pavilion.
  ctx.translate(284,916);ctx.scale(1.45,1.1);ctx.translate(-260,-717);
  for(const item of carouselHorses(time,reduced)) horse(ctx,item);
  ctx.restore();
}

export function drawTown(world,time) {
  const {ctx,canvas,player,companion,progress}=world;
  const reduced=world.reduced.matches, moment=world.lifeTime, light=daylight(moment,reduced);
  loadTownArt();
  box(ctx,0,0,canvas.width,canvas.height,'#172d33');
  if (!painting?.complete || !painting.naturalWidth) {
    canvas.dataset.art='loading'; text(ctx,'opening main street…',canvas.width/2,canvas.height/2,16);return;
  }
  canvas.dataset.art='ready'; canvas.dataset.daylight=light.label;
  const label=`town:${light.label}`;
  if(world.skyLabel!==label) { world.skyLabel=label;world.onDaylight?.('town',light.label); }
  ctx.save();ctx.translate(-Math.round(world.camera.x),-Math.round(world.camera.y));
  ctx.drawImage(painting,0,0,1536,1024);
  sky(ctx,light);
  box(ctx,704,439,94,15,'#244a42');text(ctx,'BASAL',751,447,13,'#efd197');
  box(ctx,1007,430,136,18,'#244a42');text(ctx,'SBG MISSOULA',1075,439,11,'#efd197');
  const elk=elkMoment(reduced?0:moment), bounce=elk.running?Math.sin(moment/80)*3:0;

  drawRiverLife(ctx,moment,reduced);carousel(ctx,moment,reduced);

  box(ctx,1413,479,3,75,'#8b947f');box(ctx,1425,479,3,75,'#8b947f');
  for(let y=486;y<554;y+=10) box(ctx,1413,y,15,2,'#b2b79a');
  const actors=trailActors(ctx,moment,reduced,townLayout);
  actors.push(
    {y:374+bounce,draw:()=>behindWoodlandBuildings(ctx,()=>grazer(ctx,1260-elk.offset,374+bounce,.65,true,elk.running?-1:1,reduced?0:moment,0))},
    {y:362-bounce,draw:()=>behindWoodlandBuildings(ctx,()=>grazer(ctx,1304-elk.offset,362-bounce,.48,true,-1,reduced?0:moment,2))},
    ...woodlandTrees.map(tree=>({y:tree.y,draw:()=>woodlandForeground(ctx,painting,tree)})),
  );
  actors.push(...hiddenFriends(ctx,'town',progress,reduced?0:moment));
  for(let i=0;i<2;i++) {
    const travel=((reduced?6000:moment)/1000*(i?48:58)+i*730)%1664;
    const bike={x:i?1600-travel:travel-64,y:i?586:579,facing:i?-1:1};
    actors.push({y:bike.y,draw:()=>drawBike(ctx,bike,reduced?0:moment,i)});
  }
  actors.push(...campusActors(ctx,moment,reduced), ...scoutActors(ctx,'town',moment,reduced,townLayout).map(actor=>({
    ...actor,draw:()=>behindWoodlandBuildings(ctx,actor.draw),
  })));
  for(const resident of world.residents.filter(r=>r.room==='town'&&!r.hidden&&!r.home)) actors.push({y:resident.y,draw:()=>drawResident(ctx,resident,moment,reduced)});
  if(progress.adopted) actors.push({y:companion.y,draw:()=>pet(ctx,companion.x,companion.y,progress.pet,reduced?0:moment,false,.75*campusScale(companion.x,companion.y),companion.direction)});
  actors.push({y:player.y,draw:()=>person(ctx,player.x,player.y,world.direction,world.walking&&!reduced,moment,progress.pizza==='carrying',characterSizes.town*campusScale(player.x,player.y),progress.pizza==='carrying'?null:world.interaction)});
  const visible = [player, companion, ...trailVisitors(moment, reduced, townLayout), ...world.residents.filter(r => r.room === 'town' && !r.home)];
  for (const [x, y, size] of riverTrees) actors.push({ y, draw: () => {
    ctx.save(); ctx.globalAlpha = treeOpacity([x, y, size], visible);
    riverTree(ctx, x, y, size, x === 1490); ctx.restore();
  }});
  actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());
  if(progress.pizza==='delivered') { box(ctx,543,623,24,5,'#e9ba79');text(ctx,'THANKS!',552,592,8,'#f1d8a7'); }
  if(world.target&&world.path.length) {const {x,y}=world.target;box(ctx,x-5,y,10,2,'#efdbab');box(ctx,x,y-5,2,10,'#efdbab');}
  lighting(ctx,light);
  for(const point of world.scene.points) if(point.id===world.hovered?.id) {
    const y=point.hit?point.hit[1]-12:point.y-60, width=point.label.length*7+16;
    box(ctx,point.x-width/2,y-20,width,23,'#142d35');text(ctx,point.label,point.x,y-9,11,'#f3dfb6');
  }
  ctx.restore();
}
