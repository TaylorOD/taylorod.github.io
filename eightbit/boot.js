// Keep old bookmarks working while the town has its own home.
if (new URLSearchParams(location.search).get('mode') === '8bit') {
  const destination = new URL('../8-bit-missoula/', import.meta.url);
  destination.hash = location.hash;
  location.replace(destination.href);
}
