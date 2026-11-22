import { drawResident } from './residents.js';

export const students = [
  { skin: '#e7bd99', hair: '#6a4332', shirt: '#773f50', width: 20, long: true },
  { skin: '#bd8d68', hair: '#292c32', shirt: '#c1b16f', width: 21 },
  { skin: '#e4b18c', hair: '#b0a17d', shirt: '#739ca8', width: 19 },
];

export function campusWalker(time, index = 0) {
  const phase = ((time / 1000 + index * 17) % 66) / 66;
  const returning = phase > .5;
  const depth = returning ? (1 - phase) * 2 : phase * 2;
  return {
    x: 412 + 20 * depth + (returning ? 5 : -5), y: 566 - 263 * depth,
    gaitDistance: Math.hypot(20,263)/(.7*.72)*(returning?-2*Math.log(.28)+Math.log(1-.72*depth):-Math.log(1-.72*depth)),
    look: { ...students[index % students.length], scale: 1 - .72 * depth },
    direction: returning ? 'down' : 'up', walking: true,
  };
}

export function campusActors(ctx, time, reduced = false) {
  return students.map((_, index) => {
    const resident = campusWalker(reduced ? 12000 : time, index);
    return { y: resident.y, draw: () => drawResident(ctx, resident, time, reduced) };
  });
}

export function campusScale(x, y) {
  if (x < 340 || x > 480 || y >= 566) return 1;
  return .28 + .72 * Math.max(0, Math.min(1, (y - 303) / 263));
}
