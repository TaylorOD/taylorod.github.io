// Keep the alternate experience out of the normal site's download path.
if (new URLSearchParams(location.search).get('mode') === '8bit') {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./style.css', import.meta.url);
  stylesheet.addEventListener('load', () => import('./portfolio.js'));
  document.head.append(stylesheet);
}
