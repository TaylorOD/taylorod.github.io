import { classicSprites } from './classic-sprites.js';
import { petType } from './storage.js';

export const SP = structuredClone(classicSprites);
export const palette = petType === 'pizza'
  ? ['', '#e6c79d', '#d78b43', '#ffce62', '#d95a45', '#49352b']
  : petType === 'cyberpunk' ? ['', '#8cebdc', '#285262', '#ff78bf', '#8fffe3', '#ffe191'] : [];
const pixels = rows => rows.map(row => [...row].map(Number));
const pizza = pixels(['0111111110','1222222221','0133443310','0135335310','0013333100','0013553100','0001341000','0001331000','0000110000','0005005000']);
const robot = pixels(['0003300000','0111111110','1222222221','1244144421','1244144421','1222552221','0111111110','3032230300','0012210000','0010010000']);

if (petType !== 'classic') {
  const names = ['babytchi','marutchi','tamatchi','kuchitamatchi','mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi'];
  names.forEach((name, index) => {
    const art = structuredClone(petType === 'pizza' ? pizza : robot);
    // Different evolutions keep their own toppings or antenna and body markings.
    if (index > 0) art[2][2 + index % 5] = petType === 'pizza' ? 4 : 3;
    if (index > 2) art[0][1 + index % 7] = petType === 'pizza' ? 2 : 5;
    if (index === 0) { art.splice(6, 2); }
    const happy = structuredClone(art);
    happy[4][4] = 5;
    const sad = structuredClone(art);
    sad[4][4] = 1;
    SP[name] = { idle1: art, idle2: art.map(row => [0, ...row.slice(0, -1)]), happy, sad, eat: happy };
  });
}
