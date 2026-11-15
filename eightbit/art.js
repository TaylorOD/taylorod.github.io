import { personalCabin, personalWorkshop } from './home-art.js';
import { aFrame, cyberArcade } from './room-art.js';
import { drawCompanion } from './companions.js';
// Original pixel scenery and sprites. All geometry lands on whole pixels.
export const palette = { ink: '#17292f', cream: '#f8e7bd', gold: '#f4bb72', mint: '#a8d6b7', pink: '#e3a5b6' };
export function box(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
export function polygon(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(Math.round(x), Math.round(y)) : ctx.moveTo(Math.round(x), Math.round(y)));
  ctx.closePath(); ctx.fill();
}
export function text(ctx, value, x, y, size = 10, color = palette.cream, align = 'center') {
  ctx.fillStyle = color; ctx.font = `bold ${size}px monospace`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(value, Math.round(x), Math.round(y));
}
function border(ctx, x, y, w, h, fill, stroke, thickness = 3) {
  box(ctx, x, y, w, h, stroke); box(ctx, x + thickness, y + thickness, w - thickness * 2, h - thickness * 2, fill);
}
export function glow(ctx, x, y, color, radius = 60, strength = .16) {
  ctx.save(); ctx.globalAlpha = strength;
  for (let i = 4; i >= 1; i--) {
    const r = radius * i / 4;
    box(ctx, x - r, y - r * .4, r * 2, r * .8, color);
  }
  ctx.restore();
}
export function tree(ctx, x, y, size = 1, broad = false) {
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(size, size);
  box(ctx, -15, -2, 45, 9, '#304e46');
  box(ctx, -5, -37, 10, 39, '#4a4c39'); box(ctx, -2, -34, 3, 34, '#6f6944');
  if (broad) {
    for (const [dx, dy, w, h, color] of [[-29, -67, 58, 33, '#2f5144'], [-34, -59, 70, 22, '#365f49'], [-22, -77, 44, 38, '#557348'], [-27, -68, 43, 28, '#73844f'], [-12, -76, 20, 6, '#9b9a60']]) box(ctx, dx, dy, w, h, color);
    for (let i = 0; i < 13; i++) box(ctx, (i * 17 % 45) - 22, -66 + (i * 11 % 26), 5, 3, i % 2 ? '#839356' : '#496b48');
  } else {
    for (let layer = 0; layer < 4; layer++) {
      const top = -94 + layer * 16;
      for (let row = 0; row < 6; row++) {
        const half = row * 4 + layer * 2;
        box(ctx, -half, top + row * 5, half * 2 + 5, 5, '#234c43');
        box(ctx, -half, top + row * 5, half + 2, 5, layer % 2 ? '#466e50' : '#3c614b');
      }
      box(ctx, -3, top + 5, 5, 6, '#70865c');
    }
  }
  ctx.restore();
}
function windowPane(ctx, x, y, w = 48, h = 44) {
  border(ctx, x, y, w, h, '#e6ad72', '#263e40', 5);
  box(ctx, x + 7, y + 7, w - 14, 6, '#f5d399');
  box(ctx, x + 7, y + h - 14, w - 14, 7, '#b67b56');
  box(ctx, x + w / 2 - 2, y + 4, 4, h - 8, '#526b5d');
  box(ctx, x + 3, y + h / 2, w - 6, 3, '#526b5d');
  box(ctx, x - 3, y + h, w + 6, 5, '#b2a184');
}
function brick(ctx, x, y, w, h, colors) {
  box(ctx, x, y, w, h, colors[0]);
  for (let yy = 0; yy < h; yy += 12) for (let xx = -12; xx < w; xx += 25) {
    const left = Math.max(0, xx + (yy % 24 ? 12 : 0));
    const width = Math.min(23, w - left);
    if (width > 0) box(ctx, x + left, y + yy + 1, width, 10, colors[1 + ((xx + yy + 1000) % 3)]);
  }
}
function roof(ctx, x, y, w, h, color = '#4c5961') {
  polygon(ctx, [[x - 12, y + h], [x + 16, y], [x + w - 16, y], [x + w + 12, y + h]], '#233a3b');
  polygon(ctx, [[x - 6, y + h - 6], [x + 20, y + 4], [x + w - 20, y + 4], [x + w + 6, y + h - 6]], color);
  for (let yy = 8; yy < h - 6; yy += 10) {
    const inset = Math.floor((h - yy) * .25);
    box(ctx, x + inset, y + yy, w - inset * 2, 2, '#667079');
    for (let xx = inset + (yy % 20 ? 8 : 0); xx < w - inset; xx += 24) box(ctx, x + xx, y + yy, 2, 8, '#394950');
  }
  box(ctx, x - 12, y + h - 4, w + 24, 7, '#1d3438');
  box(ctx, x - 8, y + h + 3, w + 16, 3, '#9b8874');
}
function building(ctx, x, y, w, h, label, type) {
  box(ctx, x + 12, y + h - 6, w + 12, 24, '#304e46');
  brick(ctx, x, y + 72, w, h - 72, type === 'cabin' ? ['#6b5c48', '#917454', '#8d6d4c', '#a17e56'] : ['#5b514c', '#9b6d59', '#a6755c', '#95664f']);
  roof(ctx, x - 3, y, w + 6, 82, type === 'arcade' ? '#455960' : '#4b6260');
  box(ctx, x + w - 45, y - 12, 25, 46, '#887965');
  box(ctx, x + w - 48, y - 15, 31, 7, '#b3a187');
  const doorX = x + w / 2 - 22;
  border(ctx, doorX - 5, y + h - 68, 54, 68, '#203b3e', '#d4bc90', 4);
  box(ctx, doorX + 3, y + h - 61, 38, 42, '#609087');
  box(ctx, doorX + 6, y + h - 58, 8, 35, '#a8b9a1');
  box(ctx, doorX + 27, y + h - 30, 6, 3, '#f4ce88');
  box(ctx, doorX - 14, y + h, 72, 7, '#c2ad84'); box(ctx, doorX - 19, y + h + 7, 82, 5, '#8f8c6b');
  windowPane(ctx, x + 16, y + h - 69, type === 'arcade' ? 92 : 36, 51);
  windowPane(ctx, x + w - (type === 'arcade' ? 108 : 52), y + h - 69, type === 'arcade' ? 92 : 36, 51);
  if (type === 'arcade') {
    border(ctx, x + 36, y + 30, w - 72, 53, '#20383e', '#c9c399', 4);
    border(ctx, x + 42, y + 36, w - 84, 41, '#20383e', '#70ada3', 1);
    text(ctx, 'SIDE QUEST', x + w / 2, y + 48, 22, '#d9e6bc');
    text(ctx, 'A R C A D E', x + w / 2, y + 68, 12, '#efa67e');
    for (let i = 0; i < w; i += 16) box(ctx, x + i, y + h - 82, 16, 14, i % 32 ? '#bb725b' : '#e4c492');
    box(ctx, x - 3, y + h - 85, w + 6, 4, '#efc68c');
    for (const xx of [x + 32, x + 63, x + w - 88, x + w - 57]) {
      box(ctx, xx, y + h - 51, 17, 29, '#354953'); box(ctx, xx + 3, y + h - 48, 11, 10, '#93b6aa');
    }
    border(ctx, x + 124, y + h - 16, 136, 14, '#253b3b', '#96876c', 1);
    text(ctx, 'TAYLOR DORSETT · OWNER', x + 192, y + h - 9, 7, '#edd8b0');
  } else {
    border(ctx, x + 12, y + 56, w - 24, 25, '#2a4745', '#a19472', 3);
    text(ctx, label, x + w / 2, y + 68, 10, '#f1dab0');
  }
}
function lamp(ctx, x, y) {
  box(ctx, x - 6, y - 3, 16, 7, '#28463f'); box(ctx, x, y - 65, 5, 65, '#2a4240');
  box(ctx, x - 7, y - 69, 19, 5, '#324b46');
  border(ctx, x - 6, y - 87, 17, 19, '#edbd7b', '#314740', 3);
  box(ctx, x - 9, y - 90, 23, 4, '#314740');
  glow(ctx, x + 2, y - 70, '#e8b975', 42, .045);
}
function bench(ctx, x, y) {
  box(ctx, x - 35, y - 26, 70, 7, '#c39a66'); box(ctx, x - 35, y - 15, 70, 5, '#a77f56');
  box(ctx, x - 36, y - 3, 72, 8, '#b99465');
  box(ctx, x - 30, y - 27, 4, 38, '#2c4540'); box(ctx, x + 26, y - 27, 4, 38, '#2c4540');
}
function mountain(ctx, x, bottom, w, h, color) {
  polygon(ctx, [[x - w / 2, bottom], [x - 35, bottom - h + 29], [x, bottom - h], [x + 25, bottom - h + 30], [x + w / 2, bottom]], color);
  polygon(ctx, [[x - 35, bottom - h + 29], [x, bottom - h], [x + 34, bottom - h + 40], [x + 12, bottom - h + 30], [x - 2, bottom - h + 43], [x - 13, bottom - h + 29]], '#b3b8a5');
}
function sky(ctx, width, height) {
  box(ctx, 0, 0, width, height, '#536c79');
  ['#737986', '#a58e91', '#c6a397', '#d7b39a'].forEach((c, i) => box(ctx, 0, i * 28, width, 28, c));
  box(ctx, width * .75, 34, 32, 32, '#efcca0'); box(ctx, width * .75 - 4, 42, 40, 16, '#efcca0');
  for (const [x, y, w] of [[.12, 32, 83], [.37, 17, 60], [.68, 78, 110]]) { box(ctx, width * x, y, w, 4, '#d8b5a3'); box(ctx, width * x + 14, y - 4, w - 24, 4, '#d8b5a3'); }
  for (const [x, h] of [[0, 80], [.2, 110], [.46, 89], [.7, 123], [1, 104]]) mountain(ctx, width * x, 180, 300, h, '#6a7b80');
  for (const [x, h] of [[.04, 60], [.32, 71], [.58, 64], [.9, 78]]) mountain(ctx, width * x, 214, 320, h, '#47666a');
}
function ground(ctx, w, h) {
  box(ctx, 0, 208, w, h - 208, '#4f715b');
  for (let i = 0; i < 1800; i++) {
    const x = (i * 139 + 31) % w, y = 208 + (i * 83) % (h - 208);
    box(ctx, x, y, i % 7 === 0 ? 5 : 2, 2, ['#53775c', '#587b5e', '#456953', '#648360'][i % 4]);
  }
}
function cobbles(ctx, x, y, w, h) {
  box(ctx, x, y, w, h, '#6c7969');
  for (let yy = 0; yy < h; yy += 13) for (let xx = 0; xx < w; xx += 21) {
    const ww = Math.min(18, w - xx - 1), hh = Math.min(10, h - yy - 1);
    box(ctx, x + xx + 1, y + yy + 1, ww, hh, ['#8b9076', '#94977c', '#868d73'][(xx + yy) % 3]);
    box(ctx, x + xx + 2, y + yy + 1, ww - 2, 1, '#a1a084');
  }
}
function town(ctx) {
  sky(ctx, 1024, 768); ground(ctx, 1024, 768);
  cobbles(ctx, 32, 448, 960, 128); cobbles(ctx, 448, 416, 128, 320);
  box(ctx, 0, 604, 1024, 8, '#3e6154'); box(ctx, 0, 612, 1024, 56, '#315d65'); box(ctx, 0, 668, 1024, 5, '#779075');
  for (let x = 0; x < 1024; x += 14) { box(ctx, x, 603 + x % 5, 9, 3, '#809275'); box(ctx, x + 4, 667, 8, 3, '#93a080'); }
  for (let y = 598; y < 685; y += 9) { box(ctx, 444, y, 136, 8, '#a88f6b'); box(ctx, 449, y + 1, 126, 1, '#c1a77b'); }
  for (const x of [442, 576]) { box(ctx, x, 586, 5, 95, '#514e40'); box(ctx, x - 2, 600, 9, 5, '#d5b684'); }
  for (const [x, y, s] of [[20, 259, 1.2], [88, 270, .9], [250, 282, 1.2], [742, 256, 1], [1001, 268, 1.3], [28, 444, 1.3], [984, 506, 1.4], [48, 597, 1], [342, 602, .9], [640, 602, .8], [934, 607, 1.1], [20, 754, 1.5], [134, 752, 1], [816, 752, 1.1], [986, 756, 1.5]]) tree(ctx, x, y, s);
  building(ctx, 320, 208, 384, 224, 'SIDE QUEST', 'arcade');
  building(ctx, 64, 292, 176, 156, 'THE WORKSHOP', 'workshop');
  // A quiet uphill path separates the cabin from the public street.
  cobbles(ctx, 838, 331, 52, 117);
  for (const [x,y,s] of [[764,320,.9],[790,267,1.1],[980,305,1.2],[941,220,.8],[763,410,.8],[980,405,1]]) tree(ctx,x,y,s);
  aFrame(ctx, 784, 160);
  text(ctx, 'UPPER RATTLESNAKE', 864, 374, 8, '#d5cc9f');
  // The arcade's exterior: ladder, bike, sandwich board and flower boxes.
  for (let y = 314; y < 430; y += 12) box(ctx, 683, y, 18, 3, '#bcad86');
  box(ctx, 682, 312, 3, 120, '#7b8975'); box(ctx, 700, 312, 3, 120, '#7b8975');
  border(ctx, 591, 437, 54, 44, '#2b4c45', '#c19e75', 3); text(ctx, 'OPEN', 618, 449, 10, '#e9d2a1'); text(ctx, 'COME IN', 618, 465, 7, '#b6c99c');
  for (const x of [299, 713]) { box(ctx, x, 418, 22, 17, '#997255'); box(ctx, x - 2, 417, 26, 4, '#c39b72'); for (let i = 0; i < 5; i++) { box(ctx, x + i * 4, 409 - i % 3 * 3, 3, 10, '#829663'); box(ctx, x + i * 4 - 1, 407 - i % 3 * 3, 5, 4, '#d4ac87'); } }
  bench(ctx, 256, 520); tree(ctx, 290, 494, .7, true);
  bench(ctx, 800, 517); lamp(ctx, 288, 448); lamp(ctx, 738, 456); lamp(ctx, 398, 579); lamp(ctx, 620, 579);
  box(ctx, 728, 521, 9, 28, '#604f42'); border(ctx, 716, 501, 34, 25, '#b27b65', '#3e5148', 3); box(ctx, 722, 509, 22, 3, '#2c4541'); text(ctx, 'POST', 733, 519, 7);
  for (let i = 0; i < 42; i++) { const x = 50 + i * 67 % 922, y = 582 + i * 17 % 19; box(ctx, x, y, 2, 5, '#799365'); box(ctx, x - 1, y - 2, 4, 3, i % 3 ? '#c4b47e' : '#dca38b'); }
  border(ctx, 452, 717, 120, 20, '#294944', '#849373', 2); text(ctx, 'MISSOULA · MT', 512, 728, 9, '#bcccaa');
}
export function screen(ctx, kind, x, y, w, h, time = 0, active = false) {
  box(ctx, x, y, w, h, '#182e38');
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const cx = x + w / 2, cy = y + h / 2;
  if (kind === 'pet') {
    box(ctx, x, y + h * .72, w, h, '#5b8060'); pet(ctx, cx, y + h * .73, 'lilgotchi', active ? time : 0, false, Math.max(1, w / 42));
  } else if (kind === 'pizza') {
    box(ctx, x, y, w, h, '#5b3539'); polygon(ctx, [[cx - w * .3, y + h * .2], [cx + w * .3, y + h * .2], [cx, y + h * .85]], '#ebbc75');
    box(ctx, cx - w * .3, y + h * .18, w * .6, 4, '#ce875c');
    for (const [xx, yy] of [[-.1, .36], [.12, .4], [0, .62]]) box(ctx, cx + w * xx - 2, y + h * yy, 5, 4, '#b85a4e');
  } else if (kind === 'network') {
    for (let i = 0; i < 3; i++) { const xx = x + w * (.18 + i * .3); box(ctx, xx, cy, w * .3, 2, '#4d747c'); border(ctx, xx - 4, cy - 7, 12, 15, '#284c57', '#8bc4c9', 2); box(ctx, xx - 1, cy + 3, 3, 2, active && Math.floor(time / 600) % 3 === i ? '#f2bb78' : '#78b69f'); }
    if (active) box(ctx, x + (time / 15 % w), cy, 4, 2, '#f4d49a');
  } else if (kind === 'fight') {
    border(ctx, x + 7, y + 7, w - 14, h - 14, '#314a50', '#b3bec3', 2); box(ctx, cx - 10, cy - 4, 5, 14, '#e5a1b7'); box(ctx, cx + 5, cy - 4, 5, 14, '#9fcacf'); box(ctx, cx - 8, cy, 16, 3, '#f3d6ba');
  } else if (kind === 'bike') {
    for (const xx of [cx - w * .25, cx + w * .25]) { border(ctx, xx - 7, cy, 15, 15, '#243a46', '#c0a9d5', 3); }
    polygon(ctx, [[cx - 10, cy + 7], [cx, cy - 6], [cx + 12, cy + 7]], '#9da8c2'); box(ctx, cx - 1, cy - 18, 5, 16, '#ddaf7b'); box(ctx, cx - 4, cy - 23, 9, 7, '#dfb98c');
  } else if (kind === 'coffee') {
    box(ctx, cx - 12, cy - 6, 24, 21, '#d5b28a'); border(ctx, cx + 10, cy - 4, 10, 12, '#182e38', '#d5b28a', 3); box(ctx, cx - 10, cy - 6, 20, 4, '#5f4843');
    for (let i = 0; i < 3; i++) box(ctx, cx - 7 + i * 7, cy - 17 - (active ? Math.floor(time / 300 + i) % 3 : 0), 2, 7, '#a2b8b1');
  } else if (kind === 'cards') {
    for (let i = 0; i < 3; i++) { box(ctx, cx - 22 + i * 13, cy - 13 + i * 3, 20, 28, '#e6d6ab'); text(ctx, ['A', 'K', 'Q'][i], cx - 12 + i * 13, cy + i * 3, 12, i === 1 ? '#ad6958' : '#34514d'); }
  } else if (kind === 'phone') {
    border(ctx, cx - 14, cy - 21, 28, 42, '#526e62', '#e3c57d', 3); box(ctx, cx - 9, cy - 15, 18, 10, '#b6cf9e'); for (let i = 0; i < 9; i++) box(ctx, cx - 8 + i % 3 * 6, cy + Math.floor(i / 3) * 5, 3, 3, '#d7c894');
  }
  for (let yy = 0; yy < h; yy += 4) box(ctx, x, y + yy, w, 1, '#182e3828');
  ctx.restore();
}
export function cabinet(ctx, x, y, project, time = 0, active = false) {
  const color = project.color;
  ctx.save(); ctx.translate(x, y);
  box(ctx, -35, -4, 83, 14, '#141f30');
  polygon(ctx, [[-32, -104], [31, -104], [39, -86], [39, -3], [-32, -3]], '#1b2535');
  polygon(ctx, [[31, -104], [39, -86], [39, -3], [31, -10]], '#475061');
  box(ctx, -29, -101, 57, 23, color); box(ctx, -26, -98, 51, 17, '#263343');
  text(ctx, project.id === 'snowcrust' ? 'SNOWCRUST' : project.id === 'lilgotchi' ? 'LILGOTCHI' : project.id.toUpperCase(), 0, -89, 8, color);
  border(ctx, -26, -75, 51, 41, '#152631', '#56606a', 3);
  screen(ctx, project.screen, -22, -71, 43, 33, time, active);
  polygon(ctx, [[-29, -32], [29, -32], [34, -20], [-33, -20]], color);
  box(ctx, -32, -20, 65, 5, '#263343'); box(ctx, -29, -15, 58, 14, '#344252');
  box(ctx, -18, -35, 3, 9, '#1b2535'); box(ctx, -21, -37, 9, 5, '#e2cf9f');
  box(ctx, 10, -28, 5, 3, '#c56373'); box(ctx, 19, -28, 5, 3, '#ebc787');
  border(ctx, -7, -12, 14, 7, '#182a31', '#777c75', 1);
  box(ctx, -31, -79, 2, 61, color);
  if (active) glow(ctx, 0, -40, color, 46, .035);
  ctx.restore();
}
function table(ctx, x, y, w = 100) {
  box(ctx, x - w / 2 + 8, y - 5, 7, 18, '#343d37'); box(ctx, x + w / 2 - 15, y - 5, 7, 18, '#343d37');
  border(ctx, x - w / 2, y - 25, w, 30, '#937552', '#483e38', 3); box(ctx, x - w / 2 + 4, y - 22, w - 8, 3, '#b89b6e');
}
function rooftop(ctx) {
  sky(ctx, 768, 640);
  for (let i = 0; i < 30; i++) tree(ctx, i * 30, 302 + i % 3 * 9, .5);
  box(ctx, 0, 294, 768, 346, '#42625e');
  for (let i = 0; i < 12; i++) { const x = i * 73 - 30, y = 362 + i % 3 * 42; box(ctx, x, y, 62, 130, '#36554f'); roof(ctx, x, y - 24, 62, 30); windowPane(ctx, x + 15, y + 15, 24, 24); }
  box(ctx, 128, 312, 512, 232, '#2a4143');
  for (let y = 320; y < 536; y += 12) { box(ctx, 136, y, 496, 10, y % 24 ? '#657777' : '#5b6f70'); for (let x = 144; x < 624; x += 40) box(ctx, x, y, 1, 10, '#415c60'); }
  for (const x of [130, 632]) box(ctx, x, 304, 7, 228, '#b3aa85'); box(ctx, 130, 304, 509, 7, '#b3aa85');
  bench(ctx, 230, 365); table(ctx, 528, 390, 85); box(ctx, 513, 359, 30, 21, '#e0b98c');
  text(ctx, 'YOU TOOK THE LONG WAY. NICE.', 384, 566, 12, '#c8cfb4');
}

export function paintScene(ctx, id, projects) {
  if (id === 'town') town(ctx);
  else if (id === 'arcade') cyberArcade(ctx, projects);
  else if (id === 'workshop') personalWorkshop(ctx);
  else if (id === 'cabin') personalCabin(ctx);
  else rooftop(ctx);
}

export function person(ctx, x, y, direction = 'down', walking = false, time = 0, carrying = false) {
  const step = walking ? Math.floor(time / 120) % 2 * 2 : 0;
  ctx.save(); ctx.translate(Math.round(x), Math.round(y));
  box(ctx, -11, -2, 25, 6, '#192f3655');
  box(ctx, -7, -14, 6, 13 - step, '#364d60'); box(ctx, 2, -14, 6, 11 + step, '#364d60');
  box(ctx, -9, -3 - step, 9, 4, '#1d303a'); box(ctx, 2, -3 + step, 9, 4, '#1d303a');
  box(ctx, -10, -29, 21, 18, '#bf7c78'); box(ctx, -10, -26, 9, 5, '#dfaf78'); box(ctx, 0, -23, 11, 6, '#83b1b1'); box(ctx, -5, -18, 11, 5, '#a5b98a'); box(ctx, -2, -26, 6, 4, '#a78fae');
  box(ctx, -13, -26 + step, 4, 15, '#d2a282'); box(ctx, 11, -26 - step, 4, 15, '#d2a282');
  box(ctx, -8, -42, 17, 15, '#d5aa86'); box(ctx, -9, -46, 18, 8, '#554b43'); box(ctx, -10, -40, 4, 7, '#554b43');
  if (direction !== 'up') { box(ctx, direction === 'left' ? -7 : direction === 'right' ? 5 : -4, -35, 2, 2, '#253b3c'); if (direction === 'down') box(ctx, 4, -35, 2, 2, '#253b3c'); box(ctx, -4, -30, 10, 3, '#82634f'); }
  else box(ctx, -7, -39, 15, 8, '#554b43');
  if (carrying) { border(ctx, 7, -24, 22, 10, '#e2bd85', '#80664a', 2); text(ctx, 'P', 18, -19, 7, '#9b5f4b'); }
  ctx.restore();
}
export const pet = drawCompanion;

export function ambience(ctx, id, time, reduced = false) {
  const t = reduced ? 0 : time;
  if (id === 'town') {
    for (let i = 0; i < 35; i++) { const x = (i * 71 + t / 90) % 1024; if (x > 440 && x < 584) continue; box(ctx, x, 620 + i * 13 % 41, 14 + i % 4 * 5, 1, i % 3 ? '#628b87' : '#92a997'); }
    for (let i = 0; i < 4; i++) { const age = (t / 80 + i * 12) % 48; box(ctx, 662 + Math.sin(age / 12) * 6, 199 - age, 8 + age / 5, 5, '#b8ad9b55'); }
    glow(ctx, 512, 454, '#ecc38f', 100, .022);
    for (let i = 0; i < 14; i++) { const x = 58 + i * 67, y = 590 + Math.sin(t / 1700 + i) * 9; if (Math.sin(t / 1000 + i) > .2) box(ctx, x, y, 2, 2, '#dfce94'); }
  }
  if (id === 'arcade') {
    for (let i = 0; i < 5; i++) glow(ctx, 192 + i * 144, 367, ['#97d4ae', '#e8aa79', '#8fc9d2', '#d89bb4', '#b2a4d2'][i], 53, .022);
    for (let i = 0; i < 12; i++) box(ctx, 136 + i * 67, 267, 3, 3, Math.floor(t / 1200 + i) % 4 ? '#cba379' : '#796d65');
  }
}
