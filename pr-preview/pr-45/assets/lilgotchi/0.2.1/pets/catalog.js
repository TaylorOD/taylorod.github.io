// Public choices share one identity map across the host and game frame.
const originalStages={babytchi:'baby',marutchi:'child',tamatchi:'teen',kuchitamatchi:'teen',mametchi:'adult',ginjirotchi:'adult',maskutchi:'adult',kuchipatchi:'adult',nyorotchi:'adult',tarakotchi:'adult',oyajitchi:'adult'};
export const catalog=Object.freeze([
  {id:'default',name:'Original egg',skin:'classic',character:'egg',stage:'egg'},
  ...Object.entries(originalStages).map(([id,stage])=>({id,name:id[0].toUpperCase()+id.slice(1),skin:'classic',character:id,stage})),
  {id:'slice',name:'Slice',skin:'pizza',character:'egg',stage:'egg'},
  {id:'cyberpunk',name:'Cypunk',skin:'cyberpunk',character:'egg',stage:'egg'},
].map(Object.freeze));
export const families=Object.freeze(catalog.map(choice=>choice.id));
export const legacyFamily=Object.freeze(Object.fromEntries(catalog.map(choice=>[choice.id,choice.skin])));
export const getCharacter=id=>catalog.find(choice=>choice.id===id);
export function allowedCharacters(value=null){
  if(value===null || value.trim()==='all')return [...families];
  const ids=[...new Set(value.trim().split(/[\s,]+/).filter(Boolean))];
  if(!ids.length || ids.some(id=>!families.includes(id)))throw new TypeError('Invalid characters setting. Use all or a list of available character IDs.');
  return ids;
}
export function requireAllowed(id,allowed){
  if(!families.includes(id))throw new TypeError('Unknown character');
  if(!allowed.includes(id))throw new TypeError('This character is not available on this site.');
  return id;
}
export const initialCharacter=(saved,requested,allowed)=>saved ? (allowed.includes(saved)?saved:allowed[0]) : (allowed.includes(requested)?requested:allowed[0]);
export function frameCharacter(params){
  const id=params.get('character');
  if(id!==null){
    const choice=getCharacter(id);
    if(!choice || (params.has('pet') && params.get('pet')!==choice.skin))throw new TypeError('Invalid game character configuration');
    return choice;
  }
  return getCharacter({classic:'default',pizza:'slice',cyberpunk:'cyberpunk'}[params.get('pet')]||'slice');
}
