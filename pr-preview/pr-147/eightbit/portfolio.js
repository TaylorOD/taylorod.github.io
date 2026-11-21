import { loadInterior } from './interior-view.js';
import { discoveries, discover } from './hunt.js';
import { places, carouselStory } from './places.js';
import { createDemo, advanceDemo, renderDemo } from './demos.js';
import { canEnter } from './navigation.js';
import { World } from './world.js';
import { projects, pets, jobs, careerStories, loadProgress, saveProgress } from './content.js';
import { scenes } from './scenes.js';
import { pet, screen } from './art.js';
import { Sound } from './sound.js';

const progress = loadProgress();
const sound = new Sound();
const normalURL = new URL('../', import.meta.url);
const root = document.createElement('div'); root.id = 'eightbit';
root.innerHTML = `
  <a class="skip-link" href="#directory">skip to the projects</a>
  <header class="game-header"><a class="brand" href="./" aria-label="8 bit missoula home"><span class="brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" shape-rendering="crispEdges"><path fill="currentColor" d="M2 19v-3h2v-3h2v-3h2V7h4v3h2v3h2v-3h4v3h2v6Z"/><path fill="#fff0cf" d="M8 7h4v3h2v3h-4v-3H8Z"/></svg></span><span>8 BIT MISSOULA<small>A LITTLE PIXEL TOWN IN MONTANA</small></span></a><nav aria-label="Quick navigation"><button data-ui="directory">projects <span>08</span></button><button data-ui="about">about</button><button data-ui="contact">contact</button><button data-ui="sound" aria-pressed="false">sound off</button><a class="normal-site">portfolio ↗</a></nav></header>
  <main class="game-stage" aria-label="8 bit missoula">
    <canvas class="world-canvas" tabindex="0" aria-label="Explore the town. Arrow keys or WASD to walk. E or Enter to interact. Click a place to walk there, or use the projects menu."></canvas>
    <div class="scene-shade" aria-hidden="true"></div>
    <div class="place-label"><span class="place-dot"></span><div><h1 class="place-name">main street</h1><p class="place-subtitle">missoula, montana · just before sunset</p></div></div>
    <div class="inventory-bar"><button data-ui="pets" class="companion-button" aria-label="Choose a pet companion"><canvas width="30" height="32" aria-hidden="true"></canvas><span class="pet-name">slice</span></button><button data-ui="passport" class="stamp-count">0 / 4 found</button></div>
    <section class="welcome"><p class="eyebrow">WELCOME TO MISSOULA.</p><h2>take the<br>scenic route.</h2><p>four lilgotchi are hiding around town.<br>look closely and talk to the neighbors.</p><button class="primary" data-ui="enter">start exploring <span>↗</span></button><button class="quiet" data-ui="dismiss">i'll take a look around</button><small>click to walk · arrow keys work too</small></section>
    <div class="room-toast" role="status"></div>
    <div class="quest-note" hidden><span>◈</span> pizza delivery <small>take it to the town bench</small></div>
    <button class="interact" disabled><kbd>E</kbd><span>walk up to something</span><b>↗</b></button>
    <div class="dpad" aria-label="Movement controls"><button data-direction="arrowup" aria-label="Walk up">↑</button><button data-direction="arrowleft" aria-label="Walk left">←</button><button data-direction="arrowdown" aria-label="Walk down">↓</button><button data-direction="arrowright" aria-label="Walk right">→</button></div>
  </main>
  <footer class="game-footer"><span class="footer-location">a little visit to missoula.</span><span class="desktop-help"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move <i>·</i> <kbd>E</kbd> explore <i>·</i> click anywhere to walk</span><button data-ui="help">how to play <span>?</span></button></footer>
  <dialog class="game-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span class="dialog-tag"></span><button class="close-dialog" aria-label="Close dialog">✕</button></div><div class="dialog-content"></div></dialog>`;
root.querySelector('.normal-site').href = normalURL.href;
document.body.replaceChildren(root); document.documentElement.classList.add('eightbit-mode');
document.title = '8 bit missoula';
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
  root.querySelector('.stamp-count').textContent = `${progress.found.length} / ${discoveries.length} found`;
  root.querySelector('.pet-name').textContent = progress.adopted ? progress.pet : 'find a buddy';
  const icon = root.querySelector('.companion-button canvas'), ctx = icon.getContext('2d'); ctx.clearRect(0, 0, icon.width, icon.height); if(progress.adopted) pet(ctx, 14, 29, progress.pet);
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
  const arrival = id === 'arcade' && previous === 'rooftop' ? scenes.arcade.points.find(point => point.id === 'roof') : id === 'town' ? doors[previous] : undefined;
  world.enter(id, arrival);
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
    <div class="project-layout"><div class="project-visual" style="--project-color:${project.color}"><img class="project-screenshot" src="../eightbit/previews/${project.id}.jpg" alt="${project.name} running in the browser" loading="lazy"/><span class="screen-caption">${project.category}</span></div><div class="project-copy"><p class="project-description">${project.description}</p><p>${project.detail}</p><div class="tech-label">BUILT WITH</div><p class="tech">${project.stack}</p><div class="dialog-actions"><a class="primary" href="${project.url}">${project.action} ↗</a><a class="secondary" href="https://github.com/TaylorOD/${project.repo}">see the code ↗</a>${special}</div></div></div>${['lilgotchi', 'snowcrust', 'relay'].includes(id) ? '<section class="project-demo" aria-live="polite"></section>' : ''}<div class="project-bottom"><span>✦ stamp collected · ${progress.stamps.length} of 8</span><button data-ui="directory">all the machines →</button></div>`, true);
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

function choosePet() {
  openDialog('YOUR WALKING COMPANIONS', 'find them. bring them along.', `<p class="dialog-lead">each friend has a hiding place. found friends can follow you anywhere.</p><div class="pet-choices">${pets.map(item => {
    const found=progress.found.includes(item.id);
    return `<button ${found?`data-pet="${item.id}"`:`data-hint="${item.id}"`} aria-pressed="${progress.adopted&&progress.pet===item.id}"><canvas width="100" height="90" data-pet-art="${item.id}" aria-hidden="true"></canvas><strong>${item.name}</strong><small>${found?item.description:'still hiding somewhere in Missoula'}</small><span>${found?(progress.pet===item.id?'YOUR COMPANION ♥':'COME WITH ME →'):'GET A HINT →'}</span></button>`;
  }).join('')}</div>`);
  root.querySelectorAll('[data-pet-art]').forEach(element => { const ctx=element.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.globalAlpha=progress.found.includes(element.dataset.petArt)?1:.2;pet(ctx,50,72,element.dataset.petArt,0,false,2.3); });
}

function hint(id) {
  const item=discoveries.find(d=>d.id===id);
  if(item) openDialog('A LITTLE NUDGE', `looking for ${id}.`, `<p class="dialog-lead">${item.hint}</p><button class="secondary" data-ui="close">keep looking</button>`);
}

function foundFriend(event) {
  const item=discover(progress,event);
  if(!item) return false;
  updateInventory();
  openDialog('FOUND A LILGOTCHI', `hello, ${item.id}.`, `<p class="dialog-lead">${progress.found.length===discoveries.length?'that is everyone! your Missoula postcard is ready.':`you found ${progress.found.length} of ${discoveries.length}. this friend can now walk with you.`}</p>${item.id==='slice'?'<p>your neighbor also gave you the rooftop key. the stairs inside the arcade are yours to use.</p>':''}<button class="primary" data-pet="${item.id}">come with me</button><button class="secondary" data-ui="passport">see the collection</button>`);
  return true;
}

function passport() {
  openDialog('FIND THE LILGOTCHI', `${progress.found.length} of ${discoveries.length} friends found.`, `<p class="dialog-lead">search the town and interiors. some friends need a closer look. one needs a favor for a neighbor.</p><div class="passport">${pets.map(item=>`<button ${progress.found.includes(item.id)?`data-pet="${item.id}"`:`data-hint="${item.id}"`} class="${progress.found.includes(item.id)?'collected':''}"><span>${progress.found.includes(item.id)?'♥':'?'}</span><strong>${item.name}</strong><small>${progress.found.includes(item.id)?'FOUND':'GET A HINT'}</small></button>`).join('')}</div><p class="small-note">your discoveries are saved in this browser.</p>${progress.found.length===discoveries.length?'<button class="primary" data-ui="photo">make your Missoula postcard</button>':''}<button class="secondary" data-ui="directory">visit the project arcade</button>`);
}

function about() {
  openDialog('HOME BASE / TAYLOR DORSETT', 'hey, i’m taylor.', `<div class="about-panel"><img src="../images/me.png" alt="Taylor in a tie dye shirt eating pizza"/><div><p class="project-description">software engineer in missoula, montana. former (recovering) tech recruiter.</p><p>i like making things for the web. sometimes useful things. sometimes a tiny pet or a pizza game.</p><p>away from the keyboard: reading, bjj, poker, video games and tie dye shirts.</p><div class="dialog-actions"><button class="primary" data-ui="directory">see the projects ↗</button><button class="secondary" data-ui="contact">say hello</button></div></div></div>`);
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
    if(foundFriend('delivery')) return;
    openDialog('SIDE QUEST COMPLETE', 'pizza makes friends.', '<div class="quest-exchange" aria-label="Pizza delivered. Rooftop key received."><span>🍕</span><span>↔</span><span class="rooftop-key">⚿</span></div><p class="dialog-lead">“you made it! thanks for bringing dinner. here’s the rooftop key. head up whenever you like.”</p><button class="primary" data-room="rooftop">let’s see the view ↑</button>');
  } else if (progress.pizza === 'delivered') { if(!foundFriend('delivery')) pizza(); }
  else openDialog('A NEIGHBOR ON THE BENCH', 'waiting on a pizza.', '<p class="dialog-lead">“if you’re heading to the arcade, could you pick up my order? it’s at the coin counter.”</p><button class="secondary" data-room="arcade">head to the arcade →</button>');
}

async function photo() {
  if (progress.found.length !== discoveries.length) {
    openDialog('THE PHOTO BOOTH', 'a little souvenir.', `<p class="dialog-lead">find all four lilgotchi and the postcard is yours. you’ve found ${progress.found.length} so far.</p><button class="primary" data-ui="passport">find the other friends →</button>`); return;
  }
  try { await loadInterior('rooftop'); } catch { toast('the postcard could not load. try again in a moment.'); return; }
  openDialog('THANKS FOR STOPPING BY', 'you & your little buddy.', '<p class="dialog-lead">a postcard from 8 bit missoula. a little something to take home.</p><div class="dialog-actions"><button class="secondary" data-pose="hello">hello</button><button class="secondary" data-pose="pizza">pizza break</button><button class="secondary" data-pose="view">mountain view</button></div><div class="postcard-preview"></div><button class="primary" data-ui="download">save your postcard ↓</button>');
  const postcard = world.postcard(postcardPose); postcard.setAttribute('role', 'img'); postcard.setAttribute('aria-label', 'Taylor and your pet on the rooftop, with the mountains behind them'); root.querySelector('.postcard-preview').append(postcard);
}

function help() {
  openDialog('HOW TO PLAY', 'find the lilgotchi.', '<p class="dialog-lead">four friends are hidden around Missoula. look behind things, explore the house and arcade, and talk to the neighbor on the bench. found friends can walk with you.</p><p>click a place to walk there. use WASD or the arrow keys to move, then E or Enter to interact. on a phone, use the arrow buttons and the interaction button.</p><p>tap the found counter for hints and your collection. find everyone to unlock a Missoula postcard. your progress saves automatically.</p><button class="primary" data-ui="passport">see the collection</button>');
}

function handleAction(action) {
  if(action==='books'&&foundFriend('books')) return;
  if(action.startsWith('find:')) { if(!foundFriend(action)) toast('you already found this friend.'); return; }
  dismissWelcome();
  if (action.startsWith('room:')) { changeRoom(action.slice(5)); return; }
  if (action.startsWith('place:')) { const place = places[action.slice(6)]; if (place) openDialog('AROUND MISSOULA', place.name, `<p class="dialog-lead">${place.text}</p><a class="text-link" href="${place.url}" target="_blank" rel="noopener noreferrer">visit their website</a>`); return; }
  if (action.startsWith('project:')) { openProject(action.slice(8)); return; }
  const actions = {
    directory, pets: choosePet, passport, about, work, contact, pizza, delivery, photo, help,
    coins: () => openDialog('COINS & BEER', 'a pint and a few quarters?', '<p class="dialog-lead">beer on tap, change for the machines, and the occasional pizza pickup for a neighbor.</p><div class="dialog-actions"><button class="primary" data-ui="beer">grab a beer</button><button class="secondary" data-ui="pizza">ask about the delivery</button><button class="secondary" data-ui="contact">leave a note</button></div>'),
    beer: () => { closeDialog(); toast('one cold pint. enjoy the arcade.'); },
    chef: () => career('chef'), levels: () => career('levels'), recruiting: () => career('recruiting'),
    enter: () => { dismissWelcome(); toast('four friends are hiding. tap the found counter for hints.'); canvas.focus(); },
    dismiss: () => { dismissWelcome(); canvas.focus(); },
    close: () => closeDialog(),
    bench: () => openDialog('A MOMENT ON MAIN STREET', 'stay a while.', '<p class="dialog-lead">nothing to collect here. just a bench, a river and a little space between projects.</p><button class="secondary" data-ui="close">back to exploring</button>'),
    carousel: () => openDialog('A CAROUSEL FOR MISSOULA', 'catch the brass ring.', carouselStory),
    wilma: () => openDialog('THE WILMA', 'a little downtown missoula.', '<p class="dialog-lead">a familiar marquee, a night of live music and the river just around the corner.</p><a class="text-link" href="https://logjampresents.com/venue/the-wilma/" target="_blank" rel="noopener noreferrer">see what is playing ↗</a>'),
    campus: () => openDialog('UNIVERSITY OF MONTANA', 'at the end of the street.', '<p class="dialog-lead">a little walk past the storefronts, with mount sentinel in the background.</p><button class="secondary" data-ui="close">back to exploring</button>'),
    river: () => openDialog('ON THE CLARK FORK', "Brennan's Wave", '<p class="dialog-lead">a standing wave in the middle of Missoula. stop along the riverwalk and watch surfers and paddlers take their turns.</p><a class="text-link" href="https://www.missouladowntown.com/caras-park/brennans-wave/" target="_blank" rel="noopener noreferrer">about the wave</a>'),
    books: () => openDialog('ON THE BOOKSHELF', 'away from the keyboard.', '<p class="dialog-lead">reading, games, bjj and poker. a few ways to spend the time between making things.</p><button class="secondary" data-ui="about">a bit more about me →</button>'),
    roof: () => progress.pizza === 'delivered' ? changeRoom('rooftop') : openDialog('A LOCKED ROOFTOP DOOR', 'someone has the key.', '<p class="dialog-lead">a note on the door: “ask the person waiting on a pizza. they know the way up.”</p><button class="secondary" data-room="arcade">check the coin counter →</button>'),
    view: () => openDialog('ABOVE IT ALL', 'a pretty good place to pause.', '<p class="dialog-lead">thanks for taking the long way around. hope you found something you liked.</p><button class="secondary" data-ui="contact">say hello before you go ↗</button>'),
    'take-pizza': () => { progress.pizza = 'carrying'; updateInventory(); closeDialog(); toast('pizza acquired. find the neighbor on the town bench.'); },
    download: () => { world.postcard(postcardPose).toBlob(blob => { if (!blob) return; const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = '8-bit-missoula-postcard.png'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }); },
    sound: async () => {
      try { const enabled = await sound.toggle(); const button = root.querySelector('[data-ui="sound"]'); button.textContent = enabled ? 'sound on' : 'sound off'; button.setAttribute('aria-pressed', String(enabled)); if (!enabled && !sound.context) toast('sound isn’t available in this browser.'); }
      catch { toast('couldn’t start audio. you can keep exploring without it.'); }
    },
  };
  actions[action]?.();
}

world = new World(canvas, {
  progress, onAction: handleAction,
  onPosition: (id, player, time) => sound.position(id, player, time),
  onDaylight: (id, label) => { if (id === 'town' || id === 'rooftop') root.querySelector('.place-subtitle').textContent = `missoula, montana · ${label}`; },
  onRoom: (id, scene) => { sound.setRoom(id); root.dataset.room = id; root.querySelector('.place-name').textContent = scene.name; root.querySelector('.place-subtitle').textContent = scene.subtitle; root.querySelector('.footer-location').textContent = id === 'town' ? 'a little visit to missoula.' : 'take your time. look around.'; root.querySelector('.interact').disabled = true; },
  onNearby: point => { const button = root.querySelector('.interact'); button.disabled = !point; button.querySelector('span').textContent = point?.label || 'walk up to something'; },
  onMove: (time, room) => { if (!root.querySelector('.welcome').hidden) dismissWelcome(); sound.step(time, room); },
});

root.addEventListener('click', event => {
  const button = event.target.closest('button[data-ui], button[data-room], button[data-project], button[data-pet], button[data-demo], button[data-pose], button[data-hint]'); if (!button) return;
  if (button.dataset.hint) hint(button.dataset.hint);
  if (button.dataset.pose) { postcardPose = button.dataset.pose; photo(); }
  if (button.dataset.ui) handleAction(button.dataset.ui);
  if (button.dataset.room) { closeDialog(false); changeRoom(button.dataset.room); canvas.focus(); }
  if (button.dataset.project) openProject(button.dataset.project);
  if (button.dataset.pet && progress.found.includes(button.dataset.pet)) { progress.pet = button.dataset.pet; progress.adopted = true; updateInventory(); closeDialog(); toast(`${progress.pet} is coming with you. ♥`); }
  if (button.dataset.demo) { activeDemo = advanceDemo(activeDemo); paintDemo(); sound.chime(); }
});
root.querySelector('.interact').addEventListener('click', () => world.interact());
root.querySelector('.close-dialog').addEventListener('click', () => closeDialog());
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(); } });
root.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); directory(); });
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
