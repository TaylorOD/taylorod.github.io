import { box, polygon, text } from './art.js';

export function drawRiverLife(ctx, time, reduced) {
  const t = reduced ? 0 : time;
  // A standing wave beside the riverbank, inspired by Brennan's Wave at Caras Park.
  for (let band = 0; band < 5; band++) {
    const x = 726 + band * 10;
    for (let y = 616; y < 664; y += 8) {
      const offset = Math.sin(t / 450 + y + band) * 3;
      box(ctx, x + offset, y, 8 + band * 2, 3, band % 2 ? '#b4dcd0' : '#6ba99f');
      box(ctx, x + offset + 3, y + 3, 10, 2, '#e0ebe0');
    }
  }
  box(ctx, 779, 588, 3, 22, '#65563e'); box(ctx, 892, 588, 3, 22, '#65563e');
  box(ctx, 774, 581, 126, 18, '#294c48'); text(ctx, "BRENNAN'S WAVE", 837, 590, 9, '#d8d7b4');
  // Travel right to left, disappearing under the bridge instead of crossing its deck.
  const x = reduced ? 692 : 1060 - (t / 32 % 1120), y = 641 + Math.sin(t / 600) * 2;
  if (x < 426 || x > 600) {
    polygon(ctx, [[x - 29,y],[x - 17,y - 7],[x + 20,y - 7],[x + 30,y],[x + 18,y + 7],[x - 17,y + 7]], '#e99746');
    box(ctx, x - 9, y - 5, 20, 9, '#323f43'); box(ctx, x - 5, y - 17, 12, 14, '#d8684a');
    box(ctx, x - 4, y - 24, 10, 8, '#bf9770'); box(ctx, x - 6, y - 27, 14, 5, '#e7c95e');
    const swing = Math.sin(t / 220) * 9;
    ctx.save(); ctx.translate(x, y - 8); ctx.rotate(swing / 30);
    box(ctx, -25, -1, 50, 2, '#d4d4b7'); box(ctx, -30, -4, 10, 7, '#e0b357'); box(ctx, 21, -4, 10, 7, '#e0b357'); ctx.restore();
    box(ctx, x + 32, y + 1, 18, 2, '#a4ccc2');
  }
  // A bank-side fly fisher casts away from the bridge and paddling lane.
  const fx = 182, fy = 604;
  box(ctx, fx - 7, fy - 12, 6, 15, '#58665a'); box(ctx, fx + 3, fy - 12, 6, 15, '#58665a');
  box(ctx, fx - 10, fy - 28, 22, 18, '#9b9d72'); box(ctx, fx - 7, fy - 40, 16, 13, '#b89070');
  box(ctx, fx - 12, fy - 42, 26, 4, '#c3b48a'); box(ctx, fx - 7, fy - 47, 16, 7, '#ad9e76');
  const cast = Math.sin(t / 1800), tipX = fx + 36 + cast * 23, tipY = fy - 53;
  ctx.strokeStyle = '#c6b78a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx + 10, fy - 23); ctx.lineTo(tipX, tipY); ctx.stroke();
  ctx.strokeStyle = '#dce4c3'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.quadraticCurveTo(tipX + 39, fy - 73 + cast * 25, fx + 77, fy + 25); ctx.stroke();
  box(ctx, fx + 73, fy + 27, 11, 1, '#b6d4be');
}
