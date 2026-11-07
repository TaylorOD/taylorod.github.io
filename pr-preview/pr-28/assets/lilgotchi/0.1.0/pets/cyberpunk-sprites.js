// Complete padded canvases keep antennae, wheels and cables inside every pose.
export const cyberpunkPalette = Object.freeze(['', '#d9fcff', '#102238', '#22dbe7', '#ec4cb4', '#53718c']);
export const cyberpunkNames = Object.freeze({egg:'Binary Seed',babytchi:'Bit',marutchi:'Byte',tamatchi:'Runner',kuchitamatchi:'Glitch',mametchi:'Sentinel',ginjirotchi:'Courier',maskutchi:'Ghost',kuchipatchi:'Tank',nyorotchi:'Wire',tarakotchi:'Scrap',oyajitchi:'Mainframe'});
const freeze = matrix => Object.freeze(matrix.map(row=>Object.freeze(row)));
const canvas = (rows,height=12) => {
  if(rows.length>height || rows.some(row=>row.length>12)) throw new Error('Cyberpunk art exceeds its canvas');
  return [...Array(height-rows.length).fill(''),...rows].map(row=>[...row.padEnd(12,'0')].map(Number));
};
// Each face lives inside a five by three dark panel on its own silhouette.
const drawings = {
  babytchi:{face:[4,6],rows:['000333333300','000322222300','000322222300','000322222300','000333333300','000032023000','000033033000']},
  marutchi:{face:[4,6],rows:['000004000000','000003000000','003333333330','032222222223','032222222223','032222222223','033335333333','000320023000','000330033000']},
  tamatchi:{face:[4,3],rows:['000033333000','000322222300','000322222300','000322222300','000033333000','004032230400','003332233300','000032230000','000032230000','000032023000','000033033000']},
  kuchitamatchi:{face:[4,4],rows:['000440000000','000030000000','000333333000','003222222300','003222222300','003222222300','004333333330','003032222030','000032233000','000032030000','000333033300']},
  mametchi:{face:[4,3],rows:['000030030000','000333333300','003222222230','003222222230','003222222230','333333333333','322032230223','033032230330','000034430000','000032230000','000032023000','000333033300']},
  ginjirotchi:{face:[4,5],rows:['000333333000','003222222300','032222222230','032222222230','032222222230','003344443300','003222222300','003330333000','032230322300','003330333000']},
  maskutchi:{face:[4,4],rows:['000003300000','000033330000','000332233000','003322223300','033222222330','032222222230','032222222230','032222222230','032222222230','032444444230','033300003330','003300003300']},
  kuchipatchi:{face:[4,6],rows:['000004400000','000003300000','033333333330','322222222223','322222222223','322222222223','033344443330','332332332333','323223223223','333333333333']},
  nyorotchi:{face:[4,1],rows:['000333333300','000322222300','000322222300','000322222300','000333333300','000000430000','000003430000','000034300000','000043000000','000034300000','000003430000','000033333000']},
  tarakotchi:{face:[4,4],rows:['003333333300','003244222300','003244222300','003222222300','443222222333','233222222323','003333333323','003225222330','003333333000','000320023000','003330033330']},
  oyajitchi:{face:[4,5],rows:['003003003000','004004004000','003333333300','003222222300','033222222330','032222222230','032222222230','032222222230','033344443330','003225222300','003333333300','000333033300']}
};
const faces = {idle1:['30003','00000','00100'],idle2:['30003','00000','01110'],happy:['03030','30003','01110'],sad:['00000','30003','04440'],eat:['30003','00100','01310'],sleep:['00000','55055','00000']};
function body({rows,face:[x,y]},key) {
  const matrix=canvas(rows);
  faces[key].forEach((row,dy)=>[...row].forEach((value,dx)=>{matrix[y+dy][x+dx]=value==='0'?2:Number(value);}));
  if(key==='idle2') {
    const foot=matrix[11].findIndex(value=>value===3);
    if(foot>0) {matrix[11][foot]=0;matrix[11][foot-1]=3;}
  }
  return freeze(matrix);
}
// Both boot poses retain the readable three by five 0 and 1 glyphs.
const seed = ['000333333000','003222222300','032111221230','032121211230','032121221230','032121221230','032111211130','003222222300','000333333000'];
const boot=canvas(seed,10);
const boot2=boot.map(row=>[...row]);
boot2[8][4]=4;boot2[8][7]=3;
export const cyberpunkSprites = Object.freeze({
  egg:Object.freeze({idle1:freeze(boot),idle2:freeze(boot2)}),
  ...Object.fromEntries(Object.entries(drawings).map(([name,drawing])=>[name,Object.freeze(Object.fromEntries(Object.keys(faces).map(key=>[key,body(drawing,key)])))]))
});
