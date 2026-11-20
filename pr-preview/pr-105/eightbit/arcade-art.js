import { box, polygon, text, screen } from './art.js';

// Upright machines share their cabinet construction, but each gets its own artwork.
export const machines = [
  { id: 'lilgotchi', x: 264, y: 470, title: ['LILGOTCHI'], color: '#9be879', screen: 'pet', motif: 'pet' },
  { id: 'snowcrust', x: 424, y: 470, title: ['SNOWCRUST'], color: '#ffb347', screen: 'pizza', motif: 'bolt' },
  { id: 'relay', x: 584, y: 470, title: ['RELAY'], color: '#54e3e7', screen: 'network', motif: 'grid' },
  { id: 'fight', x: 744, y: 470, title: ['FIGHT', 'TERMINAL'], color: '#ff547e', screen: 'fight', motif: 'bolt' },
  { id: 'moonbean', x: 264, y: 646, title: ['MOONBEAN'], color: '#e9b46d', screen: 'coffee', motif: 'moon' },
  { id: 'poker', x: 416, y: 646, title: ['POKER SEATER'], color: '#6ae0af', screen: 'cards', cocktail: true },
  { id: 'sweat', x: 584, y: 646, title: ['GAME & SWEAT'], color: '#bd9bff', screen: 'bike', motif: 'bolt' },
  { id: 'reachoutt', x: 744, y: 646, title: ['REACHOUTT'], color: '#fff073', screen: 'phone', motif: 'grid' },
];

function light(ctx, x, y, color, radius, alpha) {
  const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius);
  gradient.addColorStop(0, color); gradient.addColorStop(1, '#00000000');
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2); ctx.restore();
}

function upright(ctx, machine, small = false) {
  const { x, y, color, title, motif } = machine;
  ctx.save(); ctx.translate(x, y); if (small) ctx.scale(.79, .79);
  box(ctx, -43, -1, 96, 9, '#05060b');
  polygon(ctx, [[-43,-123],[37,-123],[48,-105],[48,-1],[-43,-1],[-43,-44],[-35,-55],[-35,-93]], '#111420');
  polygon(ctx, [[37,-123],[48,-105],[48,-1],[37,-7]], '#282334');
  box(ctx, -40, -120, 76, 23, color); box(ctx, -37, -117, 70, 17, '#141322');
  title.forEach((line, i) => text(ctx, line, -2, -109 + (i - (title.length-1)/2)*9, title.length > 1 ? 8 : line.length > 11 ? 8 : 10, color));
  box(ctx, -33, -94, 66, 52, '#070912'); box(ctx, -29, -90, 58, 44, '#444151');
  screen(ctx, machine.screen, -26, -87, 52, 38);
  box(ctx, -39, -115, 2, 70, color); box(ctx, 35, -115, 2, 108, color);
  polygon(ctx, [[-35,-45],[35,-45],[43,-31],[-43,-31]], '#454454');
  box(ctx, -40, -34, 80, 3, color); box(ctx, -40, -30, 77, 28, '#191a26');
  box(ctx, -23, -51, 3, 12, '#9993a1'); box(ctx, -27, -54, 11, 6, '#e75772');
  for (let i=0;i<3;i++) box(ctx, 8+i*9, -40-i%2*3, 6, 4, i===1 ? '#f3ce5e' : color);
  box(ctx, -12, -27, 25, 23, '#42424d'); box(ctx, -10, -25, 21, 19, '#090b12');
  for (const xx of [-6,4]) { box(ctx,xx,-22,4,7,'#b9aa8c'); box(ctx,xx,-20,4,2,'#ff8a4d'); }
  box(ctx,-6,-10,13,2,'#706c73');
  if (motif==='bolt') polygon(ctx, [[39,-84],[46,-72],[41,-53],[46,-43],[39,-24]], color);
  if (motif==='grid') for(let yy=-83;yy<-20;yy+=10) box(ctx,40,yy,5,2,color);
  if (motif==='moon') { box(ctx,40,-74,5,16,color); box(ctx,43,-76,3,18,'#282334'); }
  if (motif==='pet') for (let yy=-80;yy<-20;yy+=17) { box(ctx,40,yy,5,5,color); box(ctx,42,yy-3,2,2,color); }
  box(ctx,-36,-2,8,5,'#343340'); box(ctx,29,-2,8,5,'#343340');
  ctx.restore();
}

function cocktail(ctx, m) {
  box(ctx,m.x-44,m.y-27,9,30,'#55505c'); box(ctx,m.x+35,m.y-27,9,30,'#55505c');
  box(ctx,m.x-53,m.y-54,106,34,'#754b36'); box(ctx,m.x-57,m.y-60,114,32,'#171923');
  box(ctx,m.x-51,m.y-57,102,25,'#5a6a74'); screen(ctx,'cards',m.x-28,m.y-55,56,22);
  box(ctx,m.x-48,m.y-45,5,5,'#df665f'); box(ctx,m.x+39,m.y-45,5,5,'#69d6b4');
  text(ctx,'POKER SEATER',m.x,m.y-14,9,m.color); box(ctx,m.x-7,m.y-8,14,4,'#c08760');
}

const backGames = ['STAR PILOT','NIGHT DRIVER','VECTOR','VOID RUN','MECH 84','AFTER HOURS','GHOST CITY','NEON FIST','ORBIT'];
const neon = ['#df488d','#47bcca','#b28de1','#db9b49'];

function pinball(ctx, x, y, color) {
  box(ctx,x-31,y-98,62,32,'#151624'); box(ctx,x-28,y-95,56,26,color);
  text(ctx,'COSMIC',x,y-87,9,'#20152a'); text(ctx,'PINBALL',x,y-76,7,'#20152a');
  polygon(ctx,[[x-28,y-64],[x+28,y-64],[x+37,y-14],[x-37,y-14]],'#60616e');
  polygon(ctx,[[x-24,y-61],[x+24,y-61],[x+31,y-19],[x-31,y-19]],'#22213b');
  for(const [dx,dy] of [[-12,-49],[10,-44],[0,-31]]) { box(ctx,x+dx-4,y+dy-4,8,8,color); box(ctx,x+dx-2,y+dy-2,4,4,'#f7d3b3'); }
  polygon(ctx,[[x-20,y-59],[x-27,y-27],[x-17,y-24]],'#655c94');
  box(ctx,x-16,y-23,12,3,'#eab567'); box(ctx,x+5,y-23,12,3,'#eab567');
  box(ctx,x-37,y-14,74,9,'#51445c'); box(ctx,x-31,y-5,4,12,'#99909c'); box(ctx,x+27,y-5,4,12,'#99909c');
}

function attract(ctx, x, y, kind, time) {
  box(ctx,x,y,40,29,'#080e1d');
  if(kind%3===0) {
    polygon(ctx,[[x+17,y+4],[x+23,y+4],[x+38,y+29],[x+2,y+29]],'#353045');
    for(let i=0;i<3;i++) box(ctx,x+19,y+(i*10+Math.floor(time/130))%29,2,5,'#e7b575');
    box(ctx,x+11,y+19,7,8,'#f05d9d'); box(ctx,x+24,y+7,5,6,'#76d9e0');
  } else if(kind%3===1) {
    for(let row=0;row<3;row++) for(let col=0;col<4;col++) {
      const xx=x+4+col*8+(Math.floor(time/600)%2)*2, yy=y+3+row*6;
      box(ctx,xx,yy,5,3,['#b38bf2','#5cdbbf','#eea25c'][row]);
    }
    box(ctx,x+17,y+25,8,3,'#e0e8b5'); box(ctx,x+20,y+19-Math.floor(time/180)%8,1,4,'#f7bb79');
  } else {
    box(ctx,x+3,y+4,34,2,'#8d619d'); box(ctx,x+3,y+23,34,2,'#8d619d');
    box(ctx,x+7,y+12,5,10,'#f0728a'); box(ctx,x+27,y+12,5,10,'#74d6d3');
    box(ctx,x+10,y+16,10+Math.floor(time/350)%3,2,'#e9b6a0');
  }
}

export function cyberArcade(ctx) {
  box(ctx,0,0,1024,832,'#06070d');
  // Exposed rafters and conduit disappear into an unlit ceiling.
  box(ctx,72,108,880,688,'#10111d');
  for(let y=115;y<255;y+=12) for(let x=78;x<946;x+=30) box(ctx,x+(y%24?0:15),y,27,9,'#181723');
  for (const x of [112,324,700,912]) { box(ctx,x,110,9,139,'#292536'); box(ctx,x+2,111,2,136,'#3b3142'); }
  box(ctx,80,127,864,7,'#343340'); box(ctx,84,129,856,2,'#56505d');
  for(const x of [192,832]) { box(ctx,x,130,3,47,'#55505b'); box(ctx,x-34,177,72,9,'#33303b'); box(ctx,x-29,185,62,3,'#f7a864'); light(ctx,x,210,'#ff963b',100,.13); }
  // A large neon wordmark, a score board and old tournament flyers anchor the room.
  ctx.save(); ctx.shadowColor='#e647a0'; ctx.shadowBlur=14;
  text(ctx,'LAST LIGHT',512,172,36,'#ff6eb6'); ctx.restore();
  text(ctx,'A R C A D E',512,201,15,'#65e4e4');
  box(ctx,381,226,262,2,'#82335f'); text(ctx,'QUARTERS IN. REAL WORLD OUT.',512,218,7,'#9c8ba7');
  box(ctx,111,202,132,45,'#060a10'); text(ctx,'HIGH SCORES',177,212,9,'#e9a757');
  text(ctx,'AAA  087250',177,228,9,'#6bc4a5'); text(ctx,'TDR  064800',177,239,7,'#7e8d94');
  box(ctx,786,195,57,54,'#a57c5a'); text(ctx,'FRIDAY',815,207,8,'#201e29'); text(ctx,'FIGHT',815,221,10,'#342132'); text(ctx,'NIGHT',815,234,8,'#342132');
  box(ctx,851,205,50,44,'#38334e'); text(ctx,'NO',876,216,8,'#e8b9ba'); text(ctx,'TILT',876,232,10,'#e8b9ba');
  // Dark patterned carpet with a worn central aisle. No bright tile grid.
  box(ctx,80,255,864,534,'#13111f');
  for(let y=272;y<786;y+=25) for(let x=94;x<935;x+=35) {
    const c=(x+y)%3 ? '#302039' : '#21343b';
    polygon(ctx,[[x,y],[x+8,y-3],[x+3,y+6],[x+12,y+4]],c); box(ctx,x+19,y+10,2,2,'#48304c');
  }
  box(ctx,490,345,42,396,'#26203244');
  for(const x of [83,937]) { box(ctx,x,254,3,528,'#a13776'); light(ctx,x,440,'#dc36ad',130,.13); }
  // A packed back bank and side banks are scenery. The eight project games face the aisles.
  backGames.forEach((name,i) => upright(ctx,{x:180+i*83,y:317,title:[name],color:neon[i%4],screen:['fight','network','cards'][i%3]},true));
  for(let i=0;i<3;i++) for(const x of [128,888]) upright(ctx,{x,y:441+i*140,title:[[ 'RACER','PINBALL','SPACE WAR'][i%3]],color:neon[(i+(x===128?0:1))%4],screen:['bike','cards','fight'][i%3]},true);
  // Pinball banks have sloping glass playfields and chrome legs.
  for(const x of [128,888]) {
    box(ctx,x-38,483,79,108,'#13111f');
    pinball(ctx,x,581,x===128?'#df6dbe':'#e9b369');
  }
  for(const m of machines) {
    light(ctx,m.x,m.y+14,m.color,72,.13);
    if(m.cocktail) cocktail(ctx,m); else upright(ctx,m);
    const number=String(['lilgotchi','snowcrust','relay','fight','sweat','moonbean','poker','reachoutt'].indexOf(m.id)+1).padStart(2,'0');
    box(ctx,m.x-46,m.y+8,16,11,'#33313e'); text(ctx,number,m.x-38,m.y+14,7,'#e8d8b4');
  }
  // Change counter, a stacked pizza order and a curtained photo booth by the exit.
  box(ctx,185,720,78,46,'#38252b'); box(ctx,182,720,84,7,'#9e7050');
  text(ctx,'CHANGE',224,738,10,'#e7ad5d'); text(ctx,'25¢ / PLAY',224,753,8,'#b89777');
  box(ctx,191,701,27,19,'#282b35'); box(ctx,195,705,18,8,'#8cae93'); box(ctx,198,713,12,2,'#19242b');
  for(let y=707;y<720;y+=4) { box(ctx,228,y,32,3,'#d4ad7e'); box(ctx,241,y,5,2,'#be5f4e'); }
  text(ctx,'PIZZA PICKUP',288,739,7,'#e8c393');
  box(ctx,323,733,43,17,'#674934'); box(ctx,320,730,49,5,'#a17c55');
  box(ctx,328,701,33,28,'#b5aa8e'); box(ctx,332,705,25,17,'#152b23');
  text(ctx,'C:>',339,711,6,'#92dc82'); box(ctx,335,718,13,1,'#92dc82');
  box(ctx,325,729,39,3,'#d5c5a5'); text(ctx,'REPAIR DESK',345,758,6,'#d9b69a');
  box(ctx,778,710,65,59,'#5b304b'); box(ctx,783,715,55,13,'#e9a1c7'); text(ctx,'PHOTO',810,722,9,'#332335');
  box(ctx,785,730,51,36,'#0a0a14'); for(let x=812;x<836;x+=5) box(ctx,x,731,4,34,x%2?'#592c4b':'#713855');
  box(ctx,788,736,17,20,'#242331'); box(ctx,792,738,9,6,'#6f949d');
  box(ctx,446,758,132,26,'#30252d'); text(ctx,'EXIT  ↓',512,771,11,'#edb576');
  box(ctx,340,793,344,4,'#63344d'); text(ctx,'8 FEATURED MACHINES  ·  WALK UP & PRESS E',512,814,10,'#a899b0');
  // Vignette keeps the light coming from machines, instead of a bright room wash.
  light(ctx,510,375,'#614785',290,.055);
}

export function animateArcade(ctx, time, reduced, nearby) {
  const t=reduced?0:time;
  backGames.forEach((_,i) => attract(ctx,180+i*83-20,248,i,t));
  for(const x of [128,888]) for(const i of [0,2]) attract(ctx,x-20,441+i*140-69,i,t);
  for (const m of machines) {
    if(m.cocktail) continue;
    screen(ctx,m.screen,m.x-26,m.y-87,52,38,reduced?0:time,true);
    if(nearby===m.id) { box(ctx,m.x-39,m.y+4,77,2,m.color); text(ctx,'PUSH START',m.x,m.y-57,7,'#fff1cb'); }
    else if (!reduced && Math.floor(time/1400)%3===0) text(ctx,'INSERT COIN',m.x,m.y-54,6,'#e4e0bd');
  }
}
