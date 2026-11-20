import { box, polygon } from './art.js';

export function grazer(ctx, x, y, scale, elk, facing, time, offset) {
  const grazing = Math.sin(time / 3400 + offset) > .25;
  ctx.save(); ctx.translate(x,y); ctx.scale(scale*facing,scale);
  const coat = elk ? '#ae946b' : '#bc9e73';
  box(ctx,-20,0,40,3,'#263f3522');
  for (const lx of [-16,-8,11,17]) {
    box(ctx,lx,-15,3,15,elk ? '#75664f' : '#8c785b'); box(ctx,lx,-2,4,3,'#4e5141');
  }
  polygon(ctx,[[-21,-18],[-17,-28],[9,-29],[20,-23],[19,-12],[-13,-11]],coat);
  box(ctx,-21,-24,6,11,elk ? '#d4c7a0' : '#e0d1af');
  polygon(ctx,[[-23,-25],[-27,-21],[-24,-17],[-20,-22]],'#d7c7a2');
  ctx.save(); ctx.translate(15,-22);
  if (grazing) ctx.rotate(1.9);
  polygon(ctx,[[-3,4],[-4,-12],[2,-23],[9,-21],[8,2]],elk ? '#73634a' : coat);
  polygon(ctx,[[2,-24],[15,-22],[17,-16],[5,-15]],elk ? '#8e7957' : coat);
  box(ctx,15,-21,4,4,'#424f40'); box(ctx,10,-23,2,2,'#293d33');
  polygon(ctx,[[4,-24],[-2,-29],[-4,-26],[1,-21]],coat);
  polygon(ctx,[[8,-24],[11,-31],[15,-30],[12,-23]],coat);
  if (elk) {
    polygon(ctx,[[3,-24],[0,-31],[-10,-38],[-11,-41],[-7,-40],[4,-32],[6,-25]],'#d3c3a0');
    for (const [ax,ay] of [[-8,-38],[-3,-35],[1,-32]]) {
      box(ctx,ax,ay-8,2,8,'#d3c3a0'); box(ctx,ax-3,ay-7,4,2,'#d3c3a0');
    }
    polygon(ctx,[[7,-25],[9,-34],[17,-40],[20,-40],[13,-33],[10,-24]],'#c1b48e');
    box(ctx,13,-42,2,7,'#c1b48e'); box(ctx,18,-45,2,6,'#c1b48e');
  }
  ctx.restore(); ctx.restore();
}

export function drawWildlife(ctx, time, reduced = false) {
  const t = reduced ? 0 : time;
  grazer(ctx,128,181,.48,true,1,t,0);
  grazer(ctx,167,193,.36,true,-1,t,2);
  grazer(ctx,245,390,.82,false,1,t,1);
  grazer(ctx,732,358,.76,false,-1,t,3);
}
