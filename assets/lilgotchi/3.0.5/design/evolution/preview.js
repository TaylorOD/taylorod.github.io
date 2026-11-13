import {proposal as slice} from './slice.js';
import {proposal as cypunk} from './cypunk.js';
import {proposal as lilgotchi} from './lilgotchi.js';
import {classicSprites} from '../../pets/classic-sprites.js';
import {originalSprites} from '../../pets/original-sprites.js';
import {p1Stages,p2Stages} from '../../pets/original-roster.js';
const original={type:'Gen 1',palette:['','#b4ce83']};
const original2={type:'Gen 2',palette:['','#b4ce83']};
const proposals={original,original2,slice,cypunk,lilgotchi};
let selected=new URLSearchParams(location.search).get('family')||'slice';
if(!proposals[selected])selected='slice';
const early=['90 second hatch','Baby','Child','0 or 1 care mistakes','2+ care mistakes'];
const adultRoutes=[
  'Smooth teen · ≤2 mistakes + 100% discipline',
  'Smooth teen · ≤2 mistakes + 75–99% discipline',
  'Smooth teen · ≤4 mistakes + ≥50% discipline, after earlier checks fail',
  'Smooth teen · remaining ≥50% discipline. Rough teen · ≥75%',
  'Smooth teen · 25–49% discipline. Rough teen · 50–74%',
  'Smooth teen · below 25% discipline. Rough teen · below 50%',
];
function sprite(pet,palette,expression){
  const frame=pet.frames[expression]||pet.frames.idle1;
  return `<svg viewBox="-1 -1 ${frame[0].length+2} ${frame.length+2}" role="img" aria-label="${pet.name}" shape-rendering="crispEdges">${frame.flatMap((row,y)=>row.map((pixel,x)=>pixel?`<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[pixel]}"/>`:'')).join('')}</svg>`;
}
function render(){
  const {type,pets,palette}=proposals[selected];
  const expression=document.querySelector('#expression').value;
  if(selected==='original'||selected==='original2'){
    const stages=selected==='original'?p1Stages:p2Stages;
    const hidden=selected==='original'?['oyajitchi','bill']:['sekitoritchi','charitchi','zatchi'];
    const sections=[['growing up',[...stages.egg,...stages.baby,...stages.child,...stages.teen]],['adults',stages.adult.filter(id=>!hidden.includes(id))],['hidden',hidden]];
    document.querySelector('#review').innerHTML=`<h2>${type}: the full lineup</h2><p class="note">Gen 1 and Gen 2 source pixels, including regional characters. Both families use lilgotchi care timing and adapted growth paths.</p>`+sections.map(([stage,ids])=>`<h2>${stage[0].toUpperCase()+stage.slice(1)}</h2><div class="grid adults">${ids.map(id=>{
      const pet={id,name:id==='egg'?'Egg':id[0].toUpperCase()+id.slice(1),frames:originalSprites[id]||classicSprites[id]};
      return `<article><span class="stage">${Object.entries(stages).find(([,ids])=>ids.includes(id))[0]}</span>${sprite(pet,palette,expression)}<h3>${pet.name}</h3><span class="original">${id}</span></article>`;
    }).join('')}</div>`).join('');
    document.querySelector('#details').href='../../docs/characters.md';
    document.querySelectorAll('[data-type]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.type===selected)));
    return;
  }
  function card(pet,route){return `<article><span class="stage">${pet.stage}</span>${sprite(pet,palette,expression)}<h3>${pet.name}</h3><p class="route">${route}</p><span class="original">${pet.id}</span></article>`;}
  document.querySelector('#review').innerHTML=`<h2>${type}: growing up</h2><div class="grid growing">${pets.slice(0,5).map((pet,i)=>card(pet,early[i])).join('')}</div><h2>Six adult possibilities</h2><p class="note">“Smooth teen” is ${pets[3].name}. “Rough teen” is ${pets[4].name}. Conditions are checked in order.</p><div class="grid adults">${pets.slice(5,11).map((pet,i)=>card(pet,adultRoutes[i])).join('')}</div><h2>A special elder</h2><article class="elder">${sprite(pets[11],palette,expression)}<div><h3>${pets[7].name} → ${pets[11].name}</h3><p>Age 10 or older, alive and 100% discipline. A 5% chance each eligible simulation tick. Other adults do not take this path.</p><span class="original">maskutchi → oyajitchi</span></div></article>`;
  document.querySelector('#details').href=selected==='original'?'../../docs/characters.md':`${selected}.md`;
  document.querySelectorAll('[data-type]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.type===selected)));
}
document.querySelectorAll('[data-type]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.type;render();}));
document.querySelector('#expression').addEventListener('change',render);
render();
