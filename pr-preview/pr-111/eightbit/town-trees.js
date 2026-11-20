const sprites = new Map();

export function riverTree(ctx, x, y, size, pine) {
  if (typeof Image === 'undefined') return;
  const name = pine ? 'river-pine' : 'river-leaf';
  if (!sprites.has(name)) {
    const image = new Image();
    image.src = new URL(`./assets/${name}.png`, import.meta.url).href;
    sprites.set(name, image);
  }
  const image = sprites.get(name);
  if (!image.complete || !image.naturalWidth) return;
  // The source padding keeps the entire canopy and soft edge inside the sprite.
  const crop = pine ? [270, 20, 700, 1210] : [240, 65, 775, 1110];
  const height = 100 * size, width = height * crop[2] / crop[3];
  ctx.drawImage(image, ...crop, x - width / 2, y - height, width, height);
}
