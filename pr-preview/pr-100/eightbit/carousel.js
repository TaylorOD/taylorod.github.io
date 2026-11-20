import { box, polygon, text } from './art.js';

const coats = ['#e8d7ad', '#aa7351', '#d7d4bd', '#795a47', '#d4a56b', '#ede0bf'];
const saddles = ['#ac5e58', '#668e86', '#bd9551', '#8b7895', '#608b8e', '#a96060'];

export function carouselHorses(time, reduced = false) {
  const angle = (reduced ? 0 : time % 18000 / 18000) * Math.PI * 2;
  return coats.map((coat, index) => {
    const phase = angle + index * Math.PI / 3;
    return {
      x: 260 + Math.cos(phase) * 55,
      y: 717 + Math.sin(phase) * 8,
      bob: Math.sin(phase * 2 + index) * 3,
      facing: Math.sin(phase) >= 0 ? -1 : 1,
      coat, saddle: saddles[index],
    };
  }).sort((a, b) => a.y - b.y);
}

function horse(ctx, item) {
  const { x, y, bob, facing, coat, saddle } = item;
  box(ctx, x, 683, 2, y + 9 - 683, '#dec68b');
  ctx.save(); ctx.translate(Math.round(x), Math.round(y + bob)); ctx.scale(facing, 1);
  polygon(ctx, [[-12,-9],[-9,-13],[6,-13],[11,-9],[8,-3],[-8,-3]], coat);
  polygon(ctx, [[5,-10],[7,-21],[11,-24],[17,-21],[18,-17],[11,-17],[10,-6]], coat);
  box(ctx, 9, -26, 2, 5, coat); box(ctx, 14, -22, 2, 2, '#343e36');
  box(ctx, 5, -21, 3, 11, '#705140');
  polygon(ctx, [[-11,-12],[-16,-10],[-18,-3],[-15,-5],[-13,-8]], '#705140');
  polygon(ctx, [[-8,-4],[-12,2],[-7,6],[-5,4],[-8,1],[-4,-3]], coat);
  polygon(ctx, [[6,-5],[13,-1],[15,3],[12,4],[10,1],[4,-1]], coat);
  box(ctx, -4, -14, 10, 4, saddle); box(ctx, -1, -10, 5, 5, saddle);
  box(ctx, 0, -9, 2, 2, '#edc77e');
  ctx.restore();
}

export function drawCarousel(ctx, time, reduced = false) {
  // The raised floor and open sides leave the carved ponies visible from the path.
  box(ctx, 177, 739, 174, 9, '#304e46');
  polygon(ctx, [[181,730],[337,730],[348,739],[337,746],[184,746],[173,739]], '#a78d66');
  box(ctx, 184, 734, 151, 7, '#d3b788');
  box(ctx, 191, 689, 138, 44, '#40574c');
  for (const x of [191, 326]) { box(ctx, x, 680, 5, 54, '#8b5b4a'); box(ctx, x + 1, 681, 2, 48, '#bc8c65'); }
  box(ctx, 249, 684, 22, 49, '#b36c55');
  for (const x of [252, 263]) { box(ctx, x, 692, 5, 25, '#ead5a0'); box(ctx, x + 1, 694, 3, 20, '#7c9b8c'); }
  for (const item of carouselHorses(time, reduced)) horse(ctx, item);
  // A small green pavilion roof, with a warm ring of lights below its eaves.
  polygon(ctx, [[174,682],[191,670],[245,649],[275,649],[330,670],[346,682]], '#294f49');
  polygon(ctx, [[181,677],[247,653],[273,653],[339,677]], '#5f8170');
  polygon(ctx, [[222,677],[251,653],[269,653],[297,677]], '#7f9880');
  box(ctx, 250, 644, 20, 10, '#b8b08a'); box(ctx, 254, 635, 12, 10, '#456e61');
  polygon(ctx, [[250,636],[260,629],[270,636]], '#d2bd86');
  box(ctx, 259, 620, 2, 10, '#d5c38e');
  polygon(ctx, [[261,620],[274,623],[261,626]], '#b76557');
  box(ctx, 174, 679, 172, 7, '#b46c57');
  box(ctx, 178, 686, 164, 4, '#e3c38b');
  for (let x = 181; x < 342; x += 10) box(ctx, x, 687, 3, 3, '#ffe3a5');
  for (const x of [181, 335]) { box(ctx, x, 688, 5, 46, '#a26f50'); box(ctx, x + 1, 689, 2, 43, '#e2c591'); }
  text(ctx, 'CAROUSEL', 260, 682, 7, '#fff0c4');
  box(ctx, 213, 749, 94, 13, '#304e46');
  text(ctx, 'CARAS PARK', 260, 756, 8, '#dccb9f');
}
