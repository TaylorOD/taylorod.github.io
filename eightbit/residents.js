import { findPath, scenes } from './scenes.js';
import { box } from './art.js';

// Fictional neighbors with different ages, builds, clothing and mobility.
const looks = [
  { skin: '#754b38', hair: '#261f2c', shirt: '#e1ad49', width: 22, curls: true },
  { skin: '#e4b08c', hair: '#d9d6c7', shirt: '#8aafbd', width: 20, cane: true },
  { skin: '#b7815b', hair: '#383043', shirt: '#d173ab', width: 25, chair: true },
  { skin: '#f0c8a1', hair: '#8c4738', shirt: '#789a71', width: 17, scale: .78 },
  { skin: '#593d32', hair: '#212831', shirt: '#8d87c7', width: 27, long: true },
  { skin: '#c79a72', hair: '#25272d', shirt: '#f08168', width: 20, hat: true },
  { skin: '#d3a17d', hair: '#cbb695', shirt: '#5a9b9e', width: 23, long: true },
  { skin: '#8a624b', hair: '#392f2d', shirt: '#b8ba74', width: 18, scale: .85 },
];
const destinations = [{ x: 160, y: 464, door: 'workshop' }, { x: 512, y: 448, door: 'arcade' }, { x: 688, y: 576 }, { x: 512, y: 704 }, { x: 272, y: 560 }];
const indoorStops = {
  arcade: [{ x: 272, y: 496 }, { x: 416, y: 608 }, { x: 752, y: 496 }],
  workshop: [{ x: 224, y: 352 }, { x: 528, y: 352 }],
};

export function createResidents() {
  return [
    ...looks.map((look, index) => ({
      ...destinations[index % destinations.length], look, room: 'town', direction: 'down', route: [],
      stop: index * .7, next: (index + 2) % destinations.length, speed: 27 + index % 3 * 8,
      phase: 'street', hidden: 0,
    })),
    { x: 256, y: 520, room: 'town', direction: 'down', look: looks[0], seated: true, walking: false },
  ];
}

export function updateResidents(residents, _scene, delta, player, playerRoom = 'town') {
  for (const resident of residents) {
    resident.walking = false;
    if (resident.seated) continue;
    if (resident.hidden > 0) { resident.hidden = Math.max(0, resident.hidden - delta); continue; }
    if (resident.stop > 0) { resident.stop -= delta; continue; }
    const scene = scenes[resident.room];
    if (!resident.route.length) {
      if (resident.phase === 'enter') {
        resident.room = resident.destination.door;
        Object.assign(resident, scenes[resident.room].spawn);
        resident.phase = 'inside'; resident.hidden = 1; resident.stop = 1;
        resident.route = findPath(scenes[resident.room], resident, indoorStops[resident.room][resident.next % indoorStops[resident.room].length]);
        continue;
      }
      if (resident.phase === 'inside') {
        resident.stop = 5 + resident.next;
        resident.route = findPath(scene, resident, scene.spawn);
        resident.phase = 'leave'; continue;
      }
      if (resident.phase === 'leave') {
        const door = destinations.find(point => point.door === resident.room);
        resident.room = 'town'; resident.x = door.x; resident.y = door.y;
        resident.phase = 'street'; resident.hidden = .7;
      }
      resident.destination = destinations[resident.next];
      resident.route = findPath(scenes.town, resident, resident.destination);
      resident.phase = resident.destination.door ? 'enter' : 'street';
      resident.next = (resident.next + 1) % destinations.length;
      resident.stop = 2 + resident.next;
      continue;
    }
    if (resident.room === playerRoom && Math.hypot(resident.x - player.x, resident.y - player.y) < 30) continue;
    const target = resident.route[0], dx = target.x - resident.x, dy = target.y - resident.y;
    const distance = Math.hypot(dx, dy), step = resident.speed * delta;
    if (distance <= step) { resident.x = target.x; resident.y = target.y; resident.route.shift(); }
    else { resident.x += dx / distance * step; resident.y += dy / distance * step; }
    resident.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up';
    resident.walking = true;
  }
}

export function drawResident(ctx, resident, time, reduced) {
  const { look, direction } = resident;
  const stride = resident.walking && !reduced ? Math.sin(time / 140) * 3 : 0;
  ctx.save(); ctx.translate(Math.round(resident.x), Math.round(resident.y)); ctx.scale(look.scale || 1, look.scale || 1);
  const w = look.width, seated = look.chair || resident.seated;
  box(ctx, -w / 2 - 2, 0, w + 4, 4, '#17292f55');
  box(ctx, -8, -14, 6, 14 - stride, '#324354'); box(ctx, 3, -14, 6, 14 + stride, '#324354');
  box(ctx, -10, -2 - stride, 10, 4, '#1f2632'); box(ctx, 2, -2 + stride, 10, 4, '#1f2632');
  box(ctx, -w / 2, -29, w, 19, look.shirt);
  box(ctx, -w / 2 - 3, -27 + stride, 4, 15, look.skin); box(ctx, w / 2, -27 - stride, 4, 15, look.skin);
  box(ctx, -8, -42, 16, 15, look.skin); box(ctx, -9, -46, 18, 7, look.hair);
  if (look.curls) for (let i = 0; i < 4; i++) box(ctx, -11 + i * 6, -48 + i % 2 * 2, 7, 9, look.hair);
  if (look.long) { box(ctx, -10, -42, 4, 20, look.hair); box(ctx, 7, -42, 4, 20, look.hair); }
  if (look.hat) { box(ctx, -10, -48, 20, 8, '#daa34d'); box(ctx, -14, -42, 28, 3, '#daa34d'); }
  if (direction === 'up') box(ctx, -8, -40, 16, 11, look.hair);
  else { box(ctx, direction === 'right' ? 5 : -5, -35, 2, 2, '#242936'); if (direction === 'down') box(ctx, 4, -35, 2, 2, '#242936'); }
  if (look.cane) { box(ctx, w / 2 + 3, -16, 3, 20, '#b99c74'); box(ctx, w / 2, -17, 6, 3, '#b99c74'); }
  if (seated) box(ctx, -10, -12, 24, 7, '#38424d');
  if (look.chair) {
    for (const x of [-15, 10]) { box(ctx, x, -14, 8, 19, '#b0cbd5'); box(ctx, x + 2, -11, 4, 13, '#283546'); box(ctx, x + 3, -7, 2, 5, '#8eafc1'); }
    box(ctx, -14, -20, 29, 3, '#9cbbc8'); box(ctx, 12, -26, 3, 30, '#9cbbc8');
  }
  ctx.restore();
}
