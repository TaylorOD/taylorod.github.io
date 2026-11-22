import { drawHuman, characterSizes, characterScale } from './character-art.js';
import { regularPose } from './interaction-art.js';
import { findSmoothPath as findPath, scenes } from './scenes.js';
import { box, polygon } from './art.js';

// Fictional neighbors with different ages, builds, clothing and mobility.
export const looks = [
  { skin: '#754b38', hair: '#261f2c', shirt: '#e1ad49', width: 22, curls: true },
  { skin: '#e4b08c', hair: '#d9d6c7', shirt: '#8aafbd', width: 20, cane: true },
  { skin: '#b7815b', hair: '#383043', shirt: '#d173ab', width: 25 },
  { skin: '#f0c8a1', hair: '#8c4738', shirt: '#789a71', width: 17, scale: .78 },
  { skin: '#edc4a4', hair: '#212831', shirt: '#8d87c7', width: 27, long: true },
  { skin: '#e2b38f', hair: '#25272d', shirt: '#f08168', width: 20, hat: true },
  { skin: '#d3a17d', hair: '#cbb695', shirt: '#5a9b9e', width: 23, long: true },
  { skin: '#e7bd9e', hair: '#392f2d', shirt: '#b8ba74', width: 18, scale: .85 },
];
const destinations = [{ x: 424, y: 576 }, { x: 1304, y: 576, door: 'arcade' }, { x: 1200, y: 656 }, { x: 896, y: 800 }, { x: 584, y: 656, activity: 'sit' }, { x: 640, y: 656, activity: 'talk' }, { x: 672, y: 656, activity: 'talk' }];
const indoorStops = {
  arcade: ['lilgotchi', 'snowcrust', 'relay', 'fight', 'sweat', 'moonbean', 'reachoutt'].map(id => scenes.arcade.points.find(point => point.id === id)),
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
      resident.stop = Math.max(0, resident.stop - delta);
      if (!resident.stop) resident.playing = null;
      if (resident.resting === 'talk') {
        const friend = residents.find(other => other !== resident && other.room === 'town' && !other.home && Math.hypot(other.x-resident.x,other.y-resident.y) < 40);
        if (friend) { resident.direction = friend.x > resident.x ? 'right' : 'left'; resident.chatting = true; }
      }
      continue;
    }
    resident.resting = null; resident.chatting = false; resident.playing = null;
    const scene = scenes[resident.room];
    if (!resident.route.length) {
      if (resident.phase === 'enter') {
        resident.room = resident.destination.door;
        Object.assign(resident, scenes[resident.room].spawn);
        resident.phase = 'inside'; resident.hidden = 1; resident.stop = 1;
        const games = indoorStops[resident.room];
        const occupied = new Set(['snowcrust', 'sweat', ...residents.filter(other => other !== resident && other.room === 'arcade').map(other => other.game?.id)]);
        const start = (resident.index + (resident.visits || 0)) % games.length;
        resident.game = games.slice(start).concat(games.slice(0, start)).find(game => !occupied.has(game.id));
        if (!resident.game) { resident.phase = 'leave'; continue; }
        resident.visits = (resident.visits || 0) + 1;
        resident.route = findPath(scenes[resident.room], resident, resident.game);
        continue;
      }
      if (resident.phase === 'inside') {
        resident.stop = 10 + resident.index;
        resident.playing = 'cabinet'; resident.direction = 'up';
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
        if (resident.resting === 'sit' && (residents.some(other => other !== resident && other.resting === 'sit'))) resident.resting = 'pause';
        resident.stop = resident.resting ? 14 + resident.index : 3;
        if (resident.resting === 'sit') resident.direction = 'down';
      }
    }
    else { resident.x += dx / distance * step; resident.y += dy / distance * step; }
    resident.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up';
    resident.walking = true;
  }
}

export const arcadePersonScale = characterSizes.arcade;

export function drawResident(ctx, resident, time, reduced, roomScale = characterSizes.town) {
  const seated=resident.seated || resident.resting==='sit';
  return drawHuman(ctx,{...resident,y:resident.y-(resident.resting==='sit'?10:0),
    action:resident.playing || (seated?'sit':resident.walking?'walk':resident.chatting?'talk':'idle'),
    scale:(resident.look.scale||1)*roomScale,time:reduced?0:time});
}

// Regulars and visitors never block the player or project interactions.
export const arcadeRegulars = [
  [168, 272, 0, 'pinball'], [137, 310, 4, 'pinball'], [546, 320, 5, 'poker'],
  [288, 260, 2, 'cabinet'], [432, 260, 6, 'cabinet'],
  [230, 400, 0, 'bar'],
].map(([x, y, look, playing]) => ({ x, y, look: { ...looks[look], scale: arcadePersonScale }, direction: ['poker', 'bar'].includes(playing) ? 'down' : 'up', playing }));

export function drawArcadeRegular(ctx, resident, time, reduced) {
  const pose=regularPose(resident);
  drawHuman(ctx,{...pose,look:resident.look,scale:characterScale('arcade',pose.y),time:reduced?0:time,contacts:pose.hands});
}
