import { findSmoothPath as findPath, scenes } from './scenes.js';
import { box, polygon } from './art.js';

// Fictional neighbors with different ages, builds, clothing and mobility.
const looks = [
  { skin: '#754b38', hair: '#261f2c', shirt: '#e1ad49', width: 22, curls: true },
  { skin: '#e4b08c', hair: '#d9d6c7', shirt: '#8aafbd', width: 20, cane: true },
  { skin: '#b7815b', hair: '#383043', shirt: '#d173ab', width: 25, chair: true },
  { skin: '#f0c8a1', hair: '#8c4738', shirt: '#789a71', width: 17, scale: .78 },
  { skin: '#edc4a4', hair: '#212831', shirt: '#8d87c7', width: 27, long: true },
  { skin: '#e2b38f', hair: '#25272d', shirt: '#f08168', width: 20, hat: true },
  { skin: '#d3a17d', hair: '#cbb695', shirt: '#5a9b9e', width: 23, long: true },
  { skin: '#e7bd9e', hair: '#392f2d', shirt: '#b8ba74', width: 18, scale: .85 },
];
const destinations = [{ x: 424, y: 576 }, { x: 1304, y: 576, door: 'arcade' }, { x: 1200, y: 656 }, { x: 896, y: 800 }, { x: 584, y: 656, activity: 'sit' }, { x: 640, y: 656, activity: 'talk' }, { x: 672, y: 656, activity: 'talk' }];
const indoorStops = {
  arcade: [{ x: 240, y: 280 }, { x: 544, y: 320 }, { x: 528, y: 280 }],
};

export function createResidents() {
  return [
    ...looks.map((look, index) => ({
      ...(index === 7 ? { x: 1440, y: 576 } : destinations[index % destinations.length]), index, look, room: 'town', direction: 'down', route: [],
      stop: index * .7, next: (index + 2) % destinations.length, speed: 27 + index % 3 * 8,
      phase: 'street', hidden: 0,
    })),
    { x: 552, y: 640, room: 'town', direction: 'down', look: looks[1], seated: true, walking: false },
  ];
}

export function updateResidents(residents, _scene, delta, player, playerRoom = 'town', time = 0) {
  for (const resident of residents) {
    resident.walking = false;
    if (resident.seated) continue;
    const phase = time % 360000 / 360000;
    const bedtime = phase > .25 + resident.index * .008 && phase < .64;
    if (resident.home) {
      if (bedtime) continue;
      resident.home = false; resident.hidden = .7; resident.stop = resident.index * .8;
    }
    if (bedtime && resident.room === 'town' && !resident.headingHome) {
      resident.headingHome = true; resident.resting = null; resident.stop = 0;
      resident.route = findPath(scenes.town, resident, { x: 144, y: 576 });
    }
    if (resident.headingHome && !resident.route.length) {
      resident.headingHome = false; resident.home = true; resident.phase = 'street'; continue;
    }
    if (resident.hidden > 0) { resident.hidden = Math.max(0, resident.hidden - delta); continue; }
    if (resident.stop > 0) {
      resident.stop -= delta;
      if (resident.resting === 'talk') {
        const friend = residents.find(other => other !== resident && other.room === 'town' && !other.home && Math.hypot(other.x-resident.x,other.y-resident.y) < 40);
        if (friend) { resident.direction = friend.x > resident.x ? 'right' : 'left'; resident.chatting = true; }
      }
      continue;
    }
    resident.resting = null; resident.chatting = false;
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
      resident.stop = 1 + resident.index % 3;
      continue;
    }
    const target = resident.route[0], dx = target.x - resident.x, dy = target.y - resident.y;
    const distance = Math.hypot(dx, dy), step = resident.speed * delta;
    if (distance <= step) { resident.x = target.x; resident.y = target.y; resident.route.shift();
      if (!resident.route.length && !resident.headingHome && resident.phase === 'street') {
        resident.resting = resident.destination?.activity;
        if (resident.resting === 'sit' && (resident.look.chair || residents.some(other => other !== resident && other.resting === 'sit'))) resident.resting = 'pause';
        resident.stop = resident.resting ? 14 + resident.index : 3;
        if (resident.resting === 'sit') resident.direction = 'down';
      }
    }
    else { resident.x += dx / distance * step; resident.y += dy / distance * step; }
    resident.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up';
    resident.walking = true;
  }
}

export function drawResident(ctx, resident, time, reduced) {
  const { look, direction } = resident;
  const stride = resident.walking && !reduced ? Math.sin(time / 140) * 3 : 0;
  ctx.save(); ctx.translate(Math.round(resident.x), Math.round(resident.y - (resident.resting === 'sit' ? 24 : 0))); ctx.scale(look.scale || 1, look.scale || 1);
  const w = look.width, seated = look.chair || resident.seated || resident.resting === 'sit';
  box(ctx, -w / 2 - 2, 0, w + 4, 4, '#17292f55');
  box(ctx, -8, -14, 6, 14 - stride, '#324354'); box(ctx, 3, -14, 6, 14 + stride, '#324354');
  box(ctx,-8,-13,2,10-stride,'#465966');box(ctx,3,-13,2,10+stride,'#465966');
  box(ctx, -10, -2 - stride, 10, 4, '#1f2632'); box(ctx, 2, -2 + stride, 10, 4, '#1f2632');
  polygon(ctx,[[-w/2,-25],[-w/2+3,-30],[w/2-3,-30],[w/2,-25],[w/2,-11],[-w/2,-11]],look.shirt);
  ctx.save();ctx.globalAlpha=.18;
  box(ctx,w/2-4,-25,4,14,'#152b33');box(ctx,-w/2+3,-29,w-7,2,'#fff4d8');
  box(ctx,-3,-16,9,2,'#152b33');ctx.restore();
  box(ctx, -w / 2 - 3, -25 + stride, 4, 13, look.skin); box(ctx, w / 2, -25 - stride, 4, 13, look.skin);
  box(ctx,-w/2-3,-28+stride,5,8,look.shirt);box(ctx,w/2-1,-28-stride,5,8,look.shirt);
  box(ctx,-w/2-2,-13+stride,3,2,'#e4bc93');box(ctx,w/2,-13-stride,3,2,'#e4bc93');
  box(ctx,-3,-31,6,4,look.skin);
  polygon(ctx,[[-8,-41],[-5,-44],[5,-44],[8,-40],[8,-33],[4,-29],[-4,-29],[-8,-33]],look.skin);
  polygon(ctx,[[-9,-40],[-9,-44],[-5,-47],[5,-47],[9,-43],[9,-38],[6,-40],[4,-43],[-4,-42],[-6,-38]],look.hair);
  ctx.save();ctx.globalAlpha=.2;box(ctx,5,-39,3,8,'#5a3b35');box(ctx,-5,-41,5,2,'#fff0c8');ctx.restore();
  if (look.curls) for (let i = 0; i < 4; i++) box(ctx, -11 + i * 6, -48 + i % 2 * 2, 7, 9, look.hair);
  if (look.long) { box(ctx, -10, -42, 4, 20, look.hair); box(ctx, 7, -42, 4, 20, look.hair); }
  if (look.hat) { box(ctx, -10, -48, 20, 8, '#daa34d'); box(ctx, -14, -42, 28, 3, '#daa34d'); }
  if (direction === 'up') box(ctx, -8, -40, 16, 11, look.hair);
  else { box(ctx, direction === 'right' ? 5 : -5, -35, 2, 2, '#242936'); if (direction === 'down') box(ctx, 4, -35, 2, 2, '#242936'); }
  if (direction !== 'up') { box(ctx,-1,-31,4,1,'#a77561'); if(direction==='right')box(ctx,8,-36,2,3,look.skin); if(direction==='left')box(ctx,-10,-36,2,3,look.skin); }
  if (resident.chatting && !reduced) box(ctx, w / 2, -24 + Math.sin(time / 420) * 2, 7, 4, look.skin);
  if (look.cane) { box(ctx, w / 2 + 3, -16, 3, 20, '#b99c74'); box(ctx, w / 2, -17, 6, 3, '#b99c74'); }
  if (seated) box(ctx, -10, -12, 24, 7, '#38424d');
  if (look.chair) {
    for (const x of [-15, 10]) { box(ctx, x, -14, 8, 19, '#b0cbd5'); box(ctx, x + 2, -11, 4, 13, '#283546'); box(ctx, x + 3, -7, 2, 5, '#8eafc1'); }
    box(ctx, -14, -20, 29, 3, '#9cbbc8'); box(ctx, 12, -26, 3, 30, '#9cbbc8');
  }
  ctx.restore();
}

// Regulars stay at decorative machines, leaving every project cabinet available.
export const arcadeRegulars = [
  [160, 290, 0], [128, 350, 4], [594, 300, 5], [690, 290, 6],
].map(([x, y, look]) => ({ x, y, look: { ...looks[look], scale: .85 }, direction: 'up' }));

export function drawArcadeRegular(ctx, resident, time, reduced) {
  drawResident(ctx, resident, time, true);
  const tap = reduced ? 0 : Math.floor(time / 230 + resident.x) % 2 * 2;
  const { x, y, look } = resident;
  ctx.save(); ctx.translate(x, y); ctx.scale(look.scale, look.scale);
  // Bent elbows and alternating button presses face the controls.
  box(ctx, -look.width / 2 - 3, -41, 5, 18, look.shirt);
  box(ctx, look.width / 2 - 1, -41, 5, 18, look.shirt);
  box(ctx, -15, -43, 9, 4, look.skin);
  box(ctx, 6, -43 + tap, 9, 4, look.skin);
  ctx.restore();
}
