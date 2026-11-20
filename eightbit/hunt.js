export const discoveries = [
  {id:'lilgotchi',event:'books',room:'cabin',x:410,y:255,hint:'someone small is reading in the house. look closely at the bookshelf.'},
  {id:'slice',event:'delivery',room:'town',x:552,y:622,hint:'the neighbor on the bench ordered dinner. bring the pizza from the arcade.'},
  {id:'cypunk',event:'find:cypunk',room:'arcade',x:225,y:337,hint:'listen with your eyes. a tiny friend is hiding beside the pinball tables.'},
  {id:'original',event:'find:original',room:'town',x:336,y:644,hint:'take the upper river path west of the bridge. check behind the leafy tree.'},
];

export function restoreDiscoveries(saved,pet) {
  const found=Array.isArray(saved.found)?saved.found.filter(id=>discoveries.some(d=>d.id===id)):[];
  if(saved.adopted===true) found.push(pet);
  if(saved.pizza==='delivered') found.push('slice');
  return [...new Set(found)];
}

export function discover(progress,event) {
  const match=discoveries.find(d=>d.event===event);
  if(!match||(event==='delivery'&&progress.pizza!=='delivered')||progress.found.includes(match.id)) return null;
  progress.found.push(match.id);
  if(!progress.adopted) {progress.pet=match.id;progress.adopted=true;}
  return match;
}
