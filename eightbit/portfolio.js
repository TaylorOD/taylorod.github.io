import { createWorld } from './world.js';

const normalURL = new URL(location.href);
normalURL.searchParams.delete('mode');
normalURL.hash = '';
const root = document.createElement('div');
root.id = 'eightbit';
root.innerHTML = `
  <header class="topbar"><a class="wordmark" href="./?mode=8bit" aria-label="Taylor Dorsett home"><span class="pixel-mark">td</span> TAYLOR DORSETT</a><a class="exit" href="${normalURL.pathname + normalURL.search}">back to the normal site ↗</a></header>
  <main>
    <section class="intro" aria-labelledby="page-title"><div><p class="eyebrow">A LITTLE CORNER OF THE INTERNET</p><h1 id="page-title">hey, i'm taylor<span>.</span></h1><p class="subtitle">software engineer. recovering recruiter. probably eating pizza.</p></div><div class="location"><span class="status-dot"></span> MISSOULA, MT<br><span>PLAYER 01 · 8 BIT EDITION</span></div></section>
    <section class="world-frame" aria-label="Explore Taylor's pixel town">
      <div class="world-heading"><span><span class="status-dot"></span> OVERWORLD</span><span>MONTANA / HOME BASE</span></div>
      <div class="world" tabindex="0" aria-label="Pixel town. Use left and right arrows or A and D to walk. Press Enter near a building to explore. You can also use the buttons below.">
        <canvas width="640" height="240" aria-hidden="true"></canvas>
        <button class="destination home-stop" data-place="about"><span>01</span> the cabin <b>↓</b></button>
        <button class="destination work-stop" data-place="work"><span>02</span> the workshop <b>↓</b></button>
        <button class="destination projects-stop" data-place="projects"><span>03</span> the arcade <b>↓</b></button>
        <button class="destination contact-stop" data-place="contact"><span>04</span> say hello <b>↓</b></button>
      </div>
      <div class="world-controls"><span><kbd>←</kbd> <kbd>→</kbd> move <span class="keyboard-help">· <kbd>enter</kbd> explore</span></span><span class="walk-message" aria-live="polite">pick a place. stay a while.</span><div class="touch-controls"><button aria-label="Walk left" data-walk="-1">←</button><button aria-label="Walk right" data-walk="1">→</button><button class="explore">explore ↗</button></div></div>
    </section>
    <nav class="menu" aria-label="Portfolio sections"><button data-place="about">01 <span>about me</span></button><button data-place="work">02 <span>work</span></button><button data-place="projects">03 <span>projects</span></button><button data-place="contact">04 <span>contact</span></button></nav>
    <section id="town-content" class="content" aria-labelledby="section-title" tabindex="-1"></section>
  </main>
  <footer><span>made with curiosity & a few pixels.</span><a href="https://github.com/TaylorOD/8_bit_portfolio">the original 8 bit experiment ↗</a><span>THANKS FOR STOPPING BY <span class="heart">♥</span></span></footer>`;

// The original DOM stays available until the alternate mode is fully loaded.
document.body.replaceChildren(root);
document.documentElement.classList.add('eightbit-mode');
document.title = 'Taylor Dorsett | 8 bit world';

const projects = [
  ['lilgotchi', 'a little pixel pet that lives on your website.', 'JAVASCRIPT / WEB COMPONENTS', '/lilgotchi/', 'lilgotchi', 'pet'],
  ['snowcrust', 'take calls. make pizza. send a kourier.', 'JAVASCRIPT / THREE.JS', '/snowcrust/', 'snowcrust', 'pizza'],
  ['relay', 'a playground for seeing how systems break and recover.', 'NODE / TYPESCRIPT / REACT', '/relay/', 'relay', 'relay'],
  ['mr game and sweat', 'game reviews for playing while exercising. plus a review chatbot.', 'LLM / RAG', 'https://mrgameandsweat.com/', 'mr-game-and-sweat', 'game'],
  ['fight terminal', 'the ufc schedule, right in your terminal.', 'TERMINAL / WEB', '/fight-terminal/', 'fight-terminal', 'fight'],
  ['moonbean coffee', 'a coffee handbook you can talk to.', 'LLM / RAG', '/moonbean_coffee/', 'moonbean_coffee', 'coffee'],
  ['poker seater', 'random seat assignments for poker night.', 'WEB TOOL', '/poker_seater/', 'poker_seater', 'cards'],
  ['reachoutt', 'a little help remembering to keep in touch.', 'RAILS / VUE', 'https://reachoutt.onrender.com/', 'reachOutt', 'mail'],
];
const icons = { pet: '♥', pizza: '◢', relay: '⌁', game: '✚', fight: '↑', coffee: '☕', cards: '♠', mail: '✉' };
const views = {
  about: () => `<div class="section-label">01 / THE CABIN</div><div class="about-layout"><div><h2 id="section-title">a bit about me.</h2><p>i'm a software engineer in missoula, montana. before that, i spent a lot of time in technical recruiting.</p><p>i like making things for the web. sometimes useful things. sometimes a tiny pet or a pizza game.</p><a class="text-link" href="?mode=8bit#projects">see what i've been building ↗</a></div><aside class="inventory"><h3>IN MY INVENTORY</h3><ul><li><span>▤</span> a good book</li><li><span>✚</span> video games</li><li><span>◈</span> bjj</li><li><span>♠</span> poker night</li><li><span>◢</span> pizza & tie dye</li></ul><small>side quests are kind of my thing.</small></aside></div>`,
  work: () => `<div class="section-label">02 / THE WORKSHOP</div><h2 id="section-title">the day job.</h2><p class="section-intro">from finding engineers to being one.</p><ol class="experience"><li><span class="job-time">CURRENT</span><div><h3>software engineer II</h3><a href="https://www.homechef.com/">home chef ↗</a></div><span class="job-icon">⌘</span></li><li><span class="job-time">PREVIOUSLY</span><div><h3>engineer</h3><a href="https://www.levels.fyi/">levels.fyi ↗</a></div></li><li><span class="job-time">BEFORE THAT</span><div><h3>director of technical recruiting</h3><p>talent solvers</p></div></li></ol>`,
  projects: () => `<div class="section-label">03 / THE ARCADE</div><h2 id="section-title">pick your next side quest.</h2><p class="section-intro">some games, some tools, a few experiments.</p><div class="projects">${projects.map(([name, description, stack, live, repo, icon], index) => `<article class="project"><div class="project-top"><span class="project-icon icon-${icon}" aria-hidden="true">${icons[icon]}</span><span>CARTRIDGE ${String(index + 1).padStart(2, '0')}</span></div><h3>${name}</h3><p>${description}</p><small>${stack}</small><div class="project-links">${live ? `<a href="${live}">open project ↗</a>` : ''}<a href="https://github.com/TaylorOD/${repo}">code ↗</a></div></article>`).join('')}</div>`,
  contact: () => `<div class="section-label">04 / THE MAILBOX</div><div class="contact-layout"><div><h2 id="section-title">say hello.</h2><p>have something in mind? i'd love to hear about it.</p><a class="email-link" href="mailto:dorsetttaylordev@gmail.com">dorsetttaylordev@gmail.com ↗</a><div class="social-links"><a href="https://github.com/TaylorOD">github ↗</a><a href="https://www.youtube.com/TaylorDorsett">youtube ↗</a></div></div><div class="postcard" aria-hidden="true"><span>TO: TAYLOR</span><span class="stamp">♥<small>MT</small></span><div class="post-lines">━━━━━━━━━━<br>━━━━━━━<br>━━━━━━━━━</div><small>YOU'VE GOT A NEW SIDE QUEST.</small></div></div>`,
};

const defaultPlace = location.pathname.endsWith('projects.html') ? 'projects' : 'about';
let selected;
const world = createWorld(root.querySelector('canvas'), root.querySelector('.world'), place => navigate(place));
function navigate(place, focus = true, updateHistory = true) {
  if (!views[place]) place = 'about';
  if (selected === place) return;
  selected = place;
  root.querySelector('#town-content').innerHTML = views[place]();
  root.querySelectorAll('[data-place]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.place === place));
  });
  world.goTo(place);
  if (updateHistory && location.hash !== `#${place}`) history.pushState(null, '', `#${place}`);
  if (focus) root.querySelector('#town-content').focus({ preventScroll: true });
}
root.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.place)));
window.addEventListener('hashchange', () => navigate(location.hash.slice(1) || defaultPlace, false, false));
window.addEventListener('popstate', () => navigate(location.hash.slice(1) || defaultPlace, false, false));
root.querySelectorAll('[data-walk]').forEach(button => {
  button.addEventListener('pointerdown', event => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    world.walk(Number(button.dataset.walk));
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, () => world.walk(0));
  button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') world.walk(Number(button.dataset.walk)); });
  button.addEventListener('keyup', () => world.walk(0));
  button.addEventListener('blur', () => world.walk(0));
});
root.querySelector('.explore').addEventListener('click', () => world.explore());
navigate(location.hash.slice(1) || defaultPlace, false, false);
