import { box, text } from './art.js';

const images = new Map();
export function drawInterior(ctx, id) {
  if (!images.has(id)) {
    const image = new Image();
    image.src = new URL(`./assets/${id}.png`, import.meta.url).href;
    images.set(id, image);
  }
  const image = images.get(id);
  if (!image.complete || !image.naturalWidth) {
    box(ctx, 0, 0, 768, 512, '#203e40');
    text(ctx, 'opening the door…', 384, 360, 14);
    return false;
  }
  ctx.drawImage(image, 0, 0, 768, 512);
  return true;
}
