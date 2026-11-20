import { box, polygon, text } from './art.js';

export function wilma(ctx) {
  box(ctx, 13, 433, 94, 13, '#304e46');
  box(ctx, 10, 278, 82, 158, '#b6a184');
  box(ctx, 16, 284, 70, 150, '#d6c5a0');
  box(ctx, 82, 284, 10, 150, '#9e8d73');
  for (let y = 292; y < 390; y += 19) {
    box(ctx, 16, y + 13, 66, 2, '#b5a384');
    for (const x of [23, 42, 61]) {
      box(ctx, x, y, 11, 13, '#6a7066');
      box(ctx, x + 2, y + 2, 7, 9, '#384e50');
      box(ctx, x + 3, y + 2, 3, 8, '#c9b58d');
      box(ctx, x - 1, y + 12, 13, 2, '#eee0b9');
    }
  }
  box(ctx, 7, 277, 88, 5, '#eee0b9');
  box(ctx, 10, 272, 82, 5, '#a08e70');
  box(ctx, 18, 268, 66, 4, '#e0cfaa');
  box(ctx, 13, 389, 70, 47, '#a89373');
  for (const x of [21, 42, 63]) {
    box(ctx, x, 405, 15, 29, '#263e40');
    box(ctx, x + 3, 409, 9, 18, '#d6b87e');
    box(ctx, x + 7, 410, 2, 21, '#596558');
  }
  polygon(ctx, [[9, 391], [83, 391], [90, 399], [7, 399]], '#7b453f');
  box(ctx, 7, 398, 83, 12, '#f0d7a1');
  box(ctx, 7, 398, 83, 2, '#be7760');
  box(ctx, 7, 408, 83, 3, '#7b453f');
  text(ctx, 'THE WILMA', 48, 404, 7, '#663e38');
  for (let x = 10; x < 90; x += 6) box(ctx, x, 409, 2, 2, '#ffe3a4');
  box(ctx, 78, 300, 20, 86, '#5a3c38');
  box(ctx, 80, 302, 16, 82, '#ad5c4c');
  for (let i = 0; i < 5; i++) text(ctx, 'WILMA'[i], 88, 312 + i * 15, 13, '#f5dfaf');
  box(ctx, 15, 434, 69, 5, '#d9c8a3');
  box(ctx, 12, 439, 75, 4, '#9b9578');
}
