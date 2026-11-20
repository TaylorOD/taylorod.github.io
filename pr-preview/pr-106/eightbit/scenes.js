import { townPaths, insidePolygon } from './town-layout.js';
// Coordinates are world pixels. Every interaction has a clear, reachable approach point.
const point = (id, label, x, y, action, extra = {}) => ({ id, label, x, y, action, ...extra });
export const scenes = {
  town: {
    name: 'main street', subtitle: 'missoula, montana · sunset', width: 1536, height: 1024,
    spawn: { x: 896, y: 576 }, bounds: [0, 240, 1536, 1000], grid: 8,
    paths: townPaths, obstacles: [[174,870,218,85]],
    points: [
      point('carousel', 'the carousel', 424, 944, 'carousel', { hit: [172,812,222,145] }),
      point('wilma', 'outside the Wilma', 144, 576, 'wilma', { hit: [52,174,211,386] }),
      point('arcade', 'enter the arcade', 1304, 576, 'room:arcade', { sign: 'LAST BEST ARCADE', hint: 'eight projects. one room.', hit: [1154,410,280,150] }),
      point('cabin', 'visit the cabin', 1416, 264, 'room:cabin', { sign: 'HOME BASE', hit: [1356,92,122,162] }),
      point('mailbox', 'say hello', 1008, 656, 'contact', { hit: [998,612,28,34] }),
      point('bench', 'talk to the neighbor', 560, 656, 'delivery', { hit: [520,605,80,42] }),
      point('river', 'by the river', 896, 800, 'river'),
      point('campus', 'the university', 432, 304, 'campus', { hit: [337,158,166,132] }),
      point('roof', 'the rooftop', 1424, 576, 'roof', { hit: [1408,468,24,88] }),
    ],
  },
  arcade: {
    name: 'last best arcade', subtitle: 'quarters in. real world out.', width: 1024, height: 832,
    spawn: { x: 512, y: 736 }, bounds: [176, 336, 848, 784],
    obstacles: [[216, 344, 96, 128], [376, 344, 96, 128], [536, 344, 96, 128], [696, 344, 96, 128], [216, 520, 96, 128], [352, 584, 128, 64], [536, 520, 96, 128], [696, 520, 96, 128], [184, 704, 80, 64], [320, 704, 48, 48], [776, 704, 72, 64]],
    points: [
      point('lilgotchi', 'meet lilgotchi', 272, 496, 'project:lilgotchi', { hit: [216, 344, 96, 128] }),
      point('snowcrust', 'play snowcrust', 432, 496, 'project:snowcrust', { hit: [376, 344, 96, 128] }),
      point('relay', 'break something in relay', 592, 496, 'project:relay', { hit: [536, 344, 96, 128] }),
      point('fight', 'check fight terminal', 752, 496, 'project:fight', { hit: [696, 344, 96, 128] }),
      point('sweat', 'mr game and sweat', 592, 672, 'project:sweat', { hit: [544, 520, 96, 128] }),
      point('moonbean', 'play moonbean', 272, 672, 'project:moonbean', { hit: [224, 520, 96, 128] }),
      point('poker', 'play poker seater', 416, 672, 'project:poker', { hit: [368, 584, 96, 64] }),
      point('reachoutt', 'play reachoutt', 752, 672, 'project:reachoutt', { hit: [704, 520, 96, 128] }),
      point('pizza', 'pizza delivery', 288, 752, 'pizza', { hit: [184, 704, 80, 64] }),
      point('computer', 'boot the old computer', 336, 768, 'legacy', { hit: [320, 700, 48, 52] }),
      point('photo', 'the photo booth', 752, 752, 'photo', { hit: [776, 704, 72, 64] }),
      point('exit', 'back to main street', 512, 768, 'room:town', { hit: [450, 749, 125, 35] }),
    ],
  },
  cabin: {
    name: 'home base', subtitle: 'a few things beyond the keyboard', width: 768, height: 640,
    spawn: { x: 384, y: 528 }, bounds: [96, 224, 672, 560],
    obstacles: [[128, 208, 160, 112], [304, 224, 168, 104], [496, 240, 176, 80], [128, 400, 144, 80], [496, 328, 128, 88], [480, 416, 160, 64]],
    points: [point('about', 'a bit about taylor', 208, 352, 'about'), point('pets', 'choose your companion', 608, 528, 'pets', { hit: [570, 480, 96, 48] }), point('books', 'on the bookshelf', 480, 384, 'books', { hit: [496, 328, 128, 88] }), point('exit', 'back to main street', 384, 544, 'room:town')],
  },
  rooftop: {
    name: 'above it all', subtitle: 'a small reward for taking the long way', width: 768, height: 640,
    spawn: { x: 384, y: 464 }, bounds: [144, 320, 624, 528], obstacles: [[176, 320, 112, 64], [480, 336, 96, 64]],
    points: [point('view', 'enjoy the view', 384, 352, 'view'), point('photo', 'take a photo', 496, 448, 'photo'), point('exit', 'back downstairs', 384, 512, 'room:town')],
  },
};

export function isWalkable(scene, x, y, radius = 7) {
  const [left, top, right, bottom] = scene.bounds;
  if (x < left + radius || y < top + radius || x > right - radius || y > bottom - radius) return false;
  if (scene.paths && ![[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].every(([dx,dy]) => scene.paths.some(p => insidePolygon(x+dx,y+dy,p)))) return false;
  return !scene.obstacles.some(([ox, oy, w, h]) => x > ox - radius && x < ox + w + radius && y > oy - radius && y < oy + h + radius);
}

// A small grid search keeps click destinations from walking through buildings or furniture.
export function findPath(scene, from, to) {
  const cell = scene.grid || 16;
  const start = [Math.round(from.x / cell), Math.round(from.y / cell)];
  const end = [Math.round(to.x / cell), Math.round(to.y / cell)];
  if (!isWalkable(scene, end[0] * cell, end[1] * cell)) return [];
  const key = ([x, y]) => `${x},${y}`;
  const queue = [start];
  const parents = new Map([[key(start), null]]);
  let cursor = 0;
  while (cursor < queue.length) {
    const current = queue[cursor++];
    if (key(current) === key(end)) {
      const path = [];
      let node = current;
      while (parents.get(key(node))) { path.unshift({ x: node[0] * cell, y: node[1] * cell }); node = parents.get(key(node)); }
      return path;
    }
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const next = [current[0] + dx, current[1] + dy];
      const clear = [0, .25, .5, .75, 1].every(t => isWalkable(scene,
        (current[0] + dx * t) * cell, (current[1] + dy * t) * cell));
      if (!parents.has(key(next)) && clear) { parents.set(key(next), current); queue.push(next); }
    }
  }
  return [];
}
