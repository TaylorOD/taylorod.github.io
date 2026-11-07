import { TamagotchiApp } from './game.js';
import { petType, validState } from './storage.js';

document.documentElement.dataset.pet = petType;
window.app = new TamagotchiApp();
window.addEventListener('pagehide', () => window.app.state.save());

// Used only by the owning panel to retain progress when browser storage is blocked.
window.restorePetSession = data => {
  if (!validState(data)) return;
  Object.assign(window.app.state, data);
  window.app.processMissedTime();
  window.app.updateButtons();
};

document.addEventListener('keydown', event => {
  const overlay = document.querySelector('.overlay.show');
  if (event.key === 'Escape') {
    event.preventDefault();
    if (overlay && overlay.id !== 'death-overlay') {
      window.app.gameActive = false;
      window.app.closeOverlay(overlay.id);
    } else window.parent.postMessage({ type: 'close-pocket-pet' }, location.origin);
  }
  if (event.key === 'Tab' && overlay) {
    const controls = [...overlay.querySelectorAll('button:not(:disabled), input')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});
