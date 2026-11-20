import { getCharacter } from '../pets/catalog.js';
import { sliceSprites, slicePalette } from '../pets/slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette } from '../pets/cyberpunk-sprites.js';
import { classicSprites } from '../pets/classic-sprites.js';
import { lilgotchiSprites, lilgotchiPalette } from '../pets/lilgotchi-sprites.js';

const shellColors={
  classic:{edge:'#c9a882',face:'#e8d5c4',screen:'#c4cfa1'},
  eink:{edge:'#d8d8d8',face:'#f5f5f5',screen:'#f0f0f0'},
  pizza:{edge:'#302820',face:'#594632',screen:'#29231c'},
  cyberpunk:{edge:'#172c36',face:'#304e59',screen:'#0b1c24'},
  lilgotchi:{edge:'#e7c88d',face:'#fff0cc',screen:'#20281d'},
};

export function launcherArt(family, state, { fit = false } = {}) {
  const sprites=family==='lilgotchi'?lilgotchiSprites:family==='slice'?sliceSprites:family==='cyberpunk'?cyberpunkSprites:classicSprites;
  const palette=family==='lilgotchi'?lilgotchiPalette:family==='slice'?slicePalette:family==='cyberpunk'?cyberpunkPalette:['','#b4ce83'];
  const preview=family==='slice'||family==='cyberpunk'?'tamatchi':getCharacter(family)?.character||'egg';
  const identity=state?.character && Object.hasOwn(sprites,state.character)?state.character:preview;
  const pixels=sprites[identity].idle1;
  const rects=pixels.flatMap((row,y)=>row.flatMap((color,x)=>color?[`<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[color]||palette[1]}"/>`]:[])).join('');
  let viewBox=`0 0 ${pixels[0].length} ${pixels.length}`;
  if(fit){
    const occupied=pixels.flatMap((row,y)=>row.flatMap((color,x)=>color?[[x,y]]:[]));
    if(occupied.length){
      const xs=occupied.map(([x])=>x),ys=occupied.map(([,y])=>y);
      const left=Math.min(...xs),top=Math.min(...ys);
      const width=Math.max(...xs)-left+1,height=Math.max(...ys)-top+1;
      const side=Math.max(width,height)+2;
      viewBox=`${left-(side-width)/2} ${top-(side-height)/2} ${side} ${side}`;
    }
  }
  return `<svg aria-hidden="true" viewBox="${viewBox}" shape-rendering="crispEdges">${rects}</svg>`;
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
export function launcherIcon(family,state,{shell=true,eink=false}={}) {
  if(!shell)return `${launcherArt(family,state,{fit:true})}<span class="launcher-label">lilgotchi</span>`;
  const skin=getCharacter(family)?.skin||'classic';
  const colors=shellColors[skin==='classic'&&eink?'eink':skin]||shellColors.classic;
  let pet=launcherArt(family,state,{fit:true}).replace('<svg ', '<svg x="5" y="8" width="14" height="14" ');
  if(skin==='classic')pet=pet.replaceAll('#b4ce83',eink?'#111':'#0f380f');
  return `<svg aria-hidden="true" viewBox="0 0 24 28" shape-rendering="crispEdges"><path fill="${colors.edge}" d="M9 1h6v2h3v3h2v4h2v10h-2v4h-4v2H8v-2H4v-4H2V10h2V6h2V3h3z"/><path fill="${colors.face}" d="M9 3h5v2h3v4h2v10h-2v4H8v-2H5V10h2V6h2z"/><path fill="${colors.screen}" d="M6 8h12v14H6z"/>${pet}</svg>`;
}
