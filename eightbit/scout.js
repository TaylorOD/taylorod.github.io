import { box, polygon } from './art.js';

const door = { x: 875, y: 255 };
const porch = { x: 875, y: 310 };
const mix = (a,b,t) => ({ x: a.x+(b.x-a.x)*t, y: a.y+(b.y-a.y)*t });

// Scout has one continuous trip, with the doorway shared by exit and return.
export const scoutSpeed = 2.5;
export function scoutMoment(time) {
  const seconds = time * scoutSpeed / 1000, phase = seconds % 50;
  const right = Math.floor(seconds / 50) % 2 === 0;
  const tree = { x: right ? 980 : 763, y: right ? 405 : 410 };
  const clearing = { x: right ? 915 : 827, y: 350 };
  const watch = { x: tree.x + (right ? -25 : 25), y: tree.y + 3 };
  let position = door, direction = right ? 1 : -1, walking = false, indoors = false;
  if (phase < 5 || phase >= 33) indoors = true;
  else if (phase < 8) { position = mix(door,porch,(phase-5)/3); walking = true; }
  else if (phase < 12) { position = mix(porch,clearing,(phase-8)/4); walking = true; }
  else if (phase < 14) { position = mix(clearing,watch,(phase-12)/2); walking = true; }
  else if (phase < 24) position = watch;
  else if (phase < 30) { position = mix(watch,porch,(phase-24)/6); direction *= -1; walking = true; }
  else { position = mix(porch,door,(phase-30)/3); direction *= -1; walking = true; }
  let squirrel = null;
  if (phase >= 10 && phase < 24) {
    const start = { x: clearing.x + (right ? 20 : -20), y: clearing.y + 15 };
    squirrel = phase < 14 ? mix(start,tree,Math.max(0,(phase-10)/4)) : { x: tree.x + 7, y: tree.y - Math.min(62,(phase-14)*14) };
    squirrel.climbing = phase >= 14;
    squirrel.direction = right ? 1 : -1;
  }
  return { ...position, direction, walking, indoors, squirrel, vertical: !indoors && (phase < 8 || phase >= 30), entering: phase >= 30, watching: phase >= 14 && phase < 21 };
}

export function drawScout(ctx, scout, time, sleeping = false) {
  ctx.save(); ctx.translate(Math.round(scout.x),Math.round(scout.y)); ctx.scale(scout.direction || 1,1);
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
  const scout = scoutMoment(reduced ? 17500 / scoutSpeed : time);
  if (room === 'cabin' && scout.indoors) return [{ y: 296, draw: () => drawScout(ctx,{ x: 208, y: 296, direction: 1 },0,true) }];
  if (room !== 'town' || scout.indoors) return [];
  if (layout) {
    const project = point => ({ ...point, x: layout.cabin.x + (point.x - door.x) * .48, y: layout.cabin.y + (point.y - door.y) * .48 });
    Object.assign(scout, project(scout));
    if (scout.squirrel) scout.squirrel = project(scout.squirrel);
  }
  const actors = [{ y: scout.y, draw: () => drawScout(ctx,scout,reduced ? 0 : time * 1.6) }];
  if (scout.squirrel) actors.push({ y: scout.squirrel.y, draw: () => drawSquirrel(ctx,scout.squirrel,time) });
  return actors;
}
