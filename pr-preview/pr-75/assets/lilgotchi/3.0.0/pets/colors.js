export const petColors=Object.freeze({
  default:{shell:'#b94f63',screen:'#cbdca6'},
  original2:{shell:'#697ec2',screen:'#c0dce6'},
  slice:{shell:'#839c98',screen:'#648e97'},
  cyberpunk:{shell:'#304e59',screen:'#0b1c24'},
  lilgotchi:{shell:'#fff0cc',screen:'#20281d'},
});
export const validColor=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value);
export function cleanColors(value){
  const result={};
  for(const key of ['shell','screen'])if(validColor(value?.[key]))result[key]=value[key].toLowerCase();
  return result;
}
export function cleanColorMap(value){
  const result={};
  for(const family of Object.keys(petColors)){
    const colors=cleanColors(value?.[family]);
    if(Object.keys(colors).length)result[family]=colors;
  }
  return result;
}
export function readColorMap(value){try{return cleanColorMap(JSON.parse(value));}catch{return {};}}
export function resolvedColors(family,overrides={}){return {...petColors[family]||petColors.default,...cleanColors(overrides)};}
export function shade(color,amount){
  return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(color.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');
}
export function screenInk(color){
  const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]>.179?'#142019':'#f4f7ee';
}
export function applyPetColors(root,family,overrides={}){
  const custom=cleanColors(overrides),colors=resolvedColors(family,custom);
  const classic=family==='default'||family==='original2';
  for(const property of ['--device-bg','--lcd-bg','--lcd-fg'])root.style.removeProperty(property);
  if(root.classList.contains('eink'))return;
  if(classic||custom.shell)root.style.setProperty('--device-bg',`linear-gradient(145deg,${shade(colors.shell,22)},${shade(colors.shell,-24)})`);
  if(classic||custom.screen){root.style.setProperty('--lcd-bg',colors.screen);root.style.setProperty('--lcd-fg',screenInk(colors.screen));}
}
