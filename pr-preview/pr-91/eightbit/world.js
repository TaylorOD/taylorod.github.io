import { drawCarousel } from './carousel.js';
import { drawWildlife } from './wildlife.js';
import { scoutActors } from './scout.js';
import { bikeActors } from './bikes.js';
import { campusActors, campusScale } from './campus-life.js';
import { animateArcade } from './arcade-art.js';
import { foreground, riverTrees, treeOpacity } from './depth.js';
import { canEnter, hitTest, nearbyPath } from './navigation.js';
import { drawRiverLife } from './river.js';
import { createResidents, updateResidents, drawResident, arcadeRegulars, drawArcadeRegular } from './residents.js';
import { followTrail } from './companions.js';
import { scenes, findPath, isWalkable } from './scenes.js';
import { paintScene, ambience, person, pet, box, text, screen, tree } from './art.js';
import { projects } from './content.js';

export class World {
  constructor(canvas, { progress, onAction, onRoom, onNearby, onMove, onPosition }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.progress = progress;
    this.onAction = onAction;
    this.onRoom = onRoom;
    this.onNearby = onNearby;
    this.onMove = onMove; this.onPosition = onPosition;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.keys = new Set();
    this.direction = 'down';
    this.cache = new Map();
    this.path = [];
    this.camera = { x: 0, y: 0 };
    this.paused = false;
    this.lifeTime = 0;
    this.lastMove = 0;
    this.enter('town');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown', event => this.click(event));
    canvas.addEventListener('pointermove', event => { this.hovered = this.paused ? null : hitTest(this.scene, this.pointerPosition(event)); canvas.style.cursor = this.hovered ? 'pointer' : 'crosshair'; });
    canvas.addEventListener('pointerleave', () => { this.hovered = null; });
    canvas.addEventListener('keydown', event => this.key(event, true));
    canvas.addEventListener('keyup', event => this.key(event, false));
    canvas.addEventListener('blur', () => this.keys.clear());
    window.addEventListener('blur', () => this.keys.clear());
    document.addEventListener('visibilitychange', () => {
      this.keys.clear();
      if (document.hidden) { cancelAnimationFrame(this.frame); this.frame = null; }
      else { this.last = performance.now(); this.frame = requestAnimationFrame(time => this.tick(time)); }
    });
    this.last = performance.now();
    this.frame = requestAnimationFrame(time => this.tick(time));
  }

  enter(id, returnPoint) {
    if (!scenes[id] || !canEnter(id, this.progress)) id = 'town';
    this.enteredAt = performance.now();
    this.lastMove = this.enteredAt;
    this.stop(); this.id = id; this.scene = scenes[id];
    this.player = { ...(returnPoint || this.scene.spawn) };
    this.companion = { ...this.player, direction: 'down' };
    if (isWalkable(this.scene, this.player.x - 28, this.player.y)) this.companion.x -= 28;
    this.trail = [];
    if (id === 'town' && !this.progress.visited && !this.reduced.matches) {
      this.companion = { x: 512, y: 448, direction: 'down' };
      this.trail = findPath(this.scene, this.companion, this.player);
    }
    this.residents ||= createResidents();
    this.nearby = null; this.hovered = null; this.transition = this.reduced.matches ? 0 : 1;
    this.resize(); this.onRoom?.(id, this.scene);
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = bounds.width < 600 ? .9 : Math.max(1.35, Math.min(bounds.width / 960, bounds.height / 620));
    this.canvas.width = Math.round(bounds.width / scale);
    this.canvas.height = Math.round(bounds.height / scale);
    this.ctx.imageSmoothingEnabled = false; this.updateCamera(true);
  }

  updateCamera(snap = false, elapsed = 1 / 60) {
    const target = {
      x: Math.max(0, Math.min(this.scene.width - this.canvas.width, this.player.x - this.canvas.width / 2)),
      y: Math.max(0, Math.min(this.scene.height - this.canvas.height, this.player.y - this.canvas.height * .62)),
    };
    if (this.canvas.width > this.scene.width) target.x = (this.scene.width - this.canvas.width) / 2;
    if (this.canvas.height > this.scene.height) target.y = (this.scene.height - this.canvas.height) / 2;
    const factor = snap || this.reduced.matches ? 1 : 1 - Math.exp(-9 * elapsed);
    this.camera.x += (target.x - this.camera.x) * factor; this.camera.y += (target.y - this.camera.y) * factor;
  }

  stop() { this.keys?.clear(); this.path = []; this.destination = null; }
  pause(value) { this.paused = value; this.stop(); }

  key(event, down) {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
      event.preventDefault();
      if (down) { this.path = []; this.destination = null; this.keys.add(key); } else this.keys.delete(key);
    }
    if (down && !event.repeat && ['e', 'enter', ' '].includes(key)) { event.preventDefault(); this.interact(); }
  }

  walk(direction, down) {
    this.path = []; this.destination = null;
    if (!down) { this.keys.delete(direction); return; }
    if (this.paused) return;
    // A short tap takes a small step too, even between animation frames.
    const offsets = { arrowup: [0, -8], arrowdown: [0, 8], arrowleft: [-8, 0], arrowright: [8, 0] };
    const [dx, dy] = offsets[direction] || [0, 0];
    if (!this.keys.has(direction) && isWalkable(this.scene, this.player.x + dx, this.player.y + dy)) {
      this.player.x += dx; this.player.y += dy;
    }
    this.keys.add(direction);
  }

  pointerPosition(event) {
    const bounds = this.canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) / bounds.width * this.canvas.width + this.camera.x, y: (event.clientY - bounds.top) / bounds.height * this.canvas.height + this.camera.y };
  }

  click(event) {
    if (this.paused || event.button !== 0) return;
    this.canvas.focus({ preventScroll: true });
    const point = this.pointerPosition(event);
    const hit = hitTest(this.scene, point);
    this.canvas.dataset.destination = hit?.id || 'ground';
    if (hit) this.goTo(hit.id);
    else { this.destination = null; this.path = nearbyPath(this.scene, this.player, point); this.target = this.path.at(-1); }
  }

  goTo(id) {
    const point = this.scene.points.find(item => item.id === id);
    if (!point) return;
    this.keys.clear();
    if (Math.hypot(point.x - this.player.x, point.y - this.player.y) < 22) { this.onAction(point.action); return; }
    this.path = findPath(this.scene, this.player, point); this.destination = this.path.length ? point : null; this.target = this.path.at(-1);
  }

  interact() { if (!this.paused && this.nearby) this.onAction(this.nearby.action); }

  // UI panels grow from the object the visitor actually approached.
  interactionOrigin() {
    const point = this.nearby;
    if (!point) return null;
    const bounds = this.canvas.getBoundingClientRect();
    return { x: bounds.left + (point.x - this.camera.x) / this.canvas.width * bounds.width,
      y: bounds.top + ((point.hit ? point.hit[1] + point.hit[3] / 2 : point.y) - this.camera.y) / this.canvas.height * bounds.height };
  }

  tick(time) {
    const elapsed = Math.min((time - this.last) / 1000, .25); this.last = time; this.walking = false;
    if (!this.paused && !this.reduced.matches) this.lifeTime += elapsed * 1000;
    // Substeps preserve real movement speed on slower devices without tunneling through walls.
    const steps = Math.max(1, Math.ceil(elapsed * 60)), delta = elapsed / steps;
    for (let step = 0; step < steps; step++) {
    if (!this.paused) {
      let dx = Number(this.keys.has('arrowright') || this.keys.has('d')) - Number(this.keys.has('arrowleft') || this.keys.has('a'));
      let dy = Number(this.keys.has('arrowdown') || this.keys.has('s')) - Number(this.keys.has('arrowup') || this.keys.has('w'));
      if (this.path.length) {
        const next = this.path[0], distance = Math.hypot(next.x - this.player.x, next.y - this.player.y);
        if (distance < 3) {
          this.player = { ...next }; this.path.shift();
          if (!this.path.length && this.destination) { const action = this.destination.action; this.destination = null; this.onAction(action); }
        } else { dx = (next.x - this.player.x) / distance; dy = (next.y - this.player.y) / distance; }
      }
      const length = Math.hypot(dx, dy);
      if (length) {
        const speed = 126 * delta, nx = this.player.x + dx / length * speed, ny = this.player.y + dy / length * speed;
        const before = { ...this.player };
        if (isWalkable(this.scene, nx, this.player.y)) this.player.x = nx;
        if (isWalkable(this.scene, this.player.x, ny)) this.player.y = ny;
        this.walking = Math.hypot(before.x - this.player.x, before.y - this.player.y) > .01;
        this.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up';
        if (this.walking) { this.lastMove = time; this.onMove?.(time, this.id); }
      }
      followTrail(this.companion, this.trail, this.player, delta);
      if (!this.reduced.matches) updateResidents(this.residents, this.scene, delta, this.player, this.id);
    }
    }
    const nearest = this.scene.points.filter(point => Math.hypot(point.x - this.player.x, point.y - this.player.y) < 53).sort((a, b) => Math.hypot(a.x - this.player.x, a.y - this.player.y) - Math.hypot(b.x - this.player.x, b.y - this.player.y))[0];
    if (nearest?.id !== this.nearby?.id) { this.nearby = nearest; this.onNearby?.(nearest); }
    this.updateCamera(false, elapsed); this.onPosition?.(this.id, this.player); this.transition = Math.max(0, this.transition - elapsed * 3); this.draw(time);
    this.canvas.dataset.position = `${Math.round(this.player.x)},${Math.round(this.player.y)}`;
    this.canvas.dataset.room = this.id;
    if (!document.hidden) this.frame = requestAnimationFrame(next => this.tick(next));
  }

  draw(time) {
    const ctx = this.ctx;
    if (!this.cache.has(this.id)) {
      const background = document.createElement('canvas'); background.width = this.scene.width; background.height = this.scene.height;
      paintScene(background.getContext('2d'), this.id, projects); this.cache.set(this.id, background);
    }
    box(ctx, 0, 0, this.canvas.width, this.canvas.height, '#182b32');
    ctx.save(); ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y)); ctx.drawImage(this.cache.get(this.id), 0, 0);
    ambience(ctx, this.id, time, this.reduced.matches || this.paused);
    if (this.id === 'town') {
      drawWildlife(ctx, this.lifeTime, this.reduced.matches);
      drawRiverLife(ctx, time, this.reduced.matches || this.paused);
      box(ctx, 688, 421, 9, 6, this.progress.pizza === 'delivered' ? '#a5b78c' : '#88775a');
    }
    if (this.id === 'arcade') animateArcade(ctx, time, this.reduced.matches || this.paused, this.nearby?.id);
    if (this.target && this.path.length) { const { x, y } = this.target; box(ctx, x - 7, y - 1, 14, 2, '#e7cf9a'); box(ctx, x - 1, y - 7, 2, 14, '#e7cf9a'); }
    const greeting = time - this.enteredAt < 2200;
    const curious = !this.walking && ['pizza', 'snowcrust', 'lilgotchi', 'relay'].includes(this.nearby?.id);
    const perspective = actor => this.id === 'town' ? campusScale(actor.x, actor.y) : 1;
    const companion = () => {
      const hop = greeting && !this.reduced.matches ? Math.max(0, Math.sin((time - this.enteredAt) / 150)) * 5 : 0;
      const direction = curious ? this.nearby.x > this.companion.x ? 'right' : 'left' : this.companion.direction;
      pet(ctx, this.companion.x, this.companion.y - hop, this.progress.pet, this.reduced.matches ? 0 : time, !greeting && !curious && time - this.lastMove > 12000, perspective(this.companion), direction, greeting);
      if (greeting || curious) text(ctx, greeting ? '♥' : this.nearby.id === 'snowcrust' || this.nearby.id === 'pizza' ? 'PIZZA?' : '?', this.companion.x, this.companion.y - 44, 8, '#edc389');
    };
    const actors = [
      ...(this.id === 'town' ? [{ y: 748, draw: () => drawCarousel(ctx, this.lifeTime, this.reduced.matches) }] : []),
      ...scoutActors(ctx, this.id, this.lifeTime, this.reduced.matches),
      ...(this.id === 'town' ? bikeActors(ctx, this.lifeTime, this.reduced.matches) : []),
      ...(this.id === 'town' ? campusActors(ctx, this.lifeTime, this.reduced.matches) : []),
      ...(this.id === 'arcade' ? arcadeRegulars.map(resident => ({ y: resident.y, draw: () => drawArcadeRegular(ctx, resident, time, this.reduced.matches || this.paused) })) : []),
      { y: this.companion.y, draw: companion },
      { y: this.player.y, draw: () => person(ctx, this.player.x, this.player.y, this.direction, this.walking && !this.reduced.matches, time, this.progress.pizza === 'carrying', perspective(this.player)) },
      ...this.residents.filter(resident => resident.room === this.id && !resident.hidden).map(resident => ({ y: resident.y + (resident.seated ? 16 : 0), draw: () => drawResident(ctx, resident, time, this.reduced.matches) })),
    ];
    for (const [x, y, w, h, depth] of foreground[this.id] || []) if ([this.player, this.companion, ...this.residents.filter(r => r.room === this.id && !r.seated)].some(actor => actor.x > x - 14 && actor.x < x + w + 14 && actor.y < depth && actor.y > y)) actors.push({ y: depth, draw: () => ctx.drawImage(this.cache.get(this.id), x, y, w, h, x, y, w, h) });
    if (this.id === 'town') {
      const visibleActors = [this.player, this.companion, ...this.residents.filter(resident => resident.room === 'town' && !resident.hidden)];
      for (const item of riverTrees) actors.push({ y: item[1], draw: () => {
        ctx.save(); ctx.globalAlpha = treeOpacity(item, visibleActors); tree(ctx, ...item); ctx.restore();
      } });
    }
    actors.sort((a, b) => a.y - b.y).forEach(actor => actor.draw());
    if (this.id === 'town' && this.progress.pizza === 'delivered') {
      box(ctx, 245, 512, 24, 5, '#e9ba79'); box(ctx, 245, 517, 24, 2, '#a55c3e');
      text(ctx, 'THANKS!', 256, 478, 7, '#f1d8a7');
    }
    for (const point of this.scene.points) {
      const near = point.id === this.nearby?.id;
      if (point.id !== 'arcade' && (near || point.id === this.hovered?.id)) {
        const y = point.hit ? point.hit[1] - 13 : point.y - 95;
        box(ctx, point.x - 10, y - 9, 20, 18, near ? '#edc389' : '#b1cead'); text(ctx, near ? 'E' : '↓', point.x, y, 11, '#293f41');
        if (near || this.hovered?.id === point.id) { const w = point.label.length * 6 + 16; box(ctx, point.x - w / 2, y - 30, w, 18, '#152c34'); text(ctx, point.label, point.x, y - 21, 10, '#f4dfb3'); }
      }
    }
    ctx.restore();
    if (this.transition) { ctx.fillStyle = `rgba(18, 34, 40, ${this.transition})`; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); }
  }

  postcard(pose = 'hello') {
    const image = document.createElement('canvas'); image.width = 960; image.height = 640;
    const ctx = image.getContext('2d'); paintScene(ctx, 'rooftop', projects);
    box(ctx, 768, 0, 192, 640, '#f0dfba'); box(ctx, 0, 594, 768, 46, '#f0dfba');
    person(ctx, 364, 440, pose === 'view' ? 'up' : 'down', pose === 'dance', 120, pose === 'pizza'); pet(ctx, 410, 440, this.progress.pet, 0, false, 1.4, pose === 'view' ? 'up' : 'down', true);
    box(ctx, 150, 544, 468, 40, '#3e6057');
    text(ctx, pose === 'pizza' ? 'PIZZA BREAK' : pose === 'view' ? 'MOUNTAIN TIME' : 'HELLO FROM MISSOULA', 384, 565, 13, '#e5d7b0');
    text(ctx, 'SIDE QUEST', 864, 91, 23, '#3d5c56'); text(ctx, 'ARCADE', 864, 123, 23, '#3d5c56');
    text(ctx, 'a little visit', 864, 212, 13, '#5c7262'); text(ctx, 'to missoula.', 864, 233, 13, '#5c7262');
    text(ctx, 'taylor dorsett', 864, 508, 13, '#5c7262'); text(ctx, 'taylordorsett.com', 864, 531, 11, '#5c7262');
    text(ctx, 'THANKS FOR STOPPING BY ♥', 384, 618, 16, '#3d5c56'); return image;
  }
}
