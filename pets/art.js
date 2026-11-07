import { classicSprites } from './classic-sprites.js';
import { stageOf } from './state.js';

const pixels = rows => rows.map(row => [...row].map(Number));
const pizza = pixels([
  '0001111111111000',
  '0012222222222100',
  '0122222222222210',
  '0013333333333100',
  '0013344334433100',
  '0001333333331000',
  '0001353353351000',
  '0000133333310000',
  '0000133553310000',
  '0000013333100000',
  '0000013443100000',
  '0000001331000000',
  '0000001331000000',
  '0000000110000000',
  '0000005005000000',
]);
const robot = pixels([
  '0000003300000000',
  '0000001300000000',
  '0001111111111000',
  '0012222222222100',
  '0121111111111210',
  '0121441441441210',
  '0121441441441210',
  '0121111111111210',
  '0012222552222100',
  '0001111111111000',
  '0010012222100100',
  '0330012332100330',
  '0000012222100000',
  '0000001111000000',
  '0000011001100000',
]);

export const themes = {
  classic: { name: 'miso', subtitle: 'a little old school', color: '#b4ce83', ink: '#b4ce83', screen: '#20281d', palette: ['', '#b4ce83'] },
  pizza: { name: 'slice', subtitle: 'emotionally attached to cheese', color: '#ffbb79', ink: '#e6c79d', screen: '#29231c', palette: ['', '#b37a50', '#d78b43', '#ffce62', '#d95a45', '#49352b'] },
  cyberpunk: { name: 'byte', subtitle: 'small robot. big feelings.', color: '#83e8d7', ink: '#8cebdc', screen: '#0b1c24', palette: ['', '#529aaf', '#285262', '#ff78bf', '#8fffe3', '#ffe191'] },
};

export function drawPet(canvas, type, pet, frame, celebrating = false) {
  const ctx = canvas.getContext('2d');
  const theme = themes[type];
  const still = pet.asleep || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = still ? 0 : frame % 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = theme.screen;
  ctx.fillRect(0, 0, 80, 48);
  ctx.fillStyle = '#ffffff08';
  for (let x = 0; x < 80; x += 4) for (let y = 0; y < 48; y += 4) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = theme.ink + '30';
  ctx.fillRect(29, 39, 22, 2);

  let sprite = type === 'pizza' ? pizza : robot;
  if (type === 'classic') {
    const character = { little: 'babytchi', growing: 'marutchi', 'grown up': 'mametchi' }[stageOf(pet)];
    const art = classicSprites[character];
    sprite = (celebrating ? art.happy : art[step ? 'idle2' : 'idle1']) || art.idle1;
  }
  const scale = stageOf(pet) === 'little' && type !== 'classic' ? 1 : 2;
  const left = Math.floor((80 - sprite[0].length * scale) / 2);
  const top = 37 - sprite.length * scale - step;
  sprite.forEach((row, y) => row.forEach((pixel, x) => {
    if (!pixel) return;
    ctx.fillStyle = theme.palette[pixel];
    ctx.fillRect(left + x * scale, top + y * scale, scale, scale);
  }));

  if (pet.asleep) {
    ctx.fillStyle = theme.ink;
    ctx.font = '7px monospace';
    ctx.fillText('z z', 56, 13);
  } else if (celebrating) {
    ctx.fillStyle = type === 'cyberpunk' ? '#ff78bf' : '#c55b47';
    classicSprites.heart.forEach((row, y) => row.forEach((pixel, x) => {
      if (pixel) ctx.fillRect(60 + x, 8 + y, 1, 1);
    }));
  }
}
