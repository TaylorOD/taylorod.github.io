import { box, polygon, glow, text } from './art.js';

export const dayLength = 360000;
const stops = [
  [0, ['#748aaa','#c89ca8','#f1b18e','#f6cf97'], 0, .12],
  [.10, ['#615e92','#ac78a0','#ee938c','#f8b67d'], .10, .22],
  [.20, ['#343c69','#61547e','#a56e94','#c78d9c'], .25, .08],
  [.30, ['#111e39','#1d2c49','#30425f','#4c5b76'], .48, 0],
  [.52, ['#111e39','#1d2c49','#30425f','#4c5b76'], .48, 0],
  [.63, ['#657a9b','#a593ad','#deb0a3','#f1c6a1'], .10, .10],
  [.74, ['#76a9c0','#91bbc9','#b2cfd0','#d9dfcb'], 0, 0],
  [.88, ['#76a9c0','#91bbc9','#b2cfd0','#d9dfcb'], 0, 0],
  [1, ['#748aaa','#c89ca8','#f1b18e','#f6cf97'], 0, .12],
];
const mix = (a, b, amount) => a + (b - a) * amount;
function colorBetween(a, b, amount) {
  const channels = [1, 3, 5].map(start => Math.round(mix(parseInt(a.slice(start,start+2),16), parseInt(b.slice(start,start+2),16), amount)));
  return `rgb(${channels.join(',')})`;
}

export function daylight(time, reduced = false) {
  const phase = reduced ? .06 : ((time % dayLength) + dayLength) % dayLength / dayLength;
  const next = stops.findIndex(stop => stop[0] > phase), a = stops[next - 1], b = stops[next];
  const amount = (phase - a[0]) / (b[0] - a[0]);
  const night = mix(a[2],b[2],amount), warmth = mix(a[3],b[3],amount);
  const label = phase < .16 || phase >= .94 ? 'sunset' : phase < .25 ? 'blue hour' : phase < .57 ? 'night' : phase < .69 ? 'dawn' : 'daytime';
  const angle = phase * Math.PI * 2 + .65;
  return { phase, colors: a[1].map((color,index) => colorBetween(color,b[1][index],amount)), night, warmth, lights: Math.min(1,night / .35), stars: Math.max(0,(night - .18) / .30), label,
    sun: { x: .5 + Math.sin(angle) * .38, y: 190 - Math.cos(angle) * 170 },
    moon: { x: .5 - Math.sin(angle) * .38, y: 190 + Math.cos(angle) * 170 } };
}

export function paintSky(ctx, width, height, light) {
  box(ctx,0,0,width,height,light.colors[3]);
  const colors = light.colors.map(color => color.match(/\d+/g).map(Number));
  for (let y=0;y<208;y+=8) {
    const band = Math.min(2,Math.floor(y / 52)), blend = Math.min(1,(y-band*52)/52);
    // Fine horizontal bands keep the sunset in the same pixel style as the town.
    const color = colors[band].map((value,index) => Math.round(mix(value,colors[band+1][index],blend)));
    box(ctx,0,y,width,8,`rgb(${color.join(',')})`);
  }
  ctx.save(); ctx.globalAlpha = light.stars;
  for (let i=0;i<58;i++) { const x=(i*173+37)%width, y=9+(i*47)%145; box(ctx,x,y,i%9===0?2:1,1,'#eee8c9'); }
  ctx.restore();
  if (light.sun.y < 220) {
    glow(ctx,width*light.sun.x,light.sun.y,'#f5ba8a',70,light.warmth*.23);
    box(ctx,width*light.sun.x-13,light.sun.y-16,26,32,'#f8d49c'); box(ctx,width*light.sun.x-17,light.sun.y-9,34,18,'#f8d49c');
  }
  if (light.moon.y < 190 && light.stars > 0) {
    ctx.save(); ctx.globalAlpha=light.stars;
    box(ctx,width*light.moon.x-9,light.moon.y-12,18,24,'#e2e5d0'); box(ctx,width*light.moon.x-12,light.moon.y-8,24,16,'#e2e5d0');
    box(ctx,width*light.moon.x-4,light.moon.y-6,5,4,'#b6c4c5'); box(ctx,width*light.moon.x+3,light.moon.y+3,4,5,'#b6c4c5'); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha=.24 + light.warmth;
  for(const [x,y,w] of [[.09,38,115],[.34,19,90],[.63,82,160],[.82,54,110]]) {
    box(ctx,width*x,y,w,4,light.colors[2]); box(ctx,width*x+17,y-4,w-37,4,light.colors[2]);
  }
  ctx.restore();
}

export function outdoorLight(ctx, room, width, height, light) {
  ctx.save(); ctx.globalAlpha=light.night; box(ctx,0,0,width,height,'#10223e');
  ctx.globalAlpha=light.warmth*.24; box(ctx,0,208,width,height-208,'#ef9b76'); ctx.restore();
  if (room !== 'town' || light.lights <= 0) return;
  ctx.save(); ctx.globalAlpha=light.lights;
  for (const [x,y] of [[288,448],[738,456],[398,579],[620,579]]) {
    glow(ctx,x+2,y-75,'#f4be79',50,.09);
    box(ctx,x-3,y-84,11,13,'#f4d29a');
    ctx.save(); ctx.globalAlpha*=.11;
    polygon(ctx,[[x-3,y-68],[x+9,y-68],[x+32,y+2],[x-26,y+2]],'#f4be79'); ctx.restore();
  }
  for(const x of [395,625]) { glow(ctx,x,285,'#f3c28e',34,.06); box(ctx,x-5,266,11,2,'#ffe0a8'); }
  ctx.save(); ctx.globalAlpha *= .15;
  polygon(ctx,[[495,432],[529,432],[555,493],[469,493]],'#f4c488');
  for(const [x,w] of [[341,137],[546,121]]) polygon(ctx,[[x,432],[x+w,432],[x+w+12,464],[x-12,464]],'#dfb87c');
  ctx.restore();
  text(ctx,'LAST LIGHT ARCADE',512,285,18,'#f0dcb0');
  // The cabin windows stay warm while the surrounding hill settles into night.
  glow(ctx,875,221,'#f1b46e',48,.07);
  ctx.save(); ctx.translate(800,112); ctx.scale(.85,.85);
  polygon(ctx,[[61,85],[88,27],[115,85]],'#e7bb7f');
  box(ctx,75,112,26,29,'#efc18b');
  for(const x of [28,126]) { box(ctx,x,128,10,22,'#e9b77a'); box(ctx,x+13,128,10,22,'#e9b77a'); }
  ctx.restore(); ctx.restore();
}

export function riverReflection(ctx, light, time) {
  const center = (light.stars > .5 ? light.moon.x : light.sun.x) * 1024;
  ctx.save(); ctx.globalAlpha=Math.max(light.warmth*.8,light.stars*.22);
  for(let i=0;i<9;i++) {
    const width=18+i*7, x=center-width/2+Math.sin(time/1800+i)*5;
    if (x < 580 && x+width > 440) continue;
    box(ctx,x,616+i*5,width,2,light.stars>.5?'#bcced6':'#f2c29b');
  }
  ctx.restore();
}


export function groundShadows(ctx, light, people, trees = []) {
  if (light.night >= .3) return;
  const length = 18 + light.warmth * 240;
  const direction = light.sun.x > .5 ? -1 : 1;
  ctx.save(); ctx.globalAlpha = .16 * (1-light.night/.3);
  ctx.beginPath(); ctx.rect(0,432,1024,168); ctx.rect(0,680,1024,184); ctx.clip();
  for (const [x,y,height,width] of [
    ...people.map(p=>[p.x,p.y,p.height || 42,p.width || 14]),
    ...trees.map(([x,y,size])=>[x,y,80*size,22*size]),
    ...[[288,448],[738,456],[398,579],[620,579]].map(([x,y])=>[x,y,90,5]),
  ]) {
    const reach=length*height/48;
    polygon(ctx,[[x-width/2,y],[x+width/2,y],[x+direction*reach+width*.3,y+reach*.32],[x+direction*reach-width*.3,y+reach*.32]],'#182d40');
  }
  ctx.restore();
}

export function mountainLight(ctx, width, light) {
  ctx.save(); ctx.globalAlpha = light.warmth * 2;
  for(const [fraction,h] of [[0,80],[.2,110],[.46,89],[.7,123],[1,104]]) {
    const x=width*fraction,y=180-h;
    polygon(ctx,[[x-35,y+29],[x,y],[x+34,y+40],[x+12,y+30],[x-2,y+43],[x-13,y+29]],'#f6b48b');
  }
  ctx.restore();
}
