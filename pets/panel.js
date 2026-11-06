const petTypes = ['classic', 'pizza', 'cyberpunk'];
const selectionKey = 'taylor-pocket-pets-p1-selected';

export function createPanel(launcher) {
  let selected = 'pizza';
  try {
    const saved = localStorage.getItem(selectionKey);
    if (petTypes.includes(saved)) selected = saved;
  } catch {}
  const sessions = {};
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
    <div class="pet-game-host"></div>
    <details class="pet-help"><summary>how this works</summary>
      <p>Eggs hatch in five minutes. Feed meals and snacks, play five rounds, clean up, give medicine when sick and scold when misbehaving. Turn off the light at bedtime.</p>
      <p>Care and discipline shape evolution. Needs continue while you’re away. Pets can die. Sound starts muted.</p>
      <p>This uses the P1 clone game. Each pet saves separately. The earlier simplified saves are kept, but this game starts with new eggs.</p>
    </details>
    <footer class="pet-footer"><span>each pet saves in this browser</span><a href="${new URL('./NOTICE.md', import.meta.url).href}" target="_blank" rel="noopener">credits ↗</a></footer>`;
  document.body.append(dialog);
  const picker = dialog.querySelector('select');
  const host = dialog.querySelector('.pet-game-host');
  let frame;
  let closing = false;

  function saveSession() {
    const app = frame?.contentWindow?.app;
    if (!app) return;
    app.state.save();
    sessions[selected] = JSON.parse(JSON.stringify(app.state));
  }

  function loadPet() {
    dialog.dataset.pet = selected;
    picker.value = selected;
    try { localStorage.setItem(selectionKey, selected); } catch {}
    frame = document.createElement('iframe');
    frame.title = `${selected} virtual pet game`;
    frame.src = new URL(`./game.html?pet=${selected}`, import.meta.url).href;
    const loadingFrame = frame;
    frame.addEventListener('load', () => {
      if (loadingFrame !== frame) return;
      if (sessions[selected] && !frame.contentWindow.app?.loadedSave) frame.contentWindow.restorePetSession?.(sessions[selected]);
    });
    host.replaceChildren(frame);
  }

  function close() {
    if (closing || !dialog.open) return;
    closing = true;
    saveSession();
    // Removing the frame stops its timers and sound while the panel is closed.
    frame?.remove();
    frame = null;
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

  picker.addEventListener('change', () => {
    saveSession();
    selected = picker.value;
    loadPet();
  });
  dialog.querySelector('.pet-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  window.addEventListener('message', event => {
    if (event.origin === location.origin && event.source === frame?.contentWindow && event.data?.type === 'close-pocket-pet') close();
  });
  window.addEventListener('pagehide', saveSession);
  return {
    open() {
      if (closing || dialog.open) return;
      loadPet();
      dialog.showModal();
      launcher.setAttribute('aria-expanded', 'true');
      dialog.querySelector('.pet-close').focus();
    },
  };
}
