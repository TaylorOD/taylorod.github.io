import { findPath, isWalkable } from './scenes.js';

export const canEnter = (id, progress) => id !== 'rooftop' || progress.pizza === 'delivered';

export function hitTest(scene, point) {
  return [...scene.points].sort((a, b) => (a.hit ? a.hit[2] * a.hit[3] : 5440) - (b.hit ? b.hit[2] * b.hit[3] : 5440)).find(item => {
    const [x, y, width, height] = item.hit || [item.x - 32, item.y - 85, 64, 85];
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  });
}

// A blocked ground tap walks to the closest reachable tile instead of doing nothing.
export function nearbyPath(scene, from, target) {
  const direct = findPath(scene, from, target);
  if (direct.length) return direct;
  const candidates = [];
  const [left, top, right, bottom] = scene.bounds;
  for (let x = Math.ceil(left / 16) * 16; x < right; x += 16) {
    for (let y = Math.ceil(top / 16) * 16; y < bottom; y += 16) {
      if (isWalkable(scene, x, y)) candidates.push({ x, y, distance: Math.hypot(x - target.x, y - target.y) });
    }
  }
  candidates.sort((a, b) => a.distance - b.distance);
  for (const candidate of candidates) {
    const path = findPath(scene, from, candidate);
    if (path.length) return path;
    if (Math.hypot(candidate.x - from.x, candidate.y - from.y) < 12) return [];
  }
  return [];
}

export function mapPosition(id, player) {
  if (id === 'town') return { x: player.x / 1024 * 140, y: player.y / 768 * 96 };
  return { arcade: { x: 70, y: 42 }, cabin: { x: 118, y: 29 }, rooftop: { x: 76, y: 32 } }[id];
}
