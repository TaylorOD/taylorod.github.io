(() => {
  const script = document.currentScript;
  if (!script) return;
  const loader = new URL('./lilgotchi.js', script.src).href;
  const settings = ['character', 'characters', 'placement', 'appearance', 'storage-key', 'mode', 'muted', 'launcher', 'notifications', 'colors'];
  const attributes = settings.filter(name => script.hasAttribute(`data-${name}`))
    .map(name => [name, script.getAttribute(`data-${name}`)]);
  const ready = document.readyState === 'loading'
    ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    : Promise.resolve();
  Promise.all([import(loader), ready]).then(() => {
    const pet = document.createElement('lil-gotchi');
    for (const [name, value] of attributes) pet.setAttribute(name, value);
    if (!pet.hasAttribute('character')) pet.setAttribute('character', 'slice');
    if (pet.getAttribute('mode') === 'inline' && document.body.contains(script)) script.after(pet);
    else document.body.append(pet);
  }).catch(error => {
    console.error('lilgotchi could not load', error);
    script.dispatchEvent(new CustomEvent('lilgotchi:loaderror', { detail: { message: 'lilgotchi could not load' } }));
  });
})();
