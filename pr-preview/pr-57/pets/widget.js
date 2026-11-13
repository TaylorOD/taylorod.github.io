const launcher = document.createElement('button');
launcher.className = 'pet-launcher';
launcher.type = 'button';
launcher.setAttribute('aria-label', 'Open pocket pet');
launcher.setAttribute('aria-haspopup', 'dialog');
launcher.setAttribute('aria-expanded', 'false');
launcher.innerHTML = '<span aria-hidden="true">🍕</span><span>little pet</span>';
document.body.append(launcher);

let panel;
launcher.addEventListener('click', async () => {
  launcher.disabled = true;
  try {
    if (!panel) {
      const { createPanel } = await import('./panel.js');
      panel = createPanel(launcher);
    }
    panel.open();
  } catch {
    launcher.setAttribute('aria-label', 'Could not load pet. Click to try again.');
    launcher.lastElementChild.textContent = 'try again';
  } finally {
    launcher.disabled = false;
  }
});
