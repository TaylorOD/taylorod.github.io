import { box, text } from './art.js';
import { paintSky } from './daylight.js';

const images = new Map();
function interiorImage(id) {
  if (!images.has(id)) {
    const image = new Image();
    image.src = new URL(`./assets/${id}.png`, import.meta.url).href;
    images.set(id, image);
  }
  return images.get(id);
}

export async function loadInterior(id) {
  const image = interiorImage(id);
  await image.decode();
  return image;
}

export function drawInterior(ctx, id) {
  const image = interiorImage(id);
  if (!image.complete || !image.naturalWidth) {
    box(ctx, 0, 0, 768, 512, '#203e40');
    text(ctx, 'opening the door…', 384, 360, 14);
    return false;
  }
  ctx.drawImage(image, 0, 0, 768, 512);
  return true;
}

// Follow the painted mountain edge so only the rooftop sky changes with the town clock.
export function roofSky(ctx, light) {
  const edge = [[0,0],[1536,0],[1536,99],[1458,145],[1435,133],[1390,149],
    [1351,156],[1240,107],[1188,73],[1169,84],[1138,101],[1025,160],[1004,161],
    [954,145],[886,130],[843,103],[791,127],[730,158],[584,83],[447,114],
    [371,73],[243,150],[110,112],[69,89],[27,110],[0,125]];
  ctx.save(); ctx.scale(.5,.5); ctx.beginPath();
  edge.forEach(([x,y],index)=>index?ctx.lineTo(x,y ? y+3 : 0):ctx.moveTo(x,y));
  ctx.closePath(); ctx.clip();
  ctx.globalAlpha=1;
  paintSky(ctx,1536,210,light);
  ctx.restore();
}
