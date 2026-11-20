import { classicSprites } from './classic-sprites.js';
import { sliceSprites, slicePalette } from './slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette } from './cyberpunk-sprites.js';
import { lilgotchiSprites, lilgotchiPalette } from './lilgotchi-sprites.js';

const opponents = [
 {family:'pizza',name:'Slice',frames:sliceSprites.mametchi,palette:slicePalette},
 {family:'cyberpunk',name:'Cypunk',frames:cyberpunkSprites.ginjirotchi,palette:cyberpunkPalette},
 {family:'lilgotchi',name:'Lilgotchi',frames:lilgotchiSprites.mametchi,palette:lilgotchiPalette},
 {family:'classic',name:'Original',frames:classicSprites.mametchi,palette:[null,'#c4cfa1']},
];

export function chooseOpponent(family, random = Math.random) {
 const choices = opponents.filter(opponent => opponent.family !== family);
 return choices[Math.min(choices.length-1, Math.floor(random()*choices.length))];
}
