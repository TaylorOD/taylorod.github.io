import { followTrail } from './companions.js';
import { scenes, findPath, isWalkable } from './scenes.js';
import { paintScene, ambience, person, pet, box, text, screen } from './art.js';
import { projects } from './content.js';

export class World {
  constructor(canvas, { progress, onAction, onRoom, onNearby, onMove }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.progress = progress;
    this.onAction = onAction;
    this.onRoom = onRoom;
    this.onNearby = onNearby;
    this.onMove = onMove;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.keys = new Set();
    this.direction = 'down';
    this.cache = new Map();
    this.path = [];
    this.camera = { x: 0, y: 0 };
    this.paused = false;
    this.lastMove = 0;
    this.enter('town');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown', event => this.click(event));
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
    if (!scenes[id]) id = 'town';
    this.stop(); this.id = id; this.scene = scenes[id];
    this.player = { ...(returnPoint || this.scene.spawn) };
    this.companion = { ...this.player, direction: 'down' };
    this.trail = [];
    this.nearby = null; this.transition = this.reduced.matches ? 0 : 1;
    this.resize(); this.onRoom?.(id, this.scene);
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = bounds.width < 600 ? 1.1 : Math.max(1.35, Math.min(bounds.width / 960, bounds.height / 620));
    this.canvas.width = Math.round(bounds.width / scale);
    this.canvas.height = Math.round(bounds.height / scale);
    this.ctx.imageSmoothingEnabled = false; this.updateCamera(true);
  }

  updateCamera(snap = false) {
    const target = {
      x: Math.max(0, Math.min(this.scene.width - this.canvas.width, this.player.x - this.canvas.width / 2)),
      y: Math.max(0, Math.min(this.scene.height - this.canvas.height, this.player.y - this.canvas.height * .62)),
    };
    if (this.canvas.width > this.scene.width) target.x = (this.scene.width - this.canvas.width) / 2;
    if (this.canvas.height > this.scene.height) target.y = (this.scene.height - this.canvas.height) / 2;
    const factor = snap || this.reduced.matches ? 1 : .12;
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

  click(event) {
    if (this.paused || event.button !== 0) return;
    this.canvas.focus({ preventScroll: true });
    const bounds = this.canvas.getBoundingClientRect();
    const point = { x: (event.clientX - bounds.left) / bounds.width * this.canvas.width + this.camera.x, y: (event.clientY - bounds.top) / bounds.height * this.canvas.height + this.camera.y };
    // Hit areas include the face of an object, not only the spot on the floor.
    const hit = this.scene.points.find(item => Math.abs(item.x - point.x) < (this.id === 'town' ? 55 : 38) && point.y > item.y - (this.id === 'town' ? 210 : 145) && point.y < item.y + 15);
    this.canvas.dataset.destination = hit?.id || 'ground';
    if (hit) this.goTo(hit.id);
    else { this.destination = null; this.path = findPath(this.scene, this.player, point); this.target = this.path.at(-1); }
  }

  goTo(id) {
    const point = this.scene.points.find(item => item.id === id);
    if (!point) return;
    this.keys.clear();
    if (Math.hypot(point.x - this.player.x, point.y - this.player.y) < 22) { this.onAction(point.action); return; }
    this.path = findPath(this.scene, this.player, point); this.destination = this.path.length ? point : null; this.target = this.path.at(-1);
  }

  interact() { if (!this.paused && this.nearby) this.onAction(this.nearby.action); }

  tick(time) {
    const elapsed = Math.min((time - this.last) / 1000, .25); this.last = time; this.walking = false;
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
    }
    }
    const nearest = this.scene.points.filter(point => Math.hypot(point.x - this.player.x, point.y - this.player.y) < 53).sort((a, b) => Math.hypot(a.x - this.player.x, a.y - this.player.y) - Math.hypot(b.x - this.player.x, b.y - this.player.y))[0];
    if (nearest?.id !== this.nearby?.id) { this.nearby = nearest; this.onNearby?.(nearest); }
    this.updateCamera(); this.transition = Math.max(0, this.transition - elapsed * 3); this.draw(time);
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
    if (this.id === 'arcade') {
      for (let i = 0; i < 4; i++) screen(ctx, projects[i].screen, 170 + i * 144, 261, 43, 33, this.reduced.matches ? 0 : time, this.nearby?.id === projects[i].id);
      if (this.progress.stamps.length === projects.length) text(ctx, 'PHOTO BOOTH UNLOCKED', 689, 516, 7, '#e9cb91');
    }
    if (this.target && this.path.length) { const { x, y } = this.target; box(ctx, x - 7, y - 1, 14, 2, '#e7cf9a'); box(ctx, x - 1, y - 7, 2, 14, '#e7cf9a'); }
    const companion = () => pet(ctx, this.companion.x, this.companion.y, this.progress.pet, this.reduced.matches ? 0 : time, this.paused || time - this.lastMove > 12000, 1, this.companion.direction, !!this.nearby);
    if (this.companion.y < this.player.y) companion();
    person(ctx, this.player.x, this.player.y, this.direction, this.walking && !this.reduced.matches, time, this.progress.pizza === 'carrying');
    if (this.companion.y >= this.player.y) companion();
    for (const point of this.scene.points) {
      const near = point.id === this.nearby?.id;
      if (near || this.id === 'town' && point.id === 'arcade') {
        const y = point.y - (this.id === 'town' ? 110 : 128);
        box(ctx, point.x - 10, y - 9, 20, 18, near ? '#edc389' : '#b1cead'); text(ctx, near ? 'E' : '↓', point.x, y, 11, '#293f41');
      }
    }
    ctx.restore();
    if (this.transition) { ctx.fillStyle = `rgba(18, 34, 40, ${this.transition})`; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); }
  }

  postcard() {
    const image = document.createElement('canvas'); image.width = 960; image.height = 640;
    const ctx = image.getContext('2d'); paintScene(ctx, 'rooftop', projects);
    box(ctx, 768, 0, 192, 640, '#f0dfba'); box(ctx, 0, 594, 768, 46, '#f0dfba');
    person(ctx, 364, 440, 'down', false, 0); pet(ctx, 410, 440, this.progress.pet, 0, false, 1.4);
    text(ctx, 'SIDE QUEST', 864, 91, 23, '#3d5c56'); text(ctx, 'ARCADE', 864, 123, 23, '#3d5c56');
    text(ctx, 'a little visit', 864, 212, 13, '#5c7262'); text(ctx, 'to missoula.', 864, 233, 13, '#5c7262');
    text(ctx, 'taylor dorsett', 864, 508, 13, '#5c7262'); text(ctx, 'taylordorsett.com', 864, 531, 11, '#5c7262');
    text(ctx, 'THANKS FOR STOPPING BY ♥', 384, 618, 16, '#3d5c56'); return image;
  }
}
