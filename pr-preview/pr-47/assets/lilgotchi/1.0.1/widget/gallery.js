import { catalog } from '../pets/catalog.js';
import { launcherArt } from './launcher.js';
const gallery=document.querySelector('.gallery');
const open=async id=>{
  const pet=document.querySelector('lil-gotchi');
  await pet.setCharacter(id);
  await pet.open();
};
for(const choice of catalog){
  const button=document.createElement('button');
  button.type='button';
  button.innerHTML=`${launcherArt(choice.id,{character:choice.id==='default'?'kuchipatchi':choice.id==='cyberpunk'?'ginjirotchi':'mametchi'},{fit:true})}<strong>${choice.name}</strong><span>${choice.stage==='egg'?'Starts as an egg':`Starts as ${choice.stage==='adult'?'an':'a'} ${choice.stage}`}</span>`;
  button.addEventListener('click',async()=>{
    await open(choice.id);
  });
  gallery.append(button);
}
