import { box, polygon, text, glow, pet } from './art.js';

const walnut = '#94653f', cream = '#ded3ba', black = '#242b31';
function panel(ctx, x, y, w, h, fill, edge = black, inset = 3) {
  box(ctx, x, y, w, h, edge); box(ctx, x + inset, y + inset, w - inset * 2, h - inset * 2, fill);
}
function plant(ctx, x, y) {
  box(ctx, x - 7, y - 12, 14, 13, '#ded9c4'); box(ctx, x - 1, y - 32, 2, 21, '#557755');
  for (const [dx, dy] of [[-10,-28],[2,-34],[-8,-18],[1,-24]]) polygon(ctx, [[x + dx, y + dy], [x + dx + 9, y + dy - 3], [x + dx + 6, y + dy + 5]], '#6e965c');
}
function shell(ctx) {
  box(ctx, 0, 0, 768, 640, '#172b31');
  box(ctx, 80, 144, 608, 418, '#ad8b65'); box(ctx, 88, 144, 592, 116, cream);
  for (let y = 262; y < 554; y += 16) for (let x = 88; x < 680; x += 64) {
    box(ctx, x, y, Math.min(62, 680 - x), 14, (x + y) % 3 ? '#a58059' : '#b18c63'); box(ctx, x + 8, y + 4, Math.max(0, Math.min(43, 672 - x)), 1, '#c09b70');
  }
  box(ctx, 80, 255, 608, 7, '#ece2c9'); box(ctx, 80, 554, 608, 9, '#d1ba94');
  box(ctx, 350, 552, 68, 14, '#172b31'); text(ctx, '↓ MAIN STREET', 384, 535, 9, '#f1dfb9');
}
function books(ctx, x, y, w = 118) {
  box(ctx, x, y, 4, 94, black); box(ctx, x + w - 4, y, 4, 94, black);
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 12; i++) {
      const h = 13 + (i * 7 + row * 5) % 12;
      box(ctx, x + 7 + i * 8, y + 25 + row * 28 - h, 6, h, ['#d3bb7c','#687b79','#a46d58','#d9d1b8','#424e5b'][i % 5]);
      box(ctx, x + 8 + i * 8, y + 22 + row * 28, 3, 1, cream);
    }
    box(ctx, x, y + 26 + row * 28, w, 4, walnut);
  }
}
function window(ctx, x, y, w, h) {
  panel(ctx, x, y, w, h, '#648c90', '#eee5cf', 5);
  for (let i = 0; i < 4; i++) polygon(ctx, [[x + 8 + i * 19,y + h - 7],[x + 18 + i * 19,y + 12],[x + 28 + i * 19,y + h - 7]], '#3d6e5b');
  box(ctx, x + w / 2, y + 5, 3, h - 10, cream); box(ctx, x + 5, y + h / 2, w - 10, 3, cream);
  for (const xx of [x - 13, x + w]) { box(ctx, xx, y - 3, 14, h + 14, '#d6c8ac'); box(ctx, xx + 4, y, 2, h + 8, '#f0e4c9'); }
}

// Drawn from Taylor's room photos. The original private photos are not site assets.
export function personalCabin(ctx) {
  shell(ctx);
  polygon(ctx, [[80,144],[384,63],[688,144]], '#6d4e37');
  polygon(ctx, [[114,140],[384,78],[654,140]], '#a68b67');
  text(ctx, 'HOME BASE', 384, 118, 16, '#f6e4c5');
  // Stone fireplace with a chunky timber mantel from the living room.
  panel(ctx, 130, 206, 151, 111, '#776955', '#ab7e4f', 9);
  for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) box(ctx, 142 + col * 25, 215 + row * 15, 22, 12, (col + row) % 2 ? '#a5967e' : '#8d806b');
  panel(ctx, 175, 237, 61, 74, '#202b2c', '#3b3933', 5);
  polygon(ctx, [[184,301],[190,277],[201,293],[214,268],[228,302]], '#e9a653');
  box(ctx, 120, 200, 172, 9, '#c19665'); box(ctx, 128, 193, 158, 6, '#ae7d4e');
  panel(ctx, 174, 165, 67, 27, '#455b59', '#b88c5a');
  glow(ctx, 205, 329, '#efa757', 55, .04);
  // The slatted television wall and low walnut console.
  box(ctx, 311, 151, 158, 173, '#30302b');
  for (let x = 314; x < 468; x += 7) box(ctx, x, 151, 4, 173, '#a17a50');
  panel(ctx, 326, 176, 129, 79, '#233b4a', '#131e27', 5);
  polygon(ctx, [[333,244],[366,202],[391,235],[422,191],[449,244]], '#668c83'); text(ctx, 'TAKE YOUR TIME', 391, 242, 8, '#d2d8b8');
  panel(ctx, 319, 279, 142, 41, '#a47545', '#392f27');
  for (let x = 325; x < 456; x += 6) box(ctx, x, 285, 1, 27, '#c18d52');
  box(ctx, 342, 273, 94, 5, '#273039'); box(ctx, 307, 291, 9, 29, '#273039');
  // Kitchen: walnut fronts, white tile, black hardware, herbs and stainless oven.
  window(ctx, 535, 160, 104, 72);
  box(ctx, 498, 243, 164, 22, '#e1d8bd');
  for (let x = 500; x < 660; x += 24) { box(ctx, x, 250, 22, 1, '#bab6a5'); box(ctx, x + 11, 243, 1, 19, '#bab6a5'); }
  for (let i = 0; i < 4; i++) { panel(ctx, 498 + i * 41, 269, 40, 50, walnut, '#705039', 2); box(ctx, 523 + i * 41, 277, 9, 2, black); }
  box(ctx, 493, 263, 174, 7, '#d2c8ae'); panel(ctx, 543, 273, 49, 44, '#293239', '#aab1ad', 4); box(ctx, 550, 279, 35, 3, cream);
  box(ctx, 604, 257, 39, 6, '#343b3d'); box(ctx, 622, 245, 3, 15, '#bac4bb');
  plant(ctx, 512, 261); plant(ctx, 648, 259);
  // Dark ribbed sectional, light woven rug and black metal bookshelf.
  panel(ctx, 295, 368, 173, 112, '#d5c7a7', '#e7d8b8', 4);
  for (let y = 377; y < 474; y += 7) box(ctx, 303, y, 156, 1, '#b4aa90');
  panel(ctx, 132, 406, 136, 68, '#3e4b48', '#283631', 5); box(ctx, 140, 410, 42, 64, '#45544e');
  for (let x = 144; x < 260; x += 4) box(ctx, x, 416, 1, 48, '#627069');
  box(ctx, 184, 419, 24, 21, '#c4c2ad'); box(ctx, 235, 436, 22, 9, '#a89b84');
  books(ctx, 500, 328, 118);
  // White table, shell chairs and the stained glass pendant.
  for (const x of [503, 591]) { panel(ctx, x, 399, 26, 19, '#eee5d0', '#a4947e'); panel(ctx, x, 463, 26, 19, '#eee5d0', '#a4947e'); }
  panel(ctx, 489, 422, 140, 42, '#e8e0ce', '#f7edd7', 3); box(ctx, 497, 464, 6, 12, black); box(ctx, 615, 464, 6, 12, black);
  box(ctx, 558, 347, 2, 35, black); polygon(ctx, [[536,403],[548,380],[569,380],[584,403]], '#dec48a');
  for (let x = 542; x < 581; x += 7) box(ctx, x, 389, 2, 14, '#685545');
  box(ctx, 550, 433, 11, 10, '#bba152');
  pet(ctx, 585, 510, 'slice'); pet(ctx, 616, 510, 'lilgotchi'); pet(ctx, 645, 510, 'cypunk');
  text(ctx, 'YOUR LITTLE CREW', 616, 523, 7, '#dfcba7');
}

export function personalWorkshop(ctx) {
  shell(ctx); window(ctx, 144, 166, 158, 82); window(ctx, 484, 166, 148, 82);
  // Framed number eight jersey, dual monitors and the bike from the office photo.
  panel(ctx, 345, 161, 73, 74, '#b25d3e', '#26313a', 4);
  polygon(ctx, [[354,180],[368,170],[393,170],[408,180],[401,193],[395,190],[395,220],[366,220],[366,190],[360,194]], '#ddd8c7'); text(ctx, '8', 381, 201, 18, '#ad4f36');
  box(ctx, 128, 304, 199, 11, '#574a3c'); box(ctx, 135, 315, 5, 20, black); box(ctx, 313, 315, 5, 20, black);
  for (let i = 0; i < 2; i++) { panel(ctx, 143 + i * 78, 255, 73, 45, '#1b303b', '#121d28', 4); box(ctx, 174 + i * 78, 300, 7, 7, black); for (let row = 0; row < 5; row++) box(ctx, 151 + i * 78, 266 + row * 5, 24 + row * 7 % 35, 2, row % 2 ? '#c7ae73' : '#78ab9b'); }
  box(ctx, 172, 307, 81, 4, '#a6ada4'); panel(ctx, 208, 324, 32, 15, '#273a3c', '#14262b');
  panel(ctx, 483, 252, 87, 52, '#273c3a', '#bdc0a7', 7); text(ctx, '> HELLO', 527, 273, 11, '#afd693'); text(ctx, '2020', 527, 290, 8, '#8eac76');
  box(ctx, 461, 309, 164, 9, walnut); box(ctx, 467, 318, 6, 20, black); box(ctx, 612, 318, 6, 20, black); box(ctx, 491, 305, 70, 4, '#b7b9a2');
  for (const x of [518, 595]) {
    polygon(ctx, [[x-10,433],[x+10,433],[x+16,439],[x+16,453],[x+10,459],[x-10,459],[x-16,453],[x-16,439]], '#192932');
    polygon(ctx, [[x-7,437],[x+7,437],[x+12,442],[x+12,450],[x+7,455],[x-7,455],[x-12,450],[x-12,442]], '#708084');
    box(ctx, x-2, 440, 4, 12, '#28383c');
  }
  polygon(ctx, [[518,447],[552,407],[595,447]], '#212f36');
  polygon(ctx, [[527,443],[552,417],[580,443]], '#a58059');
  box(ctx, 551, 433, 5, 17, '#d16c48'); box(ctx, 544, 446, 17, 4, '#293b41'); box(ctx, 546, 397, 20, 6, '#37464a'); box(ctx, 588, 374, 4, 58, '#222e35');
  panel(ctx, 564, 351, 61, 35, '#203445', '#111f28', 4); text(ctx, 'ONE MORE', 594, 365, 7, '#cbd7c5'); text(ctx, 'MILE', 594, 375, 7, '#cbd7c5');
  books(ctx, 130, 389, 118); plant(ctx, 304, 300);
  text(ctx, 'THE DAY JOB', 224, 345, 9, '#eee0c0'); text(ctx, 'BOOT THE ORIGINAL', 528, 345, 9, '#eee0c0');
  text(ctx, 'READ / BUILD / REPEAT', 384, 494, 11, '#e8d4ac');
}
