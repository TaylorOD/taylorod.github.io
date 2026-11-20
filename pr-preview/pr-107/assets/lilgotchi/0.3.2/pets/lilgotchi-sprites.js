// The logo egg grows without turning into a different creature.
export const lilgotchiPalette = ['', '#fff0cc', '#e7c88d', '#6c8060'];
export const lilgotchiNames = {egg:'Little Egg',babytchi:'Lilgotchi',marutchi:'Lilgotchi',tamatchi:'Lilgotchi',kuchitamatchi:'Lilgotchi',mametchi:'Lilgotchi',ginjirotchi:'Lilgotchi',maskutchi:'Lilgotchi',kuchipatchi:'Lilgotchi',nyorotchi:'Lilgotchi',tarakotchi:'Lilgotchi',oyajitchi:'Elder Lilgotchi'};
const freeze = matrix => Object.freeze(matrix.map(row=>Object.freeze(row)));
function canvas(rows,height=12) {
  if(rows.length>height || rows.some(row=>row.length>12))throw new Error('Lilgotchi art exceeds its canvas');
  return [...Array(height-rows.length).fill(''),...rows].map(row=>[...row.padEnd(12,'0')].map(Number));
}
const small=['000002200000','000021120000','000211112000','000211112000','000022220000'];
const baby=['000002200000','000021120000','000211112000','002111111200','002111111200','000211112000','000022220000'];
const child=['000002200000','000021120000','000211112000','002111111200','002111111200','021111111120','021111111120','002111111200','000222222000'];
const teen=['000002200000','000021120000','000211112000','002111111200','002111111200','021111111120','021111111120','021111111120','002111111200','000222222000'];
const adult=['000002200000','000021120000','000211112000','002111111200','002111111200','021111111120','021111111120','021111111120','021111111120','021111111120','002111111200','000222222000'];
const elder=[...adult];
elder[1]='000023120000';elder[2]='000211312000';elder[3]='002113111200';
const drawings={babytchi:{rows:baby,face:[4,7]},marutchi:{rows:child,face:[4,6]},tamatchi:{rows:teen,face:[4,6]},kuchitamatchi:{rows:teen,face:[3,6]},mametchi:{rows:adult,face:[4,6]},ginjirotchi:{rows:adult,face:[3,6]},maskutchi:{rows:adult,face:[4,7]},kuchipatchi:{rows:adult,face:[3,7]},nyorotchi:{rows:teen,face:[4,5]},tarakotchi:{rows:adult,face:[4,5]},oyajitchi:{rows:elder,face:[4,7]}};
const faces={idle1:['30003','00000','00300'],idle2:['30003','00000','03330'],happy:['03030','30003','03330'],sad:['00000','30003','03030'],eat:['30003','00300','03330'],sleep:['00000','33033','00000']};
function body({rows,face:[x,y]},expression) {
  const matrix=canvas(rows);
  faces[expression].forEach((row,dy)=>[...row].forEach((value,dx)=>{
    if(value!=='0')matrix[y+dy][x+dx]=Number(value);
  }));
  return freeze(matrix);
}
export const lilgotchiSprites=Object.freeze({
  egg:Object.freeze({idle1:freeze(canvas(small,10)),idle2:freeze(canvas(small.map(row=>'0'+row.slice(0,-1)),10))}),
  ...Object.fromEntries(Object.entries(drawings).map(([name,drawing])=>[name,Object.freeze(Object.fromEntries(Object.keys(faces).map(expression=>[expression,body(drawing,expression)])))]))
});
