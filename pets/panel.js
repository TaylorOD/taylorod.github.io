import { advancePet, careFor, petMood, restoreSave, saveKey, stageOf } from './state.js';
import { drawPet, themes } from './art.js';

export function createPanel(launcher) {
  let save;
  let storageAvailable = true;
  try { save = restoreSave(JSON.parse(localStorage.getItem(saveKey))); }
  catch { save = restoreSave(null); }

  const dialog = document.createElement('dialog');
  dialog.className = 'pet-panel';
  dialog.id = 'pocket-pet';
  dialog.setAttribute('aria-labelledby', 'pet-heading');
  launcher.setAttribute('aria-controls', dialog.id);
  dialog.innerHTML = `
    <header class="pet-header">
      <div><p class="pet-eyebrow">// a little company</p><h2 id="pet-heading">pocket pet</h2></div>
      <button type="button" class="pet-close" aria-label="Close pocket pet">×</button>
    </header>
    <div class="pet-picker"><label for="pet-type">your roommate</label>
      <select id="pet-type"><option value="classic">classic</option><option value="pizza">pizza slice</option><option value="cyberpunk">cyberpunk</option></select>
    </div>
    <div class="pet-screen">
      <div class="pet-screen-top"><span id="pet-name"></span><span id="pet-stage"></span></div>
      <canvas width="80" height="48" role="img" id="pet-canvas"></canvas>
      <div class="pet-screen-bottom"><span class="pet-dot" aria-hidden="true"></span><span id="pet-mood"></span></div>
    </div>
    <p class="pet-subtitle" id="pet-subtitle"></p>
    <div class="pet-stats">
      ${[['food', 'fullness'], ['fun', 'happiness'], ['energy', 'energy'], ['clean', 'cleanliness']].map(([id, label]) => `<label>${label}<meter id="pet-${id}" min="0" max="100" aria-label="${label}"></meter></label>`).join('')}
    </div>
    <div class="pet-actions">
      <button type="button" data-care="feed"><span aria-hidden="true">◒</span>feed</button>
      <button type="button" data-care="play"><span aria-hidden="true">▷</span>play</button>
      <button type="button" data-care="clean"><span aria-hidden="true">✧</span>clean</button>
      <button type="button" data-care="sleep"><span aria-hidden="true">☾</span><span id="pet-sleep-label">sleep</span></button>
    </div>
    <div class="pet-game" hidden>
      <p id="pet-game-prompt">which way am i going?</p>
      <div><button type="button" data-guess="left">← left</button><button type="button" data-guess="right">right →</button></div>
      <button type="button" class="pet-game-cancel">done playing</button>
    </div>
    <p class="pet-message" role="status" aria-live="polite">hey. take a little break.</p>
    <footer class="pet-footer"><span id="pet-save-note">each pet saves here in your browser</span><a href="${new URL('./NOTICE.md', import.meta.url).href}" target="_blank" rel="noopener">credits ↗</a></footer>`;
  document.body.append(dialog);
  const find = selector => dialog.querySelector(selector);
  const picker = find('#pet-type');
  const message = find('.pet-message');
  const game = find('.pet-game');
  const canvas = find('canvas');
  let interval;
  let frame = 0;
  let celebrateUntil = 0;
  let round = null;
  let closing = false;
  const currentPet = () => save.pets[save.selected];

  function persist() {
    try {
      localStorage.setItem(saveKey, JSON.stringify(save));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    find('#pet-save-note').textContent = storageAvailable ? 'each pet saves here in your browser' : 'saving is unavailable. this visit only.';
  }

  function render() {
    const pet = advancePet(currentPet());
    const theme = themes[save.selected];
    dialog.dataset.pet = save.selected;
    picker.value = save.selected;
    find('#pet-name').textContent = theme.name;
    find('#pet-stage').textContent = stageOf(pet);
    find('#pet-subtitle').textContent = theme.subtitle;
    find('#pet-mood').textContent = petMood(pet);
    find('#pet-sleep-label').textContent = pet.asleep ? 'wake' : 'sleep';
    for (const stat of ['food', 'fun', 'energy', 'clean']) find(`#pet-${stat}`).value = Math.round(pet[stat]);
    for (const action of ['feed', 'play', 'clean']) find(`[data-care="${action}"]`).disabled = pet.asleep;
    canvas.setAttribute('aria-label', `${theme.name}, ${save.selected} pet, ${petMood(pet)}`);
    drawPet(canvas, save.selected, pet, frame++, Date.now() < celebrateUntil);
  }

  function endGame() { round = null; game.hidden = true; }
  function newRound() {
    round = Math.random() < 0.5 ? 'left' : 'right';
    game.hidden = false;
    find('#pet-game-prompt').textContent = 'which way am i going?';
  }

  function close() {
    if (closing || !dialog.open) return;
    closing = true;
    clearInterval(interval);
    persist();
    dialog.classList.add('pet-closing');
    const finish = () => {
      dialog.close();
      dialog.classList.remove('pet-closing');
      launcher.setAttribute('aria-expanded', 'false');
      closing = false;
      launcher.focus();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else setTimeout(finish, 180);
  }

  find('.pet-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  picker.addEventListener('change', () => {
    advancePet(currentPet());
    save.selected = picker.value;
    celebrateUntil = 0;
    endGame();
    message.textContent = `hey. it’s ${themes[save.selected].name}.`;
    render();
    persist();
  });
  dialog.querySelectorAll('[data-care]').forEach(button => button.addEventListener('click', () => {
    const pet = advancePet(currentPet());
    const action = button.dataset.care;
    if (action === 'play') {
      if (pet.asleep) return;
      newRound();
      message.textContent = 'guess left or right. a match makes me happier.';
      find('[data-guess="left"]').focus();
      return;
    }
    endGame();
    message.textContent = careFor(pet, action);
    celebrateUntil = Date.now() + 2000;
    render();
    persist();
  }));
  dialog.querySelectorAll('[data-guess]').forEach(button => button.addEventListener('click', () => {
    if (!round) return;
    const won = button.dataset.guess === round;
    const direction = round;
    if (won) {
      careFor(advancePet(currentPet()), 'play');
      celebrateUntil = Date.now() + 2000;
    }
    message.textContent = won ? `went ${direction}. you got it!` : `went ${direction}. try another?`;
    newRound();
    render();
    persist();
  }));
  find('.pet-game-cancel').addEventListener('click', () => { endGame(); find('[data-care="play"]').focus(); });

  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) persist();
    else if (dialog.open) render();
  });

  return {
    open() {
      if (closing || dialog.open) return;
      endGame();
      render();
      persist();
      dialog.showModal();
      launcher.setAttribute('aria-expanded', 'true');
      find('.pet-close').focus();
      interval = setInterval(() => { if (!document.hidden) render(); }, 700);
    },
  };
}
