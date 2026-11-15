import { box, polygon, text } from './art.js';

function frame(ctx, x, y, w, h, color, edge = '#536072', n = 3) {
  box(ctx, x, y, w, h, edge); box(ctx, x + n, y + n, w - n * 2, h - n * 2, color);
}

export function aFrame(ctx, x, y) {
  box(ctx, x - 8, y + 165, 200, 18, '#304d43');
  polygon(ctx, [[x - 12, y + 168], [x + 88, y - 34], [x + 188, y + 168]], '#223637');
  polygon(ctx, [[x + 3, y + 165], [x + 88, y - 12], [x + 173, y + 165]], '#b1875c');
  for (let row = 0; row < 15; row++) {
    const yy = y + 10 + row * 11, half = (yy - y + 12) * .48;
    box(ctx, x + 88 - half, yy, half * 2, 9, row % 2 ? '#805c40' : '#966e47');
    box(ctx, x + 89 - half, yy + 1, half * 2 - 2, 2, '#ba9263');
  }
  polygon(ctx, [[x + 61, y + 87], [x + 88, y + 27], [x + 115, y + 87]], '#e4ba77');
  box(ctx, x + 86, y + 47, 4, 43, '#503d31'); box(ctx, x + 69, y + 72, 38, 4, '#503d31');
  frame(ctx, x + 66, y + 103, 44, 65, '#384d48', '#d0ad77', 5);
  box(ctx, x + 75, y + 112, 26, 29, '#e6ba76'); box(ctx, x + 99, y + 147, 4, 3, '#f5d49c');
  for (const xx of [x + 25, x + 123]) { frame(ctx, xx, y + 125, 29, 28, '#e5ac66', '#4c4234'); box(ctx, xx + 13, y + 127, 3, 25, '#4c4234'); }
  polygon(ctx, [[x - 12, y + 168], [x + 88, y - 34], [x + 88, y - 17], [x + 1, y + 168]], '#526b67');
  polygon(ctx, [[x + 88, y - 34], [x + 188, y + 168], [x + 174, y + 168], [x + 88, y - 17]], '#344f4e');
  box(ctx, x + 44, y + 166, 88, 7, '#c0a079'); box(ctx, x + 36, y + 173, 104, 4, '#846c50');
  box(ctx, x + 129, y + 5, 13, 59, '#394445'); box(ctx, x + 126, y + 2, 19, 5, '#a39b85');
  text(ctx, 'HOME BASE', x + 88, y + 97, 8, '#f3dbab');
}

