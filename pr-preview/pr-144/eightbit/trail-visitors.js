import { box, polygon } from './art.js';
import { drawResident } from './residents.js';

export const dogLooks = [
  { coat: '#c69a62', muzzle: '#e5cf9d', size: 1, ears: 'floppy' },
  { coat: '#373d41', muzzle: '#e4e2d4', size: .85, ears: 'pointed', patches: true },
  { coat: '#c98548', muzzle: '#f1dfbd', size: .7, ears: 'pointed', long: true },
  { coat: '#e3d8bd', muzzle: '#b8ab8f', size: .95, ears: 'floppy', curly: true },
  { coat: '#594238', muzzle: '#bfaa8c', size: 1.2, ears: 'floppy' },
  { coat: '#ddd9ca', muzzle: '#eeeadb', size: 1.05, ears: 'floppy', spots: true },
];

const visitors = [
  { kind: 'jogger', y: 576, direction: 1, speed: 82, period: 67, offset: 6, skin: '#c58f68', hair: '#302d32', shirt: '#d77b65' },
  { kind: 'jogger', y: 704, direction: -1, speed: 76, period: 89, offset: 12, skin: '#80523d', hair: '#28252c', shirt: '#91b9b0' },
  { kind: 'dog', y: 576, direction: -1, speed: 26, period: 79, offset: 18, skin: '#e3b99a', hair: '#695248', shirt: '#8c93b6', coat: '#b48b5b', muzzle: '#ddc6a1' },
  { kind: 'dog', y: 704, direction: 1, speed: 24, period: 97, offset: 35, skin: '#b77f60', hair: '#292f32', shirt: '#b7aa70', coat: '#343a3b', muzzle: '#e0ded0' },
];

// Each visitor enters and leaves beyond the edge. Longer gaps keep runners occasional.
export function trailVisitors(time, reduced = false, layout = null) {
  return visitors.flatMap((visitor, index) => {
    const period = visitor.period + ((layout?.width || 1024) - 1024) / visitor.speed;
    const phase = ((reduced ? 0 : time / 1000) + visitor.offset) % period;
    const started = ((time / 1000 - phase) % 360 + 360) % 360;
    if (!reduced && started > 90 && started < 215) return [];
    let moving = phase, activity = 'walk', pauseProgress = 0;
    if (visitor.kind === 'dog') {
      const stops = [[visitor.direction < 0 ? 414 : 390, 6, 'sniff'], [800, 5, 'wait']];
      let delay = 0;
      for (const [distance, duration, name] of stops) {
        const start = distance / visitor.speed + delay;
        if (phase >= start && phase < start + duration) { activity = name; pauseProgress = (phase-start)/duration; }
        moving -= Math.max(0, Math.min(duration, phase-start));
        delay += duration;
      }
    }
    const distance = moving * visitor.speed;
    const width = layout?.width || 1024;
    if (distance > width + 140) return [];
    const x = visitor.direction === 1 ? -70 + distance : width + 70 - distance;
    const sniff = activity === 'sniff' ? Math.sin(pauseProgress * Math.PI) : 0;
    const lead = 24 + Math.sin(moving * 1.4) * 5;
    const y = layout ? (visitor.y === 576 ? layout.north : layout.south) : visitor.y;
    const trip = Math.floor(((reduced ? 0 : time / 1000) + visitor.offset) / period);
    const look = dogLooks[(trip + index) % dogLooks.length];
    return [{ ...visitor, ...look, y, id: index, x, activity, sniff, dogX: x + visitor.direction * lead, dogY: y + 3 + sniff * (layout ? 4 : 10) }];
  });
}

function jogger(ctx, visitor, time) {
  const stride = Math.sin(time / 95) * 7;
  ctx.save(); ctx.translate(Math.round(visitor.x), visitor.y); ctx.scale(visitor.direction*.8, .8);
  box(ctx, -12, 0, 25, 3, '#233c3f44');
  const bounce = Math.abs(Math.sin(time / 95)) * 2;
  ctx.translate(0, -bounce);
  for (const [x, swing] of [[-6, stride], [4, -stride]]) {
    polygon(ctx, [[x,-15],[x+5,-15],[x+5+swing,-7],[x+swing,-5]], visitor.skin);
    box(ctx, x + swing, -6, 4, 7, visitor.skin); box(ctx, x + swing, 0, 8, 3, '#e8ddbd');
  }
  box(ctx, -9, -19, 18, 8, '#33434e'); box(ctx, -9, -32, 19, 17, visitor.shirt);
  polygon(ctx, [[-9,-29],[-13,-20+stride/2],[-5,-17+stride/2],[-3,-21+stride/2],[-9,-23+stride/2],[-5,-29]], visitor.skin);
  polygon(ctx, [[9,-29],[13,-23-stride/2],[19,-28-stride/2],[21,-24-stride/2],[13,-18-stride/2],[6,-25]], visitor.skin);
  box(ctx, -5, -45, 15, 14, visitor.skin); box(ctx, -6, -48, 16, 6, visitor.hair);
  box(ctx, -6, -43, 17, 2, '#e5d7b2'); box(ctx, 7, -38, 2, 2, '#292d32');
  ctx.restore();
}

function dog(ctx, visitor, time) {
  const stride = visitor.activity === 'walk' ? Math.sin(time / 140) * 3 : 0;
  ctx.save(); ctx.translate(Math.round(visitor.dogX), visitor.dogY); ctx.scale(visitor.direction * visitor.size, visitor.size);
  if (visitor.long) ctx.scale(1.25,.75);
  box(ctx, -17, 0, 37, 3, '#233c3f44');
  for (const [x, swing] of [[-12,stride],[-6,-stride],[10,-stride],[15,stride]]) {
    box(ctx, x + swing, -9, 3, 10, visitor.muzzle);
  }
  box(ctx, -16, -18, 29, 13, visitor.coat);
  if (visitor.patches) box(ctx,-6,-18,10,13,visitor.muzzle);
  if (visitor.spots) for(const [x,y] of [[-12,-16],[-3,-11],[5,-15]]) box(ctx,x,y,4,4,'#3d3b3b');
  if (visitor.curly) for(let x=-16;x<14;x+=6) box(ctx,x,-21,5,5,visitor.coat); ctx.save(); ctx.translate(0,visitor.sniff*9); box(ctx, 8, -23, 13, 15, visitor.coat);
  box(ctx, 16, -17, 12, 7, visitor.muzzle); box(ctx, 25, -17, 4, 3, '#252d30');
  if (visitor.ears === 'pointed') polygon(ctx, [[9,-21],[8,-33],[16,-23]], visitor.coat);
  else polygon(ctx, [[9,-23],[5,-21],[7,-9],[12,-12]], visitor.coat);
  box(ctx, 18, -21, 2, 2, '#ece0bf'); box(ctx, 8, -10, 13, 3, '#b96e67');
  ctx.restore();
  polygon(ctx, [[-13,-15],[-24,-22-stride/2],[-25,-18-stride/2],[-15,-10]], visitor.coat);
  ctx.restore();
}

export function trailActors(ctx, time, reduced = false, layout = null) {
  const poseTime = reduced ? 0 : time;
  return trailVisitors(time, reduced, layout).map(visitor => ({ y: visitor.dogY, draw: () => {
    if (visitor.kind === 'jogger') { jogger(ctx, visitor, poseTime); return; }
    drawResident(ctx, { ...visitor, walking: !reduced && visitor.activity === 'walk', chatting: visitor.activity === 'wait', direction: visitor.activity === 'wait' ? 'up' : visitor.direction === 1 ? 'right' : 'left', look: { ...visitor, width: 19 } }, poseTime, reduced);
    ctx.strokeStyle = '#d7c4a2'; ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(visitor.x + visitor.direction * 10, visitor.y - 16);
    ctx.quadraticCurveTo(visitor.x + visitor.direction * 21, visitor.y + 1, visitor.dogX + visitor.direction * 10, visitor.dogY - 9);
    ctx.stroke(); dog(ctx, visitor, poseTime);
  } }));
}
