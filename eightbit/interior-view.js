import { box, text } from './art.js';

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
