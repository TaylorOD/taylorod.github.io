import { createDemo, advanceDemo, renderDemo } from './demos.js';
import { canEnter, mapPosition } from './navigation.js';
import { World } from './world.js';
import { projects, pets, jobs, careerStories, loadProgress, saveProgress } from './content.js';
import { scenes } from './scenes.js';
import { pet, screen } from './art.js';
import { Sound } from './sound.js';

const progress = loadProgress();
const sound = new Sound();
const normalURL = new URL(location.href);
normalURL.searchParams.delete('mode'); normalURL.hash = '';
const root = document.createElement('div'); root.id = 'eightbit';
root.innerHTML = `
  <a class="skip-link" href="#directory">skip to the projects</a>
  <header class="game-header"><a class="brand" href="?mode=8bit" aria-label="Last light arcade home"><span class="brand-icon">✦</span><span>LAST LIGHT<small>TAYLOR DORSETT'S LITTLE CORNER OF THE INTERNET</small></span></a><nav aria-label="Quick navigation"><button data-ui="directory">projects <span>08</span></button><button data-ui="map">map <kbd>M</kbd></button><button data-ui="about">about</button><button data-ui="contact">contact</button><button data-ui="sound" aria-pressed="false">sound off</button><a class="normal-site">normal site ↗</a></nav></header>
  <main class="game-stage" aria-label="Last light arcade">
    <canvas class="world-canvas" tabindex="0" aria-label="Explore the town. Arrow keys or WASD to walk. E or Enter to interact. Click a place to walk there, or use the map and projects menu."></canvas>
    <div class="scene-shade" aria-hidden="true"></div>
    <div class="place-label"><span class="place-dot"></span><div><h1 class="place-name">main street</h1><p class="place-subtitle">missoula, montana · just before sunset</p></div></div>
    <div class="inventory-bar"><button data-ui="pets" class="companion-button" aria-label="Choose a pet companion"><canvas width="30" height="32" aria-hidden="true"></canvas><span class="pet-name">slice</span></button><button data-ui="passport" class="stamp-count">0 / 8 stamps</button></div>
    <section class="welcome"><p class="eyebrow">HEY, I'M TAYLOR.</p><h2>a few good<br>side quests.</h2><p>software engineer. recovering recruiter.<br>this is where my projects live.</p><button class="primary" data-ui="enter">come into the arcade <span>↗</span></button><button class="quiet" data-ui="dismiss">i'll take a look around</button><small>click to walk · arrow keys work too</small></section>
    <div class="room-toast" role="status"></div>
    <div class="quest-note" hidden><span>◈</span> pizza delivery <small>take it to the town bench</small></div>
    <button class="interact" disabled><kbd>E</kbd><span>walk up to something</span><b>↗</b></button>
    <div class="dpad" aria-label="Movement controls"><button data-direction="arrowup" aria-label="Walk up">↑</button><button data-direction="arrowleft" aria-label="Walk left">←</button><button data-direction="arrowdown" aria-label="Walk down">↓</button><button data-direction="arrowright" aria-label="Walk right">→</button></div>
    <button class="mini-map" data-ui="map" aria-label="Open the town map"><svg viewBox="0 0 140 96" aria-hidden="true"><rect width="140" height="96" fill="#42645b"/><path d="M0 54H140M82 54V75" stroke="#b9aa84" stroke-width="10"/><path d="M0 69H140" stroke="#76a3a1" stroke-width="7"/><rect x="48" y="29" width="82" height="23" fill="#c99b79"/><rect x="123" y="12" width="12" height="12" fill="#b9bb8b"/><circle class="map-player" cx="70" cy="60" r="4" fill="#f4d094"/></svg><span>TOWN MAP <kbd>M</kbd></span></button>
  </main>
  <footer class="game-footer"><span class="footer-location">a little visit to missoula.</span><span class="desktop-help"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move <i>·</i> <kbd>E</kbd> explore <i>·</i> click anywhere to walk</span><button data-ui="help">how to play <span>?</span></button></footer>
  <dialog class="game-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span class="dialog-tag"></span><button class="close-dialog" aria-label="Close dialog">✕</button></div><div class="dialog-content"></div></dialog>`;
root.querySelector('.normal-site').href = normalURL.href;
document.body.replaceChildren(root); document.documentElement.classList.add('eightbit-mode');
document.title = 'Last light arcade | Taylor Dorsett';
const canvas = root.querySelector('.world-canvas'), dialog = root.querySelector('dialog');
let postcardPose = 'hello';
let activeDemo;
let world, previewFrame, toastTimer, previousFocus, routeDialog = false;
let closingAnimation;

function toast(message) {
  const element = root.querySelector('.room-toast'); element.textContent = message; element.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
}

function updateInventory() {
  root.querySelector('.stamp-count').textContent = `${progress.stamps.length} / 8 stamps`;
  root.querySelector('.pet-name').textContent = progress.pet;
  const icon = root.querySelector('.companion-button canvas'), ctx = icon.getContext('2d'); ctx.clearRect(0, 0, icon.width, icon.height); pet(ctx, 14, 29, progress.pet);
  root.querySelector('.quest-note').hidden = progress.pizza !== 'carrying'; saveProgress(progress);
}

function setRoute(value, replace = false) {
  const url = new URL(location.href); url.hash = value;
  if (url.href !== location.href) history[replace ? 'replaceState' : 'pushState'](null, '', url);
}

function dismissWelcome() { root.querySelector('.welcome').hidden = true; progress.visited = true; saveProgress(progress); }

function changeRoom(id, history = true) {
  if (!canEnter(id, progress)) { setRoute(world.id, true); handleAction('roof'); return; }
  dismissWelcome();
  const previous = world.id;
  const doors = { arcade: { x: 1304, y: 576 }, cabin: { x: 1416, y: 264 }, rooftop: { x: 1424, y: 576 } };
  world.enter(id, id === 'town' ? doors[previous] : undefined);
  if (history) setRoute(id);
  sound.chime();
}

function openDialog(tag, title, html, route = false) {
  closingAnimation?.cancel(); closingAnimation = null;
  cancelAnimationFrame(previewFrame);
  if (!dialog.open) previousFocus = document.activeElement;
  if (routeDialog && !route) setRoute(world.id, true);
  world.pause(true); routeDialog = route;
  root.querySelector('.dialog-tag').textContent = tag;
  root.querySelector('.dialog-content').innerHTML = `<h2 id="dialog-title">${title}</h2>${html}`;
  if (!dialog.open) dialog.showModal();
  const origin = world.interactionOrigin();
  const bounds = dialog.getBoundingClientRect();
  dialog.style.transformOrigin = origin ? `${origin.x - bounds.left}px ${origin.y - bounds.top}px` : '50% 50%';
  dialog.scrollTop = 0;
  root.querySelector('.close-dialog').focus();
}

function closeDialog(updateRoute = true) {
  cancelAnimationFrame(previewFrame);
  if (routeDialog && updateRoute) setRoute(world.id, true);
  routeDialog = false;
  const target = previousFocus?.isConnected ? previousFocus : canvas;
  const finish = () => { dialog.close(); world.pause(false); target.focus({ preventScroll: true }); };
  if (world.reduced.matches || !dialog.open) { finish(); return; }
  closingAnimation?.cancel();
  closingAnimation = dialog.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.45)' }], { duration: 130, easing: 'ease-in' });
  closingAnimation.finished.then(finish).catch(() => {});
}

function openProject(id, history = true) {
  const project = projects.find(item => item.id === id); if (!project) return;
  if (!progress.stamps.includes(id)) { progress.stamps.push(id); updateInventory(); sound.chime(); }
  const special = id === 'lilgotchi' ? '<button class="secondary" data-ui="pets">choose a companion</button>' : id === 'snowcrust' ? '<button class="secondary" data-ui="pizza">take a delivery</button>' : '';
  openDialog(`CARTRIDGE ${String(projects.indexOf(project) + 1).padStart(2, '0')} / ${project.category.toUpperCase()}`, project.name, `
    <div class="project-layout"><div class="project-visual" style="--project-color:${project.color}"><img class="project-screenshot" src="eightbit/previews/${project.id}.jpg" alt="${project.name} running in the browser" loading="lazy"/><span class="screen-caption">${project.category}</span></div><div class="project-copy"><p class="project-description">${project.description}</p><p>${project.detail}</p><div class="tech-label">BUILT WITH</div><p class="tech">${project.stack}</p><div class="dialog-actions"><a class="primary" href="${project.url}">${project.action} ↗</a><a class="secondary" href="https://github.com/TaylorOD/${project.repo}">see the code ↗</a>${special}</div></div></div>${['lilgotchi', 'snowcrust', 'relay'].includes(id) ? '<section class="project-demo" aria-live="polite"></section>' : ''}<div class="project-bottom"><span>✦ stamp collected · ${progress.stamps.length} of 8</span><button data-ui="directory">all the machines →</button></div>`, true);
  if (history) setRoute(`${world.id}/${project.id}`);
  activeDemo = createDemo(id);
  paintDemo();
}


function paintDemo() {
  const element = root.querySelector('.project-demo');
  if (!element) return;
  const restoreFocus = element.contains(document.activeElement);
  renderDemo(element, activeDemo);
  if (restoreFocus) element.querySelector('button').focus({ preventScroll: true });
  const preview = element.querySelector('canvas');
  if (preview) pet(preview.getContext('2d'), 50, 70, 'slice', 0, false, 2, 'down', activeDemo.meals === 3);
}

function directory() {
  openDialog('THE ARCADE / PICK A MACHINE', 'things i’ve built.', `<p class="dialog-lead">some games, some tools, a few experiments. you can open any of them right here.</p><div class="project-directory">${projects.map((project, i) => `<button data-project="${project.id}" style="--project-color:${project.color}"><span class="directory-number">${String(i + 1).padStart(2, '0')}</span><span><strong>${project.name}</strong><small>${project.category}</small></span><span>${progress.stamps.includes(project.id) ? '✦' : '↗'}</span></button>`).join('')}</div><button class="secondary" data-room="arcade">walk around the arcade →</button>`);
}

function map() {
  openDialog('A VERY SMALL TOWN', 'where to?', `<p class="dialog-lead">take a shortcut. there’s no wrong way to explore.</p><div class="map-choices">${[['town','01','main street','the river, the mountains and a little fresh air.'],['arcade','02','last light arcade','eight projects. find your next side quest.'],['cabin','03','home base','a bit about me. meet your companion.']].map(([id,n,title,copy]) => `<button data-room="${id}"><span>${n}</span><strong>${title}</strong><small>${copy}</small><b>${world.id === id ? 'YOU ARE HERE' : 'GO HERE ↗'}</b></button>`).join('')}</div>${progress.pizza === 'delivered' ? '<button class="secondary" data-room="rooftop">the rooftop is open ↑</button>' : '<p class="small-note">there might be a rooftop. ask about the pizza.</p>'}<div class="dialog-actions"><button class="secondary" data-ui="about">about taylor</button><button class="secondary" data-ui="work">work history</button><button class="secondary" data-ui="contact">say hello</button></div>`);
}

function choosePet() {
  openDialog('LILGOTCHI / A LITTLE COMPANY', 'pick your walking buddy.', `<p class="dialog-lead">they’ll follow you around and remember you next time. lilgotchi, slice and cypunk. your little crew.</p><div class="pet-choices">${pets.map(item => `<button data-pet="${item.id}" aria-pressed="${progress.pet === item.id}"><canvas width="100" height="90" data-pet-art="${item.id}" aria-hidden="true"></canvas><strong>${item.name}</strong><small>${item.description}</small><span>${progress.pet === item.id ? 'YOUR COMPANION ♥' : 'COME WITH ME →'}</span></button>`).join('')}</div><a class="text-link" href="/lilgotchi/">meet the full lilgotchi project ↗</a>`);
  root.querySelectorAll('[data-pet-art]').forEach(element => { const ctx = element.getContext('2d'); ctx.imageSmoothingEnabled = false; pet(ctx, 50, 72, element.dataset.petArt, 0, false, 2.3); });
}

function passport() {
  openDialog('YOUR POCKET COLLECTION', 'a few good discoveries.', `<p class="dialog-lead">visit each project to collect its stamp. all eight unlock a photo booth keepsake.</p><div class="passport">${projects.map(item => `<button data-project="${item.id}" class="${progress.stamps.includes(item.id) ? 'collected' : ''}"><span>${progress.stamps.includes(item.id) ? ({ lilgotchi: '♥', snowcrust: '◭', relay: '⇄', fight: '⚔', sweat: '♜', moonbean: '☕', poker: '♠', reachoutt: '☎' }[item.id]) : '◇'}</span><strong>${item.name}</strong><small>${progress.stamps.includes(item.id) ? 'VISITED' : 'TAKE A LOOK'}</small></button>`).join('')}</div><p class="small-note">your companion and discoveries are saved in this browser.</p>${progress.stamps.length === 8 ? '<button class="primary" data-ui="photo">take your photo ↗</button>' : ''}`);
}

function paintStamps() {
  root.querySelectorAll('.passport .collected').forEach(button => {
    const project = projects.find(item => item.id === button.dataset.project);
    const stamp = document.createElement('canvas'); stamp.width = 64; stamp.height = 48;
    stamp.setAttribute('aria-hidden', 'true');
    screen(stamp.getContext('2d'), project.screen, 0, 0, 64, 48, 0, true);
    button.querySelector('span').replaceChildren(stamp);
  });
}

function about() {
  openDialog('HOME BASE / TAYLOR DORSETT', 'hey, i’m taylor.', `<div class="about-panel"><img src="images/me.png" alt="Taylor in a tie dye shirt eating pizza"/><div><p class="project-description">software engineer in missoula, montana. former (recovering) tech recruiter.</p><p>i like making things for the web. sometimes useful things. sometimes a tiny pet or a pizza game.</p><p>away from the keyboard: reading, bjj, poker, video games and tie dye shirts.</p><div class="dialog-actions"><button class="primary" data-ui="directory">see the projects ↗</button><button class="secondary" data-ui="contact">say hello</button></div></div></div>`);
}

function work() {
  openDialog('ABOUT / WORK HISTORY', 'the day job.', `<p class="dialog-lead">from finding engineers to being one.</p><div class="jobs">${jobs.map(job => `<article><small>${job.when}</small><h3>${job.title}</h3>${job.url ? `<a href="${job.url}">${job.company} ↗</a>` : `<p>${job.company}</p>`}</article>`).join('')}</div><button class="secondary" data-ui="contact">get in touch ↗</button>`);
}

function career(id) {
  const story = careerStories[id];
  openDialog(`THE WORKSHOP / ${story.object.toUpperCase()}`, story.name, `<p class="dialog-lead">${story.text}</p><p>${story.detail}</p><button class="secondary" data-ui="work">work history ↗</button>`);
}

function contact() {
  openDialog('THE FRONT COUNTER / LEAVE A NOTE', 'say hello.', `<p class="dialog-lead">have something in mind? i'd love to hear about it.</p><a class="mail-link" href="mailto:dorsetttaylordev@gmail.com">dorsetttaylordev@gmail.com ↗</a><div class="dialog-actions"><a class="secondary" href="https://github.com/TaylorOD">github ↗</a><a class="secondary" href="https://www.youtube.com/TaylorDorsett">youtube ↗</a></div><div class="counter-note">out exploring? leave a note.<br>i'll find it when i'm back.</div>`);
}

function pizza() {
  const carrying = progress.pizza === 'carrying', delivered = progress.pizza === 'delivered';
  openDialog('OPTIONAL SIDE QUEST / SPECIAL DELIVERY', delivered ? 'you’ve earned a slice.' : carrying ? 'one pizza. one short walk.' : 'got a minute?', `<p class="dialog-lead">${delivered ? 'the delivery is done. the rooftop is yours whenever you need a little break.' : carrying ? 'your pizza is still warm. take it to the neighbor on the bench to the left of the arcade.' : 'the neighbor on the town bench ordered a pizza. take it over and they’ll let you in on a little secret.'}</p><div class="dialog-actions">${delivered ? '<button class="primary" data-room="rooftop">head up to the rooftop ↑</button>' : carrying ? '<button class="primary" data-room="town">back to main street →</button>' : '<button class="primary" data-ui="take-pizza">i’m on it →</button>'}<button class="secondary" data-ui="close">maybe later</button></div>`);
}

function delivery() {
  if (progress.pizza === 'carrying') {
    progress.pizza = 'delivered'; updateInventory(); sound.chime();
    openDialog('SIDE QUEST COMPLETE', 'pizza makes friends.', '<div class="quest-exchange" aria-label="Pizza delivered. Rooftop key received."><span>🍕</span><span>↔</span><span class="rooftop-key">⚿</span></div><p class="dialog-lead">“you made it! thanks for bringing dinner. here’s the rooftop key. head up whenever you like.”</p><button class="primary" data-room="rooftop">let’s see the view ↑</button>');
  } else if (progress.pizza === 'delivered') pizza();
  else openDialog('A NEIGHBOR ON THE BENCH', 'waiting on a pizza.', '<p class="dialog-lead">“if you’re heading to the arcade, could you pick up my order? it’s at the little pizza table.”</p><button class="secondary" data-room="arcade">head to the arcade →</button>');
}

function photo() {
  if (progress.stamps.length !== 8) {
    openDialog('THE PHOTO BOOTH', 'a little souvenir.', `<p class="dialog-lead">collect all eight project stamps and the photo booth is yours. you’ve found ${progress.stamps.length} so far.</p><button class="primary" data-ui="directory">find the other machines →</button>`); return;
  }
  openDialog('THANKS FOR STOPPING BY', 'you & your little buddy.', '<p class="dialog-lead">a postcard from last light arcade. a little something to take home.</p><div class="dialog-actions"><button class="secondary" data-pose="hello">hello</button><button class="secondary" data-pose="pizza">pizza break</button><button class="secondary" data-pose="view">mountain view</button></div><div class="postcard-preview"></div><button class="primary" data-ui="download">save your postcard ↓</button>');
  const postcard = world.postcard(postcardPose); postcard.setAttribute('role', 'img'); postcard.setAttribute('aria-label', 'Taylor and your pet on the rooftop, with the mountains behind them'); root.querySelector('.postcard-preview').append(postcard);
}

function help() {
  openDialog('MAKE YOURSELF AT HOME', 'a quick tour.', `<div class="help-list"><p><kbd>W A S D</kbd> or <kbd>↑ ← ↓ →</kbd> to walk. click the world first to use the keyboard.</p><p><kbd>E</kbd> or <kbd>Enter</kbd> to interact with something nearby.</p><p>click or tap a building or machine to walk over and open it. tap the ground to go somewhere.</p><p>on a phone, use the direction buttons and the explore button.</p><p><kbd>M</kbd> opens the map. projects, about and contact are also available without walking.</p><p>sound is optional. your browser’s reduced motion setting is respected.</p></div><button class="primary" data-ui="close">got it. let’s explore →</button>`);
}

function handleAction(action) {
  dismissWelcome();
  if (action.startsWith('room:')) { changeRoom(action.slice(5)); return; }
  if (action.startsWith('project:')) { openProject(action.slice(8)); return; }
  const actions = {
    directory, map, pets: choosePet, passport: () => { passport(); paintStamps(); }, about, work, contact, pizza, delivery, photo, help,
    chef: () => career('chef'), levels: () => career('levels'), recruiting: () => career('recruiting'),
    enter: () => { dismissWelcome(); world.goTo('arcade'); canvas.focus(); },
    dismiss: () => { dismissWelcome(); canvas.focus(); },
    close: () => closeDialog(),
    bench: () => openDialog('A MOMENT ON MAIN STREET', 'stay a while.', '<p class="dialog-lead">nothing to collect here. just a bench, a river and a little space between projects.</p><button class="secondary" data-ui="close">back to exploring</button>'),
    carousel: () => openDialog('A CAROUSEL FOR MISSOULA', 'one more spin.', '<p class="dialog-lead">hand carved horses, a dragon and a whole lot of volunteer work. a little piece of Caras Park beside the river.</p><a class="text-link" href="https://www.missoulacarousel.org/" target="_blank" rel="noopener noreferrer">visit the real carousel ↗</a>'),
    wilma: () => openDialog('THE WILMA', 'a little downtown missoula.', '<p class="dialog-lead">a familiar marquee, a night of live music and the river just around the corner.</p><a class="text-link" href="https://logjampresents.com/venue/the-wilma/" target="_blank" rel="noopener noreferrer">see what is playing ↗</a>'),
    campus: () => openDialog('UNIVERSITY OF MONTANA', 'at the end of the street.', '<p class="dialog-lead">a little walk past the storefronts, with mount sentinel in the background.</p><button class="secondary" data-ui="close">back to exploring</button>'),
    river: () => toast('the river isn’t going anywhere. neither is that side project.'),
    books: () => openDialog('ON THE BOOKSHELF', 'away from the keyboard.', '<p class="dialog-lead">reading, games, bjj and poker. a few ways to spend the time between making things.</p><button class="secondary" data-ui="about">a bit more about me →</button>'),
    legacy: () => openDialog('AN EARLIER SAVE FILE / 2020', 'booting the old computer.', '<p class="dialog-lead">the original portfolio, running right here. a little piece of where this started.</p><iframe class="legacy-computer" src="eightbit/legacy/index.html" title="Taylor’s original 2020 portfolio" sandbox="allow-scripts allow-popups" loading="lazy"></iframe><a class="text-link" href="https://github.com/TaylorOD/8_bit_portfolio">see the original source ↗</a>'),
    roof: () => progress.pizza === 'delivered' ? changeRoom('rooftop') : openDialog('A LOCKED ROOFTOP DOOR', 'someone has the key.', '<p class="dialog-lead">a note on the door: “ask the person waiting on a pizza. they know the way up.”</p><button class="secondary" data-room="arcade">check the pizza counter →</button>'),
    view: () => openDialog('ABOVE IT ALL', 'a pretty good place to pause.', '<p class="dialog-lead">thanks for taking the long way around. hope you found something you liked.</p><button class="secondary" data-ui="contact">say hello before you go ↗</button>'),
    'take-pizza': () => { progress.pizza = 'carrying'; updateInventory(); closeDialog(); toast('pizza acquired. find the neighbor on the town bench.'); },
    download: () => { world.postcard(postcardPose).toBlob(blob => { if (!blob) return; const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'side-quest-postcard.png'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }); },
    sound: async () => {
      try { const enabled = await sound.toggle(); const button = root.querySelector('[data-ui="sound"]'); button.textContent = enabled ? 'sound on' : 'sound off'; button.setAttribute('aria-pressed', String(enabled)); if (!enabled && !sound.context) toast('sound isn’t available in this browser.'); }
      catch { toast('couldn’t start audio. you can keep exploring without it.'); }
    },
  };
  actions[action]?.();
}

world = new World(canvas, {
  progress, onAction: handleAction,
  onPosition: (id, player) => { sound.position(id, player); const point = mapPosition(id, player), dot = root.querySelector('.map-player'); dot.setAttribute('cx', point.x); dot.setAttribute('cy', point.y); root.querySelector('.mini-map').setAttribute('aria-label', `Open the town map. You are in ${scenes[id].name}.`); },
  onDaylight: (id, label) => { if (id === 'town' || id === 'rooftop') root.querySelector('.place-subtitle').textContent = `missoula, montana · ${label}`; },
  onRoom: (id, scene) => { sound.setRoom(id); root.dataset.room = id; root.querySelector('.place-name').textContent = scene.name; root.querySelector('.place-subtitle').textContent = scene.subtitle; root.querySelector('.footer-location').textContent = id === 'town' ? 'a little visit to missoula.' : 'take your time. look around.'; root.querySelector('.interact').disabled = true; },
  onNearby: point => { const button = root.querySelector('.interact'); button.disabled = !point; button.querySelector('span').textContent = point?.label || 'walk up to something'; },
  onMove: (time, room) => { if (!root.querySelector('.welcome').hidden) dismissWelcome(); sound.step(time, room); },
});

root.addEventListener('click', event => {
  const button = event.target.closest('button[data-ui], button[data-room], button[data-project], button[data-pet], button[data-demo], button[data-pose]'); if (!button) return;
  if (button.dataset.pose) { postcardPose = button.dataset.pose; photo(); }
  if (button.dataset.ui) handleAction(button.dataset.ui);
  if (button.dataset.room) { closeDialog(false); changeRoom(button.dataset.room); canvas.focus(); }
  if (button.dataset.project) openProject(button.dataset.project);
  if (button.dataset.pet) { progress.pet = button.dataset.pet; progress.adopted = true; updateInventory(); closeDialog(); toast(`${progress.pet} is coming with you. ♥`); }
  if (button.dataset.demo) { activeDemo = advanceDemo(activeDemo); paintDemo(); sound.chime(); }
});
root.querySelector('.interact').addEventListener('click', () => world.interact());
root.querySelector('.close-dialog').addEventListener('click', () => closeDialog());
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(); } });
root.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); directory(); });
document.addEventListener('keydown', event => { if (!dialog.open && event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); map(); } });
root.querySelectorAll('[data-direction]').forEach(button => {
  button.addEventListener('contextmenu', event => event.preventDefault());
  button.addEventListener('selectstart', event => event.preventDefault());
  button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); world.walk(button.dataset.direction, true); dismissWelcome(); });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur']) button.addEventListener(name, () => world.walk(button.dataset.direction, false));
  button.addEventListener('keydown', event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); world.walk(button.dataset.direction, true); } });
  button.addEventListener('keyup', () => world.walk(button.dataset.direction, false));
});

function applyRoute() {
  if (dialog.open) closeDialog(false);
  const [first, second] = location.hash.slice(1).split('/');
  if (['about', 'work', 'contact'].includes(first)) { changeRoom(first === 'about' ? 'cabin' : 'town', false); handleAction(first); return; }
  const id = first === 'projects' || first === 'directory' ? 'arcade' : scenes[first] ? first : location.pathname.endsWith('projects.html') ? 'arcade' : 'town';
  if (id !== world.id) changeRoom(id, false);
  if (second && projects.some(project => project.id === second)) openProject(second, false);
}
window.addEventListener('hashchange', applyRoute);
updateInventory();
if (progress.visited) root.querySelector('.welcome').hidden = true;
applyRoute();
