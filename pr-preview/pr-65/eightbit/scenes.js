// Coordinates are world pixels. Every interaction has a clear, reachable approach point.
const point = (id, label, x, y, action, extra = {}) => ({ id, label, x, y, action, ...extra });
export const scenes = {
  town: {
    name: 'main street', subtitle: 'missoula, montana · just before sunset', width: 1024, height: 768,
    spawn: { x: 512, y: 488 }, bounds: [32, 224, 992, 720],
    obstacles: [[320, 216, 384, 216], [64, 304, 176, 144], [784, 240, 176, 176], [0, 608, 448, 64], [576, 608, 448, 64], [736, 480, 128, 64]],
    points: [
      point('arcade', 'enter the arcade', 512, 448, 'room:arcade', { sign: 'SIDE QUEST ARCADE', hint: 'eight projects. one room.' }),
      point('workshop', 'visit the workshop', 160, 464, 'room:workshop', { sign: 'THE WORKSHOP' }),
      point('cabin', 'visit the cabin', 864, 432, 'room:cabin', { sign: 'HOME BASE' }),
      point('mailbox', 'say hello', 736, 560, 'contact', { sign: 'POST' }),
      point('bench', 'take a little break', 256, 544, 'bench'),
      point('river', 'by the river', 512, 704, 'river'),
      point('roof', 'the rooftop', 688, 464, 'roof', { sign: '↑ ROOFTOP' }),
    ],
  },
  arcade: {
    name: 'side quest arcade', subtitle: 'games, tools & other experiments', width: 1024, height: 768,
    spawn: { x: 512, y: 624 }, bounds: [96, 240, 928, 672],
    obstacles: [[144, 224, 96, 112], [288, 224, 96, 112], [432, 224, 96, 112], [576, 224, 96, 112], [768, 240, 112, 96], [128, 432, 128, 96], [768, 432, 128, 80], [416, 448, 160, 64]],
    points: [
      point('lilgotchi', 'meet lilgotchi', 192, 368, 'project:lilgotchi'),
      point('snowcrust', 'play snowcrust', 336, 368, 'project:snowcrust'),
      point('relay', 'break something in relay', 480, 368, 'project:relay'),
      point('fight', 'check fight terminal', 624, 368, 'project:fight'),
      point('sweat', 'mr game and sweat', 816, 368, 'project:sweat'),
      point('moonbean', 'get a coffee', 192, 560, 'project:moonbean'),
      point('poker', 'take a seat', 496, 544, 'project:poker'),
      point('reachoutt', 'pick up the phone', 832, 544, 'project:reachoutt'),
      point('pizza', 'pizza delivery', 304, 592, 'pizza'),
      point('photo', 'the photo booth', 688, 592, 'photo'),
      point('exit', 'back to main street', 512, 656, 'room:town'),
    ],
  },
  workshop: {
    name: 'the workshop', subtitle: 'from finding engineers to being one', width: 768, height: 640,
    spawn: { x: 384, y: 528 }, bounds: [96, 224, 672, 560],
    obstacles: [[128, 208, 192, 112], [432, 208, 192, 112], [128, 400, 112, 80], [512, 400, 112, 64]],
    points: [point('work', 'the day job', 224, 352, 'work'), point('legacy', 'boot the old computer', 528, 352, 'legacy'), point('notes', 'a note from taylor', 272, 448, 'about'), point('exit', 'back to main street', 384, 544, 'room:town')],
  },
  cabin: {
    name: 'home base', subtitle: 'a few things beyond the keyboard', width: 768, height: 640,
    spawn: { x: 384, y: 528 }, bounds: [96, 224, 672, 560],
    obstacles: [[128, 208, 160, 112], [464, 208, 160, 112], [128, 400, 128, 80], [480, 400, 144, 64]],
    points: [point('about', 'a bit about taylor', 208, 352, 'about'), point('pets', 'choose your companion', 544, 352, 'pets'), point('delivery', 'someone ordered pizza', 192, 496, 'delivery'), point('books', 'on the bookshelf', 544, 496, 'books'), point('exit', 'back to main street', 384, 544, 'room:town')],
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
