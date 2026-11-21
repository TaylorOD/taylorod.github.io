import { box, polygon } from './art.js';

export function bikePosition(time, index = 0) {
  const travel = ((time / 1000 * (index ? 48 : 58) + index * 590) % 1152);
  return { x: index ? 1088 - travel : travel - 64, y: index ? 480 : 552, facing: index ? -1 : 1 };
}

function wheel(ctx, x) {
  polygon(ctx,[[x-9,-2],[x-13,-7],[x-13,-15],[x-8,-20],[x+3,-20],[x+8,-15],[x+8,-7],[x+3,-2]],'#263b40');
  polygon(ctx,[[x-7,-5],[x-10,-8],[x-10,-14],[x-6,-17],[x+1,-17],[x+5,-14],[x+5,-8],[x+1,-5]],'#a4b4a0');
  box(ctx,x-3,-16,2,10,'#50696a'); box(ctx,x-8,-12,12,2,'#50696a');
}

export function drawBike(ctx, bike, time, index) {
  const pedal = Math.sin(time / 140) * 5;
  ctx.save(); ctx.translate(Math.round(bike.x),bike.y); ctx.scale(bike.facing*.8,.8);
  box(ctx,-29,0,58,3,'#27433944'); wheel(ctx,-19); wheel(ctx,24);
  polygon(ctx,[[-21,-11],[-11,-29],[5,-11],[-21,-11]],'#d39364');
  polygon(ctx,[[-17,-13],[-10,-24],[0,-13]],'#788b73');
  polygon(ctx,[[-9,-29],[16,-29],[6,-11],[3,-13],[12,-26],[-9,-26]],'#d39364');
  polygon(ctx,[[14,-37],[18,-37],[24,-11],[21,-10]],'#d2b58c');
  box(ctx,10,-39,13,3,'#334a4b'); box(ctx,-17,-31,15,4,'#334a4b');
  polygon(ctx,[[-12,-35],[-3,-29],[2+pedal,-20],[-3+pedal,-18],[-8,-25],[-16,-27]],'#344353');
  box(ctx,-4+pedal,-20,9,3,'#e8d3ad');
  polygon(ctx,[[-15,-34],[-12,-48],[-3,-51],[4,-39],[-4,-31]], index ? '#9b6584' : '#ddaf64');
  polygon(ctx,[[0,-47],[8,-40],[17,-38],[16,-35],[6,-36],[-4,-42]],'#e2b18c');
  box(ctx,-6,-59,12,12,'#e2b18c'); box(ctx,4,-54,5,4,'#e2b18c');
  box(ctx,-8,-62,15,6,index ? '#c3d8ca' : '#5f96ab'); box(ctx,-5,-65,9,3,index ? '#c3d8ca' : '#5f96ab');
  box(ctx,2,-55,2,2,'#293b40');
  ctx.restore();
}

export function bikeActors(ctx, time, reduced = false) {
  return [0,1].map(index => {
    const moment = reduced ? 7000 : time;
    const bike = bikePosition(moment,index);
    return { y: bike.y, draw: () => drawBike(ctx,bike,reduced ? 0 : time,index) };
  });
}
