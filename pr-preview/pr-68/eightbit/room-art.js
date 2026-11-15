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
  text(ctx, 'THE PROJECT ROW', 512, 355, 12, '#f1c778');
  for (let i = 0; i < 4; i++) {
    const x = 264 + i * 160;
    box(ctx, x - 53, 466, 106, 8, projects[i].color);
    cabinet(ctx, x, 463, projects[i]);
    text(ctx, `${String(i + 1).padStart(2, '0')}  PLAY`, x, 483, 9, projects[i].color);
    glow(ctx, x, 479, projects[i].color, 45, .03);
  }
  // Each featured station has a specific physical form.
  frame(ctx, 227, 384, 74, 43, '#283d39', '#99ddad');
  pet(ctx, 264, 420, 'lilgotchi', 0, false, 1.1);
  box(ctx, 235, 420, 58, 5, '#6e9563');
  frame(ctx, 390, 388, 68, 42, '#462b32', '#f3a469');
  polygon(ctx, [[402, 420], [414, 400], [421, 416], [434, 397], [448, 421]], '#ec7647');
  box(ctx, 391, 431, 68, 5, '#b2a8ab');
  frame(ctx, 548, 384, 72, 44, '#142c35', '#76d7df'); screen(ctx, 'network', 552, 388, 64, 36);
  text(ctx, 'RETRY / RECOVER', 584, 435, 6, '#a2dce2');
  // Coffee and phone lounge, with an exercise station and a real card table.
  frame(ctx, 215, 552, 100, 47, '#625041', '#bd9869');
  frame(ctx, 236, 518, 58, 38, '#34464b', '#b8c3bc'); screen(ctx, 'coffee', 241, 521, 48, 31);
  text(ctx, '05 MOONBEAN', 264, 606, 9, '#e3c38f');
  frame(ctx, 361, 548, 110, 48, '#24574c', '#b99961', 6); screen(ctx, 'cards', 382, 551, 68, 38);
  text(ctx, '06 POKER', 416, 606, 9, '#a0d9b9');
  cabinet(ctx, 584, 584, projects[4]);
  for (const x of [559, 609]) { frame(ctx, x - 10, 577, 21, 21, '#20283b', '#bdabd3', 3); }
  polygon(ctx, [[559, 586], [583, 565], [609, 586]], '#b88ed1'); box(ctx, 576, 560, 17, 4, '#d7bce7');
  text(ctx, '07 GAME & SWEAT', 584, 611, 9, '#d1c1fa');
  frame(ctx, 713, 518, 62, 76, '#b19a4f', '#e1c96b'); screen(ctx, 'phone', 720, 526, 48, 58);
  text(ctx, '08 REACHOUTT', 744, 607, 9, '#e8c96d');
  frame(ctx, 185, 632, 72, 32, '#7b5140', '#e0ae76'); text(ctx, 'PIZZA', 221, 647, 10, '#ffe0a0');
  frame(ctx, 777, 618, 66, 53, '#3e294f', '#c578a8'); box(ctx, 790, 626, 40, 30, '#131e31'); text(ctx, 'PHOTO', 810, 665, 9, '#efacd2');
  box(ctx, 340, 650, 340, 2, '#526b79'); text(ctx, '↓ MAIN STREET', 512, 670, 10, '#b7c6d3');
  text(ctx, 'THE NUMBERED MACHINES ARE PLAYABLE', 512, 337, 9, '#c6bbd9');
}

export function cabinDetails(ctx) {
  box(ctx, 70, 80, 630, 176, '#182b32');
  // Cedar rafters, a mountain window and a warm reading corner form one palette.
  polygon(ctx, [[80, 253], [384, 91], [688, 253]], '#624a39');
  polygon(ctx, [[145, 242], [384, 113], [623, 242]], '#303d42');
  polygon(ctx, [[195, 236], [384, 135], [573, 236]], '#a0b9ad');
  polygon(ctx, [[195, 236], [310, 173], [364, 219], [446, 172], [573, 236]], '#557c72');
  box(ctx, 380, 130, 8, 116, '#b38b5f'); box(ctx, 242, 209, 284, 7, '#b38b5f');
  polygon(ctx, [[80, 253], [384, 91], [384, 101], [92, 258]], '#bf9566');
  polygon(ctx, [[384, 91], [688, 253], [676, 258], [384, 101]], '#8f6b49');
  for (let y = 256; y < 330; y += 12) { box(ctx, 88, y, 36, 9, '#946a49'); box(ctx, 636, y, 42, 9, '#946a49'); }
  // Low amber lamps and a woven diamond rug, not an arbitrary collection of props.
  for (const x of [302, 642]) { box(ctx, x, 292, 3, 60, '#b99363'); polygon(ctx, [[x - 18, 301], [x - 10, 279], [x + 13, 279], [x + 21, 301]], '#e8c98e'); glow(ctx, x, 320, '#e8ab63', 45, .04); }
  frame(ctx, 318, 378, 126, 102, '#955b50', '#d8bc8a', 5);
  for (let y = 391; y < 470; y += 22) for (let x = 336; x < 437; x += 25) polygon(ctx, [[x, y - 7], [x + 8, y], [x, y + 7], [x - 8, y]], '#d6b17b');
  frame(ctx, 143, 413, 41, 43, '#b66c43', '#cb8758'); frame(ctx, 190, 413, 49, 43, '#b66c43', '#cb8758');
  box(ctx, 208, 420, 20, 26, '#7a9a83'); box(ctx, 211, 420, 3, 26, '#bed0ad');
  text(ctx, 'READING CORNER', 208, 328, 8, '#e0c28e');
}

export function workshopDetails(ctx) {
  box(ctx, 84, 136, 600, 104, '#243c42');
  for (let x = 94; x < 680; x += 14) for (let y = 148; y < 230; y += 14) box(ctx, x, y, 2, 2, '#648079');
  frame(ctx, 290, 151, 188, 51, '#192f34', '#ba9974'); text(ctx, 'BUILD / BREAK / REPEAT', 384, 175, 12, '#e5ca9e');
  for (let i = 0; i < 5; i++) { box(ctx, 127 + i * 21, 170, 5, 40 - i % 2 * 10, '#b3b7a2'); box(ctx, 123 + i * 21, 164, 13, 9, '#d09c65'); }
  frame(ctx, 548, 154, 87, 60, '#607a65', '#c6a37a'); text(ctx, 'SHIP SMALL.', 591, 178, 10, '#f3dfb6'); text(ctx, 'KEEP MAKING.', 591, 195, 9, '#f3dfb6');
  box(ctx, 328, 266, 75, 45, '#263e43'); for (let i = 0; i < 6; i++) { box(ctx, 334, 273 + i * 5, 13 + i * 7 % 49, 2, i % 2 ? '#9bc594' : '#d9ad73'); }
  box(ctx, 330, 314, 76, 6, '#9eaa9e');
  for (let i = 0; i < 4; i++) { box(ctx, 281, 427 + i * 8, 47, 6, ['#b18d64', '#789b92', '#a47472', '#c9b58a'][i]); }
  text(ctx, 'CURRENT WORK', 224, 330, 9, '#c5d5b7'); text(ctx, 'THE FIRST SAVE', 528, 330, 9, '#c5d5b7');
}
