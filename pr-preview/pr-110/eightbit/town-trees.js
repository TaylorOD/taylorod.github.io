import { box, polygon, tree } from './art.js';

export function riverTree(ctx, x, y, size, pine) {
  if (pine) { tree(ctx, x, y, size); return; }
  ctx.save(); ctx.translate(x, y); ctx.scale(size, size);
  box(ctx, -17, 0, 38, 4, '#48604a');
  box(ctx, -3, -45, 6, 47, '#635941');
  box(ctx, -1, -43, 2, 45, '#988064');
  polygon(ctx, [[0,-22],[-20,-43],[-18,-47],[2,-29],[18,-53],[21,-49],[2,-19]], '#635941');
  const clumps = [[-18,-42,14], [12,-45,16],[-27,-57,12],[26,-60,11],[-10,-59,18],
    [9,-68,17],[-20,-76,11],[24,-78,10],[-5,-84,15],[8,-94,10],[-8,-71,15],[13,-55,12]];
  for (let i = 0; i < clumps.length; i++) {
    const [cx,cy,r] = clumps[i];
    const dark = i % 2 ? '#426c49' : '#3c6449';
    box(ctx,cx-r,cy-r/2,r*2,r,dark); box(ctx,cx-r/2,cy-r,r,r*2,dark);
    box(ctx,cx-r+2,cy-r/2-3,r+5,r,'#5c814d');
    box(ctx,cx-r/2,cy-r+2,r,8,'#77954f');
    box(ctx,cx-r/2-3,cy-r/2,7,6,'#94a65a');
    box(ctx,cx+3,cy+4,6,7,'#52764a');
  }
  ctx.restore();
}
