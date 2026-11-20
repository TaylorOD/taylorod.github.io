import { townPaths, insidePolygon } from './town-layout.js';
// Coordinates are world pixels. Every interaction has a clear, reachable approach point.
const point = (id, label, x, y, action, extra = {}) => ({ id, label, x, y, action, ...extra });
export const scenes = {
  town: {
    name: 'main street', subtitle: 'missoula, montana · sunset', width: 1536, height: 1024,
    spawn: { x: 896, y: 576 }, bounds: [0, 240, 1536, 1000], grid: 8,
    paths: townPaths, obstacles: [[174,870,218,85]],
    points: [
      point('hidden-original','look behind the tree',336,656,'find:original',{hit:[322,626,28,30]}),
      point('carousel', 'the carousel', 424, 944, 'carousel', { hit: [172,812,222,145] }),
      point('wilma', 'outside the Wilma', 144, 576, 'wilma', { hit: [52,174,211,386] }),
      point('arcade', 'enter the arcade', 1304, 576, 'room:arcade', { sign: 'LAST BEST ARCADE', hint: 'eight projects. one room.', hit: [1154,410,280,150] }),
      point('cabin', 'visit the cabin', 1416, 264, 'room:cabin', { sign: 'HOME BASE', hit: [1356,92,122,162] }),
      point('mailbox', 'say hello', 1008, 656, 'contact', { hit: [998,612,28,34] }),
      point('bench', 'talk to the neighbor', 560, 656, 'delivery', { hit: [520,605,80,42] }),
      point('river', "Brennan's Wave", 600, 800, 'river', {hit:[490,707,160,65]}),
      ...[['runners',"Runner's Edge",608],['basal','Basal',744],['shakespeare','Shakespeare Books',904],['sbg','SBG Missoula',1072]].map(([id,label,x]) => point(id,label,x,576,`place:${id}`,{hit:[x-64,434,128,122]})),
      point('campus', 'the university', 432, 304, 'campus', { hit: [337,158,166,132] }),
      point('roof', 'the rooftop', 1424, 576, 'roof', { hit: [1408,468,24,88] }),
    ],
  },
  arcade: {
    name: 'last best arcade', subtitle: 'quarters in. real world out.', width: 768, height: 512,
    spawn: { x: 384, y: 456 }, bounds: [16, 256, 752, 504], grid: 8,
    obstacles: [[24,256,144,96], [560,256,180,104], [20,360,80,116], [572,384,176,88]],
    points: [
      ...[['lilgotchi','meet lilgotchi',240],['snowcrust','play snowcrust',288],['relay','try relay',336],['fight','fight terminal',384],['sweat','mr game and sweat',432],['moonbean','moonbean coffee',480],['reachoutt','reachoutt',528]].map(([id,label,x]) => point(id,label,x,280,`project:${id}`,{hit:[x-22,132,44,128]})),
      point('hidden-cypunk','look beside the pinball',184,320,'find:cypunk',{hit:[172,295,24,32]}),
      point('poker','poker seater',544,320,'project:poker',{hit:[560,256,180,104]}),
      point('pizza','pizza delivery',208,376,'pizza',{hit:[187,365,38,28]}),
      point('photo','take a photo',480,376,'photo'),
      point('exit','back to main street',384,488,'room:town',{hit:[336,480,96,32]}),
    ],
  },
  cabin: {
    name: 'home base', subtitle: 'a few things beyond the keyboard', width: 768, height: 512,
    spawn: { x: 384, y: 432 }, bounds: [32,304,736,456], grid: 8,
    obstacles: [[80,336,248,112],[590,304,144,104],[128,304,128,24],[476,304,112,16]],
    points: [
      point('about','a bit about taylor',568,416,'about',{hit:[590,276,144,132]}),
      point('pets','visit Scout and your companions',280,320,'pets',{hit:[140,230,120,98]}),
      point('books','on the bookshelf',384,328,'books',{hit:[284,160,176,144]}),
      point('exit','back to main street',384,440,'room:town',{hit:[324,438,118,74]}),
    ],
  },
  rooftop: {
    name: 'above it all', subtitle: 'a sunset over missoula', width: 768, height: 512,
    spawn: { x: 624, y: 368 }, bounds: [64,272,728,388], grid: 8,
    obstacles: [[132,272,100,32],[488,272,136,48],[648,344,72,44]],
    points: [point('view','enjoy the view',384,288,'view'), point('photo','take a photo',448,352,'photo'), point('exit','back downstairs',632,368,'room:town',{hit:[648,320,72,80]})],
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

// Keep only turns that scenery requires. Sample the whole segment, including the
// actor's radius, so smoothing cannot cut across riverbanks or furniture.
export function findSmoothPath(scene, from, to) {
  const route = findPath(scene, from, to);
  const result = [];
  let anchor = from, start = 0;
  while (start < route.length) {
    let end = start;
    for (let i = start + 1; i < route.length; i++) {
      const target = route[i], steps = Math.ceil(Math.hypot(target.x-anchor.x,target.y-anchor.y) / .5);
      let clear = true;
      for (let n = 0; n <= steps; n++) {
        if (!isWalkable(scene, anchor.x+(target.x-anchor.x)*n/steps, anchor.y+(target.y-anchor.y)*n/steps, 7.5)) { clear = false; break; }
      }
      if (!clear) break;
      end = i;
    }
    anchor = route[end]; result.push(anchor); start = end + 1;
  }
  return result;
}
