// Coordinates are world pixels. Every interaction has a clear, reachable approach point.
const point = (id, label, x, y, action, extra = {}) => ({ id, label, x, y, action, ...extra });
export const scenes = {
  town: {
    name: 'main street', subtitle: 'missoula, montana · just before sunset', width: 1024, height: 768,
    spawn: { x: 512, y: 488 }, bounds: [32, 224, 992, 720],
    obstacles: [[320, 216, 384, 216], [784, 160, 176, 176], [0, 608, 448, 64], [576, 608, 448, 64], [736, 480, 128, 64]],
    points: [
      point('arcade', 'enter the arcade', 512, 448, 'room:arcade', { sign: 'SIDE QUEST ARCADE', hint: 'eight projects. one room.', hit: [320, 208, 384, 224] }),
      point('cabin', 'visit the cabin', 864, 352, 'room:cabin', { sign: 'HOME BASE', hit: [784, 130, 176, 212] }),
      point('mailbox', 'say hello', 736, 560, 'contact', { sign: 'POST', hit: [716, 501, 34, 48] }),
      point('bench', 'talk to the neighbor', 256, 544, 'delivery', { hit: [218, 475, 76, 60] }),
      point('river', 'by the river', 512, 704, 'river'),
      point('roof', 'the rooftop', 688, 464, 'roof', { sign: '↑ ROOFTOP', hit: [682, 312, 22, 120] }),
    ],
  },
  arcade: {
    name: 'side quest arcade', subtitle: 'quarters in. real world out.', width: 1024, height: 832,
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
  return !scene.obstacles.some(([ox, oy, w, h]) => x > ox - radius && x < ox + w + radius && y > oy - radius && y < oy + h + radius);
}

// A small grid search keeps click destinations from walking through buildings or furniture.
export function findPath(scene, from, to) {
  const cell = 16;
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
      if (!parents.has(key(next)) && isWalkable(scene, next[0] * cell, next[1] * cell)) { parents.set(key(next), current); queue.push(next); }
    }
  }
  return [];
}
