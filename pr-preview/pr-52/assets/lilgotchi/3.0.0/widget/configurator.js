import { resolvedColors } from '../pets/colors.js';
import { launcherIcon } from './launcher.js';
import { catalog } from '../pets/catalog.js';
import { installSnippet } from './install-snippet.js?v=3.0.0';
const form=document.querySelector('#setup');
const list=form.querySelector('.character-options');
for(const choice of catalog){
  const label=document.createElement('label');
  const input=document.createElement('input');input.type='checkbox';input.value=choice.id;input.checked=true;
  label.append(input,document.createTextNode(choice.name));list.append(label);
}
const first=form.querySelector('[name=first]'),code=form.querySelector('code'),copy=form.querySelector('.copy'),status=form.querySelector('.copy-status');
const colors={};
const colorFamily=form.elements.colorFamily;
colorFamily.replaceChildren(...catalog.map(choice=>new Option(choice.name,choice.id)));
function showColors(){
  const family=colorFamily.value,selected=resolvedColors(family,colors[family]);
  form.elements.shellColor.value=selected.shell;form.elements.screenColor.value=selected.screen;
  form.querySelector('.color-preview').innerHTML=launcherIcon(family,{character:'egg'},{colors:colors[family]});
}
colorFamily.addEventListener('change',showColors);
for(const name of ['shellColor','screenColor'])form.elements[name].addEventListener('input',()=>{
  colors[colorFamily.value]={shell:form.elements.shellColor.value,screen:form.elements.screenColor.value};showColors();update();
});
form.querySelector('.reset-colors').addEventListener('click',()=>{delete colors[colorFamily.value];showColors();update();});
showColors();
function update(){
  const all=form.querySelector('[name=roster]').value==='all';list.hidden=all;
  const chosen=all?catalog:catalog.filter(choice=>list.querySelector(`input[value="${choice.id}"]`).checked);
  const previous=first.value||'slice';first.replaceChildren(...chosen.map(choice=>new Option(choice.name,choice.id)));
  first.value=chosen.some(c=>c.id===previous)?previous:chosen[0]?.id||'';
  try{code.textContent=installSnippet({characters:all?'all':chosen.map(c=>c.id).join(','),character:first.value,placement:form.elements.placement.value,appearance:form.elements.appearance.value,launcher:form.elements.launcher.value,notifications:form.elements.notifications.value,colors});copy.disabled=false;status.textContent='';}
  catch{code.textContent='Choose at least one character.';copy.disabled=true;status.textContent='Choose at least one character to make your snippet.';}
}
form.addEventListener('change',update);
copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(code.textContent);status.textContent='Copied. Paste this into your page. No upload needed.';}
  catch{status.textContent='Copy is unavailable here. Select the code above and copy it manually.';}
});
update();
