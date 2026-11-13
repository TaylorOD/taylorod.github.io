import {cleanColors,resolvedColors} from '../pets/colors.js';
export function mountColorControls(container,onChange){
  const doc=container.ownerDocument,fields={};
  const title=doc.createElement('strong');title.textContent='Pet colors';
  const hint=doc.createElement('p');hint.textContent='Choose colors for this family.';
  container.append(title,hint);
  for(const [key,label] of [['shell','Handheld color'],['screen','Screen color']]){
    const row=doc.createElement('label');row.className='color-choice';row.textContent=label;
    const input=doc.createElement('input');input.type='color';input.setAttribute('aria-label',label);
    input.addEventListener('input',()=>onChange(cleanColors({shell:fields.shell.value,screen:fields.screen.value})));
    fields[key]=input;row.append(input);container.append(row);
  }
  const reset=doc.createElement('button');reset.type='button';reset.textContent='Return to default colors';reset.addEventListener('click',()=>onChange({}));container.append(reset);
  return {update(family,colors){const resolved=resolvedColors(family,colors);for(const key of Object.keys(fields))fields[key].value=resolved[key];}};
}
