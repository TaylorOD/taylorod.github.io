import { box, polygon, text, glow, cabinet, screen, pet } from './art.js';

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

function dummyCabinet(ctx, x, y, index) {
  const colors = ['#d34eac', '#44c4d2', '#ba84e5', '#e0aa4f'];
  const color = colors[index % colors.length];
  const names = ['NIGHT DRIVE', 'ORBIT 88', 'GHOST CITY', 'LASER RUN', 'VOID RIDER', 'NEON FIST'];
  cabinet(ctx, x, y, { id: names[index % names.length], color, screen: ['fight', 'network', 'cards'][index % 3] });
  text(ctx, 'ATTRACT MODE', x, y - 10, 5, '#96a0b0');
}

export function cyberArcade(ctx, projects) {
  box(ctx, 0, 0, 1024, 768, '#101421');
  box(ctx, 72, 120, 880, 580, '#090f1c');
  box(ctx, 80, 128, 864, 140, '#20223b');
  for (let y = 134; y < 266; y += 14) for (let x = 84; x < 936; x += 28) box(ctx, x + (y % 28 ? 0 : 10), y, 24, 11, '#28273d');
  box(ctx, 80, 268, 864, 420, '#1c2032');
  for (let y = 272; y < 688; y += 24) for (let x = 88; x < 936; x += 32) {
    box(ctx, x, y, 28, 21, (x + y) % 3 ? '#23243a' : '#29263d');
    if ((x + y) % 7 === 0) { box(ctx, x + 6, y + 6, 10, 2, '#5a3770'); box(ctx, x + 10, y + 2, 2, 10, '#37556e'); }
  }
  for (const x of [84, 936]) { box(ctx, x, 128, 4, 555, '#35bfc9'); glow(ctx, x, 430, '#31b9cf', 65, .025); }
  frame(ctx, 335, 135, 354, 61, '#141a2e', '#be4c9c');
  text(ctx, 'SIDE QUEST', 512, 159, 26, '#a8f2e9'); text(ctx, 'COIN OP SOCIAL CLUB', 512, 183, 11, '#ec85cf');
  text(ctx, '25¢', 160, 166, 25, '#e2a859'); text(ctx, 'ONE MORE GAME', 830, 161, 12, '#b685db');
  for (let i = 0; i < 11; i++) dummyCabinet(ctx, 136 + i * 75, 315, i);
  // Side banks create a crowded room while keeping the central walking lanes open.
  for (let i = 0; i < 3; i++) { dummyCabinet(ctx, 132, 437 + i * 72, i + 3); dummyCabinet(ctx, 892, 437 + i * 72, i + 1); }
  for (let i = 0; i < 4; i++) {
    const x = 264 + i * 160;
    box(ctx, x - 53, 466, 106, 8, projects[i].color);
    if (i === 3) cabinet(ctx, x, 463, projects[i]);
    text(ctx, `${String(i + 1).padStart(2, '0')}  PLAY`, x, 483, 9, projects[i].color);
    glow(ctx, x, 479, projects[i].color, 45, .03);
  }
  // Each featured station has a specific physical form.
  // A glass habitat, a brick pizza oven and a server rack have different silhouettes.
  polygon(ctx, [[221,382],[238,362],[290,362],[307,382]], '#779b80');
  frame(ctx, 221, 382, 86, 64, '#283d39', '#99ddad');
  box(ctx, 226, 387, 3, 52, '#d8f2ce'); box(ctx, 232, 389, 18, 2, '#c2e3bd');
  box(ctx, 224, 436, 80, 10, '#587b50');
  for (const x of [232, 290]) { box(ctx, x, 418, 3, 19, '#81ac63'); box(ctx, x-5, 422, 12, 3, '#81ac63'); }
  box(ctx, 218, 446, 92, 14, '#68886b');
  text(ctx, 'LILGOTCHI', 264, 375, 7, '#18372e');
  pet(ctx, 264, 420, 'lilgotchi', 0, false, 1.1);
  box(ctx, 235, 420, 58, 5, '#6e9563');
  box(ctx, 442, 350, 17, 35, '#945c48'); box(ctx, 438, 347, 25, 5, '#ca9270');
  polygon(ctx, [[381,407],[385,382],[401,366],[446,366],[462,382],[467,407]], '#ba7957');
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) box(ctx, 391 + col * 17, 377 + row * 9, 15, 7, '#d09168');
  frame(ctx, 390, 395, 68, 35, '#462b32', '#f3a469');
  polygon(ctx, [[402, 420], [414, 400], [421, 416], [434, 397], [448, 421]], '#ec7647');
  box(ctx, 391, 431, 68, 5, '#b2a8ab');
  box(ctx, 383, 439, 82, 23, '#845842'); text(ctx, 'SNOWCRUST', 424, 453, 7, '#f7d19a');
  frame(ctx, 546, 358, 76, 105, '#162533', '#4e7685', 4);
  for (let row = 0; row < 5; row++) { frame(ctx, 552, 366 + row*16, 64, 12, '#263b4a', '#618795', 1); box(ctx, 558, 370+row*16, 3, 3, '#93d9e7'); box(ctx, 565, 370+row*16, 3, 3, '#e9bc78'); for (let x = 580; x < 608; x+=5) box(ctx,x,369+row*16,2,5,'#12232e'); }
  box(ctx, 539, 370, 4, 78, '#7cbcc6'); box(ctx, 626, 382, 4, 66, '#dbbb6c');
  text(ctx, 'RELAY', 584, 453, 8, '#a2dce2');
  // Coffee and phone lounge, with an exercise station and a real card table.
  frame(ctx, 215, 552, 100, 47, '#625041', '#bd9869');
  frame(ctx, 236, 518, 58, 38, '#34464b', '#b8c3bc'); screen(ctx, 'coffee', 241, 521, 48, 31);
  text(ctx, '05 MOONBEAN', 264, 606, 9, '#e3c38f');
  frame(ctx, 361, 548, 110, 48, '#24574c', '#b99961', 6); screen(ctx, 'cards', 382, 551, 68, 38);
  text(ctx, '06 POKER', 416, 606, 9, '#a0d9b9');
  frame(ctx, 560, 493, 52, 38, '#203445', '#b598cc', 4); screen(ctx, 'bike', 564, 497, 44, 30);
  box(ctx, 583, 531, 4, 36, '#a28ab8'); box(ctx, 573, 550, 22, 4, '#d5b6e8');
  for (const x of [559, 609]) { frame(ctx, x - 10, 577, 21, 21, '#20283b', '#bdabd3', 3); }
  polygon(ctx, [[559, 586], [583, 565], [609, 586]], '#b88ed1'); box(ctx, 576, 560, 17, 4, '#d7bce7');
  text(ctx, '07 GAME & SWEAT', 584, 611, 9, '#d1c1fa');
  frame(ctx, 713, 518, 62, 76, '#b19a4f', '#e1c96b'); screen(ctx, 'phone', 720, 526, 48, 58);
  text(ctx, '08 REACHOUTT', 744, 607, 9, '#e8c96d');
  frame(ctx, 185, 632, 72, 32, '#7b5140', '#e0ae76'); text(ctx, 'PIZZA', 221, 647, 10, '#ffe0a0');
  frame(ctx, 777, 618, 66, 53, '#3e294f', '#c578a8'); box(ctx, 790, 626, 40, 30, '#131e31'); text(ctx, 'PHOTO', 810, 665, 9, '#efacd2');
  box(ctx, 340, 650, 340, 2, '#526b79'); text(ctx, '↓ MAIN STREET', 512, 670, 10, '#b7c6d3');
  text(ctx, 'THE NUMBERED MACHINES ARE PLAYABLE', 512, 337, 9, '#c6bbd9');
  frame(ctx, 90, 680, 95, 16, '#ad9265', '#514739', 1); text(ctx, 'FIX STICK / TUES', 138, 688, 6, '#312f2d');
}

