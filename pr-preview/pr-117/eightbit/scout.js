import { box, polygon } from './art.js';

const door = { x: 1416, y: 264 };
const porch = { x: 1382, y: 336 };
const mix = (a,b,t) => ({ x: a.x+(b.x-a.x)*t, y: a.y+(b.y-a.y)*t });
export const scoutSpeed = 1;
export const chaseTrees = [[1245,340],[1272,370],[1325,390],[1368,326],[1291,324],[1450,390]];

function along(points, phase) {
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));
  let remaining=Math.max(0,Math.min(1,phase))*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++) {
    if(remaining<=lengths[i]) return mix(points[i],points[i+1],remaining/lengths[i]);
    remaining-=lengths[i];
  }
  return points.at(-1);
}

export function scoutMoment(time) {
  const seconds=Math.max(0,Number.isFinite(time)?time:0)/1000, cycle=Math.floor(seconds/90), phase=seconds%90;
  const [tx,ty]=chaseTrees[cycle%chaseTrees.length], tree={x:tx,y:ty};
  const watch={x:tx-23,y:ty+3};
  const turns=cycle%2 ? [[1320,369],[1380,410],[1270,400],[1310,342],[1420,375]] : [[1410,384],[1305,412],[1240,384],[1340,350],[1285,400]];
  const route=[porch,...turns.map(([x,y])=>({x,y})),watch];
  const positionAt=p=>p<8||p>=66?door:p<11?mix(door,porch,(p-8)/3):p<41?along(route,(p-11)/30):p<53?watch:p<63?mix(watch,porch,(p-53)/10):mix(porch,door,(p-63)/3);
  const position=positionAt(phase), next=positionAt(Math.min(65.999,phase+.03));
  const indoors=phase<8||phase>=66, watching=phase>=41&&phase<53;
  let squirrel=null;
  if(phase>=11&&phase<62) {
    const ahead=along(route,Math.min(1,(phase-11+2)/30));
    squirrel=phase<39?{...ahead,x:ahead.x+23,y:ahead.y-3}:{x:tree.x,y:tree.y-Math.min(68,(phase-39)*28)};
    squirrel.climbing=phase>=39;squirrel.direction=1;
  }
  return {...position,direction:watching?1:next.x>=position.x?1:-1,walking:!indoors&&!watching,indoors,squirrel,
    vertical:!indoors&&(phase<11||phase>=63),entering:phase>=63,watching,
    jump:watching?Math.max(0,Math.sin((phase-41)*Math.PI*1.1))*9:0};
}

// Only some trips startle the elk. They return after Scout settles at the tree.
export function elkMoment(time) {
  const phase=time/1000%90, cycle=Math.floor(time/90000);
  if(cycle%3!==1||phase<9||phase>=62) return {offset:0,running:false};
  const offset=phase<16?(phase-9)/7*160:phase<51?160:(62-phase)/11*160;
  return {offset,running:phase<16||phase>=51};
}

export function drawScout(ctx, scout, time, sleeping = false) {
  ctx.save(); ctx.translate(Math.round(scout.x),Math.round(scout.y-(scout.jump||0))); ctx.scale(scout.direction || 1,1);
  const black = '#222d35', white = '#e6e3ce';
  if (sleeping) {
    polygon(ctx,[[-22,-3],[-25,-12],[-17,-21],[6,-23],[20,-14],[21,-4]],black);
    box(ctx,4,-19,10,15,white); box(ctx,11,-14,16,11,black); box(ctx,19,-8,11,6,white);
    box(ctx,26,-7,4,3,black); box(ctx,17,-14,5,7,'#151f28'); box(ctx,-18,-5,19,4,white);
    box(ctx,19,-10,4,1,'#c2c3b3'); ctx.restore(); return;
  }
  ctx.scale(.75,.75);
  const step = scout.walking ? Math.sin(time / 75) * 3 : 0;
  if (scout.vertical) {
    box(ctx,-10,-25,20,19,black); box(ctx,-8,-10,5,10+step,white); box(ctx,4,-10,5,10-step,white);
    box(ctx,-8,-34,17,16,black); box(ctx,-12,-32,5,11,'#17232c'); box(ctx,9,-32,5,11,'#17232c');
    if (!scout.entering) {
      box(ctx,-3,-31,5,9,white); box(ctx,-6,-24,13,7,white); box(ctx,-2,-24,5,3,black);
      box(ctx,-6,-29,2,2,'#d5b279'); box(ctx,5,-29,2,2,'#d5b279');
      box(ctx,-8,-17,17,3,'#b56d85'); box(ctx,-5,-14,10,9,white);
    } else { box(ctx,-8,-18,17,4,white); box(ctx,-2,-10,4,9,black); box(ctx,-2,-3,4,4,white); }
    ctx.restore(); return;
  }
  box(ctx,-22,-1,49,4,'#203c3f33');
  for (const [x,offset] of [[-15,step],[-7,-step],[11,-step],[18,step]]) {
    box(ctx,x,-12,4,11+offset,white); box(ctx,x-1,-2+offset,6,3,white);
    box(ctx,x+1,-6,1,2,'#6f7775');
  }
  polygon(ctx,[[-22,-13],[-19,-24],[7,-25],[19,-20],[20,-10],[-14,-9]],black);
  polygon(ctx,[[8,-25],[17,-26],[23,-17],[18,-7],[10,-10]],white);
  box(ctx,-5,-24,5,5,white);
  const wag = scout.walking || scout.watching ? Math.sin(time / 110) * 4 : 0;
  polygon(ctx,[[-19,-20],[-28,-24-wag],[-31,-20-wag],[-23,-14]],black);
  box(ctx,-32,-24-wag,5,5,white);
  box(ctx,14,-29,14,13,black); polygon(ctx,[[16,-28],[10,-27],[11,-16],[16,-19]],'#17232c');
  box(ctx,25,-22,9,7,white); box(ctx,31,-21,4,4,black);
  box(ctx,24,-28,2,2,'#dbb67b'); box(ctx,25,-26,2,6,white);
  box(ctx,28,-20,2,2,'#7d8580'); box(ctx,30,-17,2,1,black);
  polygon(ctx,[[14,-18],[24,-17],[23,-14],[15,-15]],'#b56d85');
  box(ctx,22,-14,2,3,'#c3b48e');
  if (scout.watching && Math.floor(time / 650) % 4 === 0) {
    box(ctx,41,-26,5,2,'#dcd7b6'); box(ctx,40,-32,3,3,'#dcd7b6');
  }
  ctx.restore();
}

function drawSquirrel(ctx, squirrel, time) {
  ctx.save(); ctx.translate(Math.round(squirrel.x),Math.round(squirrel.y));
  if (squirrel.climbing) ctx.rotate(-Math.PI/2);
  else ctx.scale(squirrel.direction,1);
  box(ctx,-7,-7,12,6,'#ac7950'); box(ctx,3,-10,7,7,'#b58b5c'); box(ctx,7,-8,2,2,'#2d3d34');
  box(ctx,3,-12,3,3,'#ac7950'); box(ctx,-5,-3,8,3,'#d4b081');
  polygon(ctx,[[-6,-5],[-13,-8],[-15,-18],[-11,-23],[-5,-22],[-3,-17],[-9,-17],[-8,-11],[-3,-9]],'#b58959');
  box(ctx,-5,-1,5,2,'#705c40'); ctx.restore();
}

export function scoutActors(ctx, room, time, reduced = false, layout = null) {
  const scout = scoutMoment(reduced ? 45000 : time);
  if (room === 'cabin' && scout.indoors) return [{ y: 296, draw: () => drawScout(ctx,{ x: 208, y: 296, direction: 1 },0,true) }];
  if (room !== 'town' || scout.indoors) return [];
  const actors = [{ y: scout.y, draw: () => drawScout(ctx,scout,reduced ? 0 : time * 1.6) }];
  if (scout.squirrel) actors.push({ y: scout.squirrel.y, draw: () => drawSquirrel(ctx,scout.squirrel,time) });
  return actors;
}
