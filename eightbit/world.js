// Small, original pixel drawings. No sprite downloads or game engine required.
export function createWorld(canvas, surface, onExplore) {
  const ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 650px)');
  const stops = { about: .19, work: .42, projects: .66, contact: .87 };
  const names = { about: 'the cabin', work: 'the workshop', projects: 'the arcade', contact: 'the mailbox' };
  let position = .19;
  let target = position;
  let direction = 0;
  let facing = 1;
  let frame;
  let previousTime = 0;
  let active = true;
  let lastMessage = '';

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  function pixelMountain(x, base, height, color) {
    for (let y = 0; y < height; y += 4) {
      const half = Math.floor(y * .9 / 4) * 4;
      rect(x - half, base - height + y, half * 2 + 8, 4, color);
      if (y < height * .27) rect(x - half, base - height + y, half * 2 + 8, 4, '#dce5cd');
    }
  }
  function tree(x, y, size = 1) {
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(size, size);
    rect(-2, -26, 5, 29, '#59684c');
    for (let layer = 0; layer < 3; layer++) {
      const top = -53 + layer * 12;
      for (let row = 0; row < 5; row++) {
        rect(-row * 3 - 3, top + row * 4, row * 6 + 6, 4, layer % 2 ? '#3a6851' : '#2a5949');
        rect(-row * 3 - 3, top + row * 4, row * 3 + 3, 4, '#46775a');
      }
    }
    ctx.restore();
  }
  function cabin(x) {
    ctx.save(); ctx.translate(Math.round(x - 33), 134);
    rect(0, 7, 68, 48, '#644c37');
    rect(4, 7, 60, 44, '#b58e59');
    for (let y = 14; y < 50; y += 8) rect(4, y, 60, 2, '#876c47');
    rect(47, -24, 9, 20, '#6b7059');
    for (let i = 0; i < 8; i++) rect(-7 + i * 5, 6 - i * 4, 82 - i * 10, 4, i % 2 ? '#b6583a' : '#c66d43');
    rect(26, 26, 17, 29, '#3d5141'); rect(38, 39, 2, 3, '#efd782');
    for (const wx of [9, 48]) { rect(wx, 19, 13, 15, '#4b654d'); rect(wx + 2, 21, 9, 11, '#efd782'); rect(wx + 6, 21, 1, 11, '#987749'); rect(wx + 2, 26, 9, 1, '#987749'); }
    rect(-5, 55, 77, 4, '#596344'); rect(22, 55, 26, 5, '#d9ca99');
    ctx.restore();
  }
  function workshop(x) {
    ctx.save(); ctx.translate(Math.round(x - 28), 147);
    rect(-3, -10, 62, 6, '#2d5149'); rect(0, -4, 56, 43, '#477563');
    rect(4, 0, 48, 34, '#709a78');
    for (let j = 0; j < 5; j++) rect(5 + j * 10, 0, 2, 34, '#527e65');
    rect(7, 9, 23, 18, '#273e3b'); rect(9, 11, 19, 13, '#a7ccb0');
    rect(12, 14, 5, 2, '#416d5d'); rect(15, 17, 8, 2, '#416d5d');
    rect(35, 10, 15, 29, '#355b4e'); rect(37, 12, 11, 9, '#d7cd8e');
    rect(-5, 39, 66, 4, '#596344'); rect(32, 39, 22, 5, '#d9ca99');
    ctx.restore();
  }
  function arcade(x) {
    ctx.save(); ctx.translate(Math.round(x - 34), 133);
    rect(-3, -12, 74, 8, '#584849'); rect(0, -4, 68, 59, '#ac6c5e');
    rect(4, 0, 60, 51, '#c48b69');
    rect(3, -17, 62, 16, '#f0da8e'); rect(6, -14, 56, 10, '#344e42');
    ctx.fillStyle = '#efd782'; ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.fillText('ARCADE', 34, -6);
    rect(-4, 12, 76, 7, '#f1d891');
    for (let i = 0; i < 7; i++) rect(-4 + i * 12, 12, 6, 7, '#b5593f');
    rect(25, 23, 19, 32, '#374e47'); rect(28, 26, 13, 16, '#7ca28c'); rect(38, 44, 2, 3, '#efd782');
    for (const wx of [7, 48]) { rect(wx, 25, 13, 21, '#425950'); rect(wx + 2, 27, 9, 11, '#97af7c'); rect(wx + 3, 40, 7, 2, '#ddaf66'); }
    rect(-5, 55, 78, 4, '#596344'); rect(22, 55, 25, 5, '#d9ca99');
    ctx.restore();
  }
  function mailbox(x) {
    rect(x - 2, 168, 4, 24, '#665e46'); rect(x - 12, 154, 25, 17, '#476d60');
    rect(x - 9, 150, 19, 4, '#5d8371'); rect(x - 9, 157, 19, 10, '#719783');
    rect(x - 7, 158, 15, 2, '#385b50'); rect(x + 12, 146, 2, 18, '#5d563f'); rect(x + 14, 146, 8, 6, '#ca6746');
  }
  function player(x, walking, time) {
    const step = walking && !reducedMotion.matches ? Math.floor(time / 140) % 2 : 0;
    ctx.save(); ctx.translate(Math.round(x), 197);
    rect(-7, 0, 15, 3, '#8c9465');
    rect(-4, -22, 9, 8, '#d9a477'); rect(-5, -26, 10, 5, '#574b3c'); rect(-5, -23, 3, 4, '#574b3c');
    rect(facing > 0 ? 2 : -3, -21, 2, 2, '#2e4438');
    rect(-5, -14, 11, 9, '#bf6256'); rect(-5, -12, 5, 3, '#dda05e'); rect(0, -10, 6, 3, '#7f9f94'); rect(-3, -8, 5, 3, '#c4bc79');
    rect(-7, -12, 2, 7, '#d9a477'); rect(6, -12, 2, 7, '#d9a477');
    rect(-4, -5, 4, 5 + step, '#3c5260'); rect(2, -5, 4, 6 - step, '#3c5260');
    rect(-5 - step, 0, 5, 2, '#354339'); rect(2 + step, 0, 5, 2, '#354339');
    ctx.restore();
  }
  function draw(time) {
    const w = canvas.width;
    rect(0, 0, w, 240, '#bad3c8');
    rect(0, 0, w, 38, '#b0ccbf');
    rect(w * .81, 21, 23, 23, '#f1dfa0'); rect(w * .81 - 3, 25, 29, 15, '#f1dfa0');
    for (const [x, y] of [[.1, 29], [.38, 16], [.69, 42]]) {
      rect(w * x, y, 32, 4, '#dde6cf'); rect(w * x + 8, y - 4, 18, 4, '#dde6cf');
    }
    for (const [x, h] of [[0, 76], [.16, 96], [.36, 112], [.59, 87], [.83, 105], [1, 68]]) pixelMountain(w * x, 153, h, '#8ca99a');
    for (const [x, h] of [[.02, 55], [.26, 70], [.52, 59], [.76, 74], [.99, 65]]) pixelMountain(w * x, 165, h, '#698d7b');
    rect(0, 153, w, 87, '#a6b37b');
    rect(0, 167, w, 4, '#b6bd81');
    // River behind the town, with stepped banks instead of antialiased curves.
    for (let y = 157; y < 178; y += 3) rect(0, y, w, 3, y % 2 ? '#8cbdb2' : '#7ca99e');
    rect(0, 178, w, 62, '#9ead72');
    for (const [x, y, s] of [[.02, 162, 1.3], [.08, 170, 1], [.3, 174, .7], [.53, 164, 1.1], [.96, 177, 1.3], [1, 158, 1]]) tree(w * x, y, s);
    rect(0, 192, w, 17, '#dfcb95'); rect(0, 209, w, 3, '#bdaf78');
    for (let x = 6; x < w; x += 23) rect(x, 197 + x % 6, 3, 1, '#c0aa73');
    const scale = smallScreen.matches ? .65 : 1;
    for (const [place, paint] of [['about', cabin], ['work', workshop], ['projects', arcade], ['contact', mailbox]]) {
      const x = w * stops[place];
      ctx.save(); ctx.translate(x, 192); ctx.scale(scale, scale); ctx.translate(-x, -192); paint(x); ctx.restore();
    }
    for (let i = 0; i < w; i += 19) {
      const y = 219 + (i * 7) % 15;
      rect(i, y, 2, 4, '#738c5a'); rect(i - 2, y + 2, 6, 1, '#738c5a');
      if (i % 3 === 0) { rect(i - 1, y - 2, 4, 3, i % 2 ? '#efd782' : '#e8d4b1'); }
    }
    player(w * position, direction !== 0 || Math.abs(target - position) > .003, time);
    tree(10, 244, 1); tree(w - 6, 249, 1.2);
  }
  function nearest() {
    return Object.keys(stops).reduce((best, place) => Math.abs(stops[place] - position) < Math.abs(stops[best] - position) ? place : best, 'about');
  }
  function tick(time) {
    if (!active) return;
    const elapsed = Math.min((time - previousTime) / 1000 || 0, .05);
    previousTime = time;
    const delta = target - position;
    if (direction) {
      position = Math.max(.04, Math.min(.96, position + direction * elapsed * .18));
      target = position; facing = direction;
    } else if (Math.abs(delta) > .002) {
      facing = Math.sign(delta);
      position += Math.sign(delta) * Math.min(Math.abs(delta), elapsed * .24);
    }
    draw(time);
    const place = nearest();
    const message = Math.abs(position - stops[place]) < .07 ? `enter to explore ${names[place]}` : 'a little walk around town.';
    if (message !== lastMessage) { document.querySelector('.walk-message').textContent = message; lastMessage = message; }
    if (direction || Math.abs(target - position) > .002) frame = requestAnimationFrame(tick);
    else frame = null;
  }
  function wake() { if (!frame && active) { previousTime = performance.now(); frame = requestAnimationFrame(tick); } }
  function walk(value) { direction = value; wake(); }
  function explore() { onExplore(nearest()); }
  surface.addEventListener('keydown', event => {
    if (event.target !== surface) return;
    const key = event.key.toLowerCase();
    if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) { event.preventDefault(); walk(key === 'arrowleft' || key === 'a' ? -1 : 1); }
    if (key === 'enter' || key === ' ') { event.preventDefault(); explore(); }
  });
  surface.addEventListener('keyup', event => { if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(event.key)) walk(0); });
  surface.addEventListener('blur', () => walk(0));
  window.addEventListener('blur', () => walk(0));
  document.addEventListener('visibilitychange', () => {
    active = !document.hidden; direction = 0;
    if (!active) { cancelAnimationFrame(frame); frame = null; } else wake();
  });
  function resize() { canvas.width = smallScreen.matches ? 320 : 640; wake(); }
  smallScreen.addEventListener('change', resize);
  resize();
  return { walk, explore, goTo(place) { target = stops[place]; if (reducedMotion.matches) position = target; wake(); } };
}
