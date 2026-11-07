import { getCharacter } from '../pets/catalog.js';
import { sliceSprites, slicePalette } from '../pets/slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette } from '../pets/cyberpunk-sprites.js';
import { classicSprites } from '../pets/classic-sprites.js';

export function launcherArt(family, state) {
  const sprites=family==='slice'?sliceSprites:family==='cyberpunk'?cyberpunkSprites:classicSprites;
  const palette=family==='slice'?slicePalette:family==='cyberpunk'?cyberpunkPalette:['','#b4ce83'];
  const preview=family==='slice'||family==='cyberpunk'?'tamatchi':getCharacter(family)?.character||'egg';
  const identity=state?.character && Object.hasOwn(sprites,state.character)?state.character:preview;
  const pixels=sprites[identity].idle1;
  const rects=pixels.flatMap((row,y)=>row.flatMap((color,x)=>color?[`<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[color]||palette[1]}"/>`]:[])).join('');
  return `<svg aria-hidden="true" viewBox="0 0 ${pixels[0].length} ${pixels.length}" shape-rendering="crispEdges">${rects}</svg>`;
}
export function savedCare(state) {
  if(!state)return '';
  if(state.vacationAt>0)return '';
  if(state.isDead)return 'Your pet passed away';
  if(state.stage==='egg')return '';
  const needs=[];
  if(state.isSick)needs.push('medicine');
  if(state.poopCount>0)needs.push('cleaning');
  if(state.hunger===0)needs.push('food');
  if(state.happiness===0)needs.push('play');
  if(state.isMisbehaving)needs.push('discipline');
  return needs.length?`Needs ${needs.join(', ')}`:'';
}
export function launcherIcon(family,state) {
  const pet=launcherArt(family,state).replace('<svg ', '<svg x="5" y="8" width="14" height="14" ');
  return `<svg aria-hidden="true" viewBox="0 0 24 28" shape-rendering="crispEdges"><path fill="#e7c88d" d="M9 1h6v2h3v3h2v4h2v10h-2v4h-4v2H8v-2H4v-4H2V10h2V6h2V3h3z"/><path fill="#17221c" d="M6 8h12v14H6z"/>${pet}</svg>`;
}
