import { box, polygon } from './art.js';
import { drawResident } from './residents.js';

const visitors = [
  { kind: 'jogger', y: 576, direction: 1, speed: 82, period: 67, offset: 6, skin: '#c58f68', hair: '#302d32', shirt: '#d77b65' },
  { kind: 'jogger', y: 704, direction: -1, speed: 76, period: 89, offset: 12, skin: '#80523d', hair: '#28252c', shirt: '#91b9b0' },
  { kind: 'dog', y: 576, direction: -1, speed: 26, period: 79, offset: 18, skin: '#e3b99a', hair: '#695248', shirt: '#8c93b6', coat: '#b48b5b', muzzle: '#ddc6a1' },
  { kind: 'dog', y: 704, direction: 1, speed: 24, period: 97, offset: 35, skin: '#b77f60', hair: '#292f32', shirt: '#b7aa70', coat: '#343a3b', muzzle: '#e0ded0' },
];

// Each visitor enters and leaves beyond the edge. Longer gaps keep runners occasional.
export function trailVisitors(time, reduced = false) {
  return visitors.flatMap((visitor, index) => {
    const phase = ((reduced ? 0 : time / 1000) + visitor.offset) % visitor.period;
    const distance = phase * visitor.speed;
    if (distance > 1164) return [];
    const x = visitor.direction === 1 ? -70 + distance : 1094 - distance;
    return [{ ...visitor, id: index, x, dogX: x + visitor.direction * 30, dogY: visitor.y + 5 }];
  });
}

function jogger(ctx, visitor, time) {
  const stride = Math.sin(time / 95) * 7;
  ctx.save(); ctx.translate(Math.round(visitor.x), visitor.y); ctx.scale(visitor.direction, 1);
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
  const stride = Math.sin(time / 140) * 3;
  ctx.save(); ctx.translate(Math.round(visitor.dogX), visitor.dogY); ctx.scale(visitor.direction, 1);
  box(ctx, -17, 0, 37, 3, '#233c3f44');
  for (const [x, swing] of [[-12,stride],[-6,-stride],[10,-stride],[15,stride]]) {
    box(ctx, x + swing, -9, 3, 10, visitor.muzzle);
  }
  box(ctx, -16, -18, 29, 13, visitor.coat); box(ctx, 8, -23, 13, 15, visitor.coat);
  box(ctx, 16, -17, 12, 7, visitor.muzzle); box(ctx, 25, -17, 4, 3, '#252d30');
  polygon(ctx, [[9,-23],[5,-21],[7,-11],[12,-14]], visitor.coat);
  box(ctx, 18, -21, 2, 2, '#ece0bf'); box(ctx, 8, -10, 13, 3, '#b96e67');
  polygon(ctx, [[-13,-15],[-24,-22-stride/2],[-25,-18-stride/2],[-15,-10]], visitor.coat);
  ctx.restore();
}

export function trailActors(ctx, time, reduced = false) {
  const poseTime = reduced ? 0 : time;
  return trailVisitors(time, reduced).map(visitor => ({ y: visitor.dogY, draw: () => {
    if (visitor.kind === 'jogger') { jogger(ctx, visitor, poseTime); return; }
    drawResident(ctx, { ...visitor, walking: !reduced, direction: visitor.direction === 1 ? 'right' : 'left', look: { ...visitor, width: 19 } }, poseTime, reduced);
    ctx.strokeStyle = '#d7c4a2'; ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(visitor.x + visitor.direction * 10, visitor.y - 16);
    ctx.quadraticCurveTo(visitor.x + visitor.direction * 21, visitor.y + 1, visitor.dogX + visitor.direction * 10, visitor.dogY - 9);
    ctx.stroke(); dog(ctx, visitor, poseTime);
  } }));
}
