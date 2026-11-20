import { catalog } from '../pets/catalog.js';
import { launcherArt } from './launcher.js';
import { update } from './configurator.js';
const gallery=document.querySelector('.gallery');
const open=async id=>{
  const pet=document.querySelector('lil-gotchi');
  const form=document.querySelector('#setup');
  if(!pet.allowed.includes(id))form.elements.roster.value='all';
  if(![...form.elements.first.options].some(option=>option.value===id))form.elements.first.add(new Option(catalog.find(choice=>choice.id===id).name,id));
  form.elements.first.value=id;
  await update();
  await pet.setCharacter(id);
  await pet.open();
};
for(const choice of catalog){
  const button=document.createElement('button');
  button.type='button';
  button.innerHTML=`${launcherArt(choice.id,{character:choice.id==='original2'?'mimitchi':choice.id==='default'?'kuchipatchi':choice.id==='cyberpunk'?'ginjirotchi':'mametchi'},{fit:true})}<strong>${choice.name}</strong><span>${choice.id==='slice'?'Starts as dough':choice.id==='cyberpunk'?'Starts as a binary seed':'Starts as an egg'}</span>`;
  button.addEventListener('click',async()=>{
    await open(choice.id);
  });
  gallery.append(button);
}
