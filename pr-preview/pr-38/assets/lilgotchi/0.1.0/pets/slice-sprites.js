// Each silhouette is drawn by hand. Face stamps are placed on complete canvases.
export const slicePalette = ['', '#fff0c2', '#b96b32', '#ffd15a', '#cf432f', '#38271f', '#347743'];
export const sliceNames = {egg:'Dough',babytchi:'Dough Drop',marutchi:'Pizza Round',tamatchi:'Little Slice',kuchitamatchi:'Folded Slice',mametchi:'Margherita',ginjirotchi:'Pepperoni',maskutchi:'Calzone',kuchipatchi:'Deep Dish',nyorotchi:'Cheese Pull',tarakotchi:'Crispy Slice',oyajitchi:'Pizza Chef'};
const freeze = matrix => Object.freeze(matrix.map(row=>Object.freeze(row)));
const canvas = (rows,height=12) => {
  if(rows.length>height || rows.some(row=>row.length>12)) throw new Error('Slice art exceeds its canvas');
  return [...Array(height-rows.length).fill(''),...rows].map(row=>[...row.padEnd(12,'0')].map(Number));
};
// Face position is the upper left of a five by three expression area.
const drawings = {
  babytchi: {face:[4,7], rows:['000005550','0000511150','00051111150','00051111150','00051111150','0000511150','0000550550']},
  marutchi: {face:[4,6], rows:['0000555500','005522225500','052444444250','524333333425','523333333325','052333333250','005522225500','000550055000']},
  tamatchi: {face:[4,5], rows:['005555555500','052222222250','005333333500','005333333500','000533335000','000533335000','000053350000','000053350000','000005500000','000055055000']},
  kuchitamatchi: {face:[4,5], rows:['000055555000','000522222500','005333332500','053333332500','053333332500','005333325000','000533325000','000053325000','000005335000','000055005500']},
  mametchi: {face:[4,5], rows:['000555555000','005222222500','005333363500','005333663500','005333333500','000533335000','000533335000','000053350000','000053350000','000005500000','000055055000']},
  ginjirotchi: {face:[4,5], rows:['055555555550','522222222225','053443344350','053443344350','005333333500','005333333500','000534435000','000053350000','000005500000','000550055000']},
  maskutchi: {face:[4,6], rows:['000055550000','000522225000','005211112500','052111111250','052111111250','052111111250','005211112250','000522222250','000055555500','000055005500']},
  kuchipatchi: {face:[4,6], rows:['005555555500','052444444250','523333333325','523333333325','523333333325','052222222250','005222222500','000555055500']},
  nyorotchi: {face:[4,4], rows:['000555555000','000522225000','000533335000','000533335000','000533335000','000053350000','000053350000','000005350000','000005350000','000053500000','000053550000','000005555000']},
  tarakotchi: {face:[4,5], rows:['005550555000','052225222550','523333333225','053443333350','005333333350','005333333500','000533335000','000052350000','000052250000','000555055500']},
  oyajitchi: {face:[4,6], rows:['000055555000','000511111500','000511111500','000051115000','000552225500','005211111250','005111111250','005111111250','005155555250','000522222500','000055555000','000055005500']}
};
const faces = {idle1:['50005','00000','00500'],idle2:['50005','00000','05550'],happy:['05050','50005','05550'],sad:['00000','50005','05550'],eat:['50005','00500','05550'],sleep:['00000','55055','00000']};
function body({rows,face:[x,y]},key) {
  const matrix=canvas(rows);
  // Transparent stamp cells retain the dough, cheese and toppings below them.
  faces[key].forEach((row,dy)=>[...row].forEach((value,dx)=>{if(value!=='0')matrix[y+dy][x+dx]=Number(value);}));
  if(key==='idle2') {
    // A toe step changes the stance without moving the shared foot anchor.
    const foot=matrix[11].findIndex(value=>value===5);
    if(foot>0) { matrix[11][foot]=0; matrix[11][foot-1]=5; }
  }
  return freeze(matrix);
}
export const sliceSprites = Object.freeze({
  egg:Object.freeze({
    idle1:freeze(canvas(['000000000000','000000000000','000005550000','000551115500','005111111150','051111111115','051111111115','005555555550'],10)),
    idle2:freeze(canvas(['000000000000','000005550000','000551115500','005111111150','005111111150','051111111115','051111111115','005555555550'],10))
  }),
  ...Object.fromEntries(Object.entries(drawings).map(([name,drawing])=>[name,Object.freeze(Object.fromEntries(Object.keys(faces).map(key=>[key,body(drawing,key)])))]))
});
