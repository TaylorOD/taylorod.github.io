import { slicePalette, sliceSprites } from '../assets/lilgotchi/3.0.7/pets/slice-sprites.js';
import { lilgotchiPalette, lilgotchiSprites } from '../assets/lilgotchi/3.0.7/pets/lilgotchi-sprites.js';
import { cyberpunkPalette, cyberpunkSprites } from '../assets/lilgotchi/3.0.7/pets/cyberpunk-sprites.js';

const companions = {
  slice: [slicePalette, sliceSprites.ginjirotchi],
  lilgotchi: [lilgotchiPalette, lilgotchiSprites.mametchi],
  cypunk: [cyberpunkPalette, cyberpunkSprites.mametchi],
};

export function drawCompanion(ctx, x, y, kind = 'slice', time = 0, asleep = false, scale = 1, direction = 'down', happy = false) {
  const [palette, poses] = companions[kind] || companions.slice;
  const pose = asleep ? 'sleep' : happy ? 'happy' : ({ left: 'lookLeft', right: 'lookRight', up: 'lookUp' }[direction] || (Math.floor(time / 350) % 2 ? 'idle2' : 'idle1'));
  const frame = poses[pose] || poses.idle1;
  const pixel = 2 * scale;
  ctx.save();
  ctx.fillStyle = '#192f3644'; ctx.fillRect(Math.round(x - 12 * scale), Math.round(y), 24 * scale, 4 * scale);
  for (let row = 0; row < frame.length; row++) {
    for (let column = 0; column < frame[row].length; column++) {
      const color = palette[frame[row][column]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + (column - frame[row].length / 2) * pixel), Math.round(y + (row - frame.length) * pixel), Math.ceil(pixel), Math.ceil(pixel));
    }
  }
  ctx.restore();
}

// Follow recorded footsteps so the pet takes the same turns around obstacles.
export function followTrail(companion, trail, player, delta) {
  const last = trail.at(-1) || companion;
  if (Math.hypot(player.x - last.x, player.y - last.y) >= 3) trail.push({ ...player });
  let remaining = trail.reduce((sum, point, index) => {
    const previous = index ? trail[index - 1] : companion;
    return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
  }, 0);
  let budget = Math.min(Math.max(0, remaining - 28), delta * 150);
  while (trail.length && budget > 0) {
    const next = trail[0], dx = next.x - companion.x, dy = next.y - companion.y;
    const distance = Math.hypot(dx, dy);
    companion.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up';
    if (distance <= budget) { companion.x = next.x; companion.y = next.y; trail.shift(); budget -= distance; }
    else { companion.x += dx / distance * budget; companion.y += dy / distance * budget; budget = 0; }
  }
}
