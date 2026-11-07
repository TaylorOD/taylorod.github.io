import { sliceSprites, slicePalette } from '../pets/slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette } from '../pets/cyberpunk-sprites.js';
import { classicSprites } from '../pets/classic-sprites.js';

// Reuse the actual pet pixels so the launcher stays part of the game.
export function launcherArt(family) {
  const sprites=family==='slice'?sliceSprites:family==='cyberpunk'?cyberpunkSprites:classicSprites;
  const palette=family==='slice'?slicePalette:family==='cyberpunk'?cyberpunkPalette:['','#b4ce83'];
  const pixels=sprites.tamatchi.idle1;
  const rects=pixels.flatMap((row,y)=>row.flatMap((color,x)=>color?[`<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[color]||palette[1]}"/>`]:[])).join('');
  return `<svg aria-hidden="true" viewBox="0 0 ${pixels[0].length} ${pixels.length}" shape-rendering="crispEdges">${rects}</svg>`;
}
