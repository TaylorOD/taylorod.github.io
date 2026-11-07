import { catalog } from '../pets/catalog.js';
import { launcherArt } from './launcher.js';
const gallery=document.querySelector('.gallery');
for(const choice of catalog){
  const button=document.createElement('button');
  button.type='button';
  button.innerHTML=`${launcherArt(choice.id)}<strong>${choice.name}</strong><span>${choice.stage==='egg'?'Starts as an egg':`Starts as ${choice.stage==='adult'?'an':'a'} ${choice.stage}`}</span>`;
  button.addEventListener('click',async()=>{
    const pet=document.querySelector('lil-gotchi');
    await pet.setCharacter(choice.id);
    await pet.open();
  });
  gallery.append(button);
}
