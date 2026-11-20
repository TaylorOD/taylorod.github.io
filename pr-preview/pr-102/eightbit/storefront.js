import { box, polygon, text } from './art.js';

function shopWindow(ctx, x, width) {
  box(ctx, x - 4, 334, width + 8, 85, '#b4a07e');
  box(ctx, x, 338, width, 74, '#14272e');
  box(ctx, x + 3, 341, width - 6, 5, '#655c53');
  box(ctx, x + 3, 395, width - 6, 14, '#293536');
  // Cabinets sit inside the dark shop, behind the window frame and reflections.
  for (let i = 0; i < 3; i++) {
    const left = x + 10 + i * (width - 30) / 3;
    const colors = ['#b47c87', '#7da8a2', '#d2b16e'];
    polygon(ctx, [[left,365],[left+19,365],[left+23,377],[left+21,388],[left+25,393],[left+25,408],[left,408]], '#424049');
    box(ctx, left + 2, 367, 16, 5, colors[i]);
    box(ctx, left + 3, 377, 15, 11, '#17262d');
    box(ctx, left + 5, 379, 11, 6, colors[i]);
    box(ctx, left + 4, 391, 18, 3, '#8e7c71');
    box(ctx, left + 7, 398, 7, 2, '#bca382');
  }
  polygon(ctx, [[x+8,340],[x+24,340],[x+48,409],[x+37,409]], '#92aaa215');
  polygon(ctx, [[x+width-22,340],[x+width-13,340],[x+width-3,373],[x+width-3,398]], '#bfd0b51a');
  box(ctx, x + Math.round(width / 2) - 2, 338, 4, 74, '#52615a');
  box(ctx, x, 352, width, 3, '#52615a');
  box(ctx, x - 6, 414, width + 12, 5, '#d0bd97');
  box(ctx, x - 3, 419, width + 6, 3, '#625c4b');
}

export function arcadeStorefront(ctx) {
  box(ctx, 325, 428, 390, 16, '#304e46');
  // Low commercial roof behind a stepped brick parapet.
  polygon(ctx, [[324,240],[338,211],[689,211],[704,240]], '#364846');
  box(ctx, 338, 214, 350, 3, '#65756a');
  box(ctx, 628, 219, 35, 16, '#6e7870');
  box(ctx, 631, 217, 29, 4, '#a5a58d');
  for (let x = 633; x < 660; x += 5) box(ctx, x, 225, 2, 8, '#45544e');
  box(ctx, 320, 236, 384, 196, '#755649');
  for (let row = 0; row < 24; row++) {
    const y = 238 + row * 8;
    for (let column = -1; column < 25; column++) {
      const x = 321 + column * 16 + (row % 2 ? 8 : 0);
      const left = Math.max(321, x), right = Math.min(703, x + 14);
      if (right > left) box(ctx, left, y, right - left, 6, ['#996d55','#a3755a','#916750','#aa7a5d'][(row * 7 + column + 25) % 4]);
    }
  }
  for (const x of [320, 690]) {
    box(ctx, x, 236, 14, 196, '#866149');
    for (let y = 241; y < 430; y += 8) box(ctx, x + 2, y, 10, 5, '#ab7f61');
  }
  box(ctx, 316, 234, 392, 7, '#d0b68e');
  box(ctx, 319, 241, 386, 4, '#5b5043');
  box(ctx, 323, 247, 378, 4, '#bd9874');
  for (let x = 329; x < 699; x += 12) box(ctx, x, 250, 5, 5, '#cfad82');
  // One painted sign, mounted flat to the facade beneath two small lamps.
  box(ctx, 357, 266, 310, 39, '#634c3e');
  box(ctx, 359, 268, 306, 33, '#263e3c');
  box(ctx, 361, 270, 302, 2, '#64786a');
  text(ctx, 'LAST LIGHT ARCADE', 512, 285, 18, '#e4d1a4');
  for (const x of [395, 625]) {
    box(ctx, x - 1, 257, 3, 9, '#343e36');
    polygon(ctx, [[x-7,266],[x-3,262],[x+4,262],[x+8,266]], '#35483f');
    box(ctx, x - 5, 266, 11, 2, '#e4c68d');
  }
  // A shallow canvas awning casts a continuous shadow over the shopfront.
  box(ctx, 332, 329, 344, 9, '#594c3c');
  polygon(ctx, [[338,310],[670,310],[679,326],[329,326]], '#3f6254');
  for (let x = 351; x < 670; x += 43) polygon(ctx, [[x,311],[x+2,311],[x+5,326],[x+2,326]], '#617765');
  box(ctx, 329, 326, 350, 6, '#2b4b43');
  box(ctx, 330, 331, 348, 2, '#b49c72');
  shopWindow(ctx, 341, 137); shopWindow(ctx, 546, 121);
  // Recessed entrance, with a narrow transom and a brass pull on the glass door.
  box(ctx, 486, 334, 52, 98, '#423c34');
  box(ctx, 492, 338, 40, 90, '#a68e68');
  box(ctx, 495, 341, 34, 13, '#52645a');
  box(ctx, 495, 358, 34, 65, '#233e3e');
  polygon(ctx, [[497,361],[503,361],[522,419],[516,419]], '#91aba12c');
  box(ctx, 521, 388, 2, 15, '#dac58e');
  box(ctx, 495, 421, 34, 6, '#736e58');
  box(ctx, 485, 429, 54, 5, '#cab793');
  box(ctx, 481, 434, 62, 5, '#999276');
  box(ctx, 334, 424, 146, 8, '#b09a77'); box(ctx, 542, 424, 133, 8, '#b09a77');
  // Small wear marks collect where hands, feet and rain reach the building.
  for(const [x,y,w] of [[487,430,12],[513,435,17],[342,425,15],[646,425,9],[329,263,5],[695,391,4]]) {
    box(ctx,x,y,w,2,'#c3b18c'); box(ctx,x+2,y+2,Math.max(2,w-5),1,'#756951');
  }
  for(const [x,y,w] of [[349,316,19],[574,320,27],[636,313,11]]) box(ctx,x,y,w,2,'#71826a');
  for(const [x,y] of [[339,404],[675,398],[331,422]]) { box(ctx,x,y,2,18,'#5c624b'); box(ctx,x+3,y+8,2,10,'#69704f'); }
  // Two paper notices sit inside the glass, with tape and a curled corner.
  for(const [x,y,color] of [[448,366,'#d8bb87'],[550,378,'#adbb9e']]) {
    box(ctx,x+1,y+2,21,27,'#1a3033'); box(ctx,x,y,20,26,color);
    box(ctx,x+6,y-1,8,3,'#d9ccb088'); box(ctx,x+3,y+17,13,1,'#647066');
    box(ctx,x+3,y+20,10,1,'#647066'); polygon(ctx,[[x+14,y+26],[x+20,y+20],[x+20,y+26]],'#8e9177');
  }
  text(ctx,'LIVE',458,375,6,'#4c5149'); text(ctx,'FRI',560,387,6,'#4c5149');
  parkedBike(ctx,364,441);
  // The fire escape stays on the narrow brick pier, clear of the glazing.
  box(ctx, 684, 224, 3, 208, '#43504b'); box(ctx, 699, 224, 3, 208, '#43504b');
  for (let y = 229; y < 430; y += 11) box(ctx, 687, y, 12, 2, '#a4a68a');
  box(ctx, 684, 221, 18, 3, '#8b947e');
}


function parkedBike(ctx,x,y) {
  ctx.save(); ctx.translate(x,y);
  for(const wheel of [-15,15]) {
    box(ctx,wheel-10,-17,20,18,'#303d3d'); box(ctx,wheel-7,-14,14,12,'#9b9a7e');
    box(ctx,wheel-1,-16,2,16,'#64766d'); box(ctx,wheel-8,-9,16,2,'#64766d');
  }
  ctx.strokeStyle='#a8b8ad'; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(-15,-8); ctx.lineTo(-5,-25); ctx.lineTo(2,-8); ctx.lineTo(-15,-8);
  ctx.moveTo(-5,-25); ctx.lineTo(11,-25); ctx.lineTo(2,-8);
  ctx.moveTo(15,-8); ctx.lineTo(10,-31); ctx.lineTo(16,-32); ctx.stroke();
  box(ctx,-8,-31,2,8,'#64766d'); box(ctx,-13,-32,13,3,'#38443e');
  box(ctx,-18,0,39,2,'#203e3d55'); ctx.restore();
}
