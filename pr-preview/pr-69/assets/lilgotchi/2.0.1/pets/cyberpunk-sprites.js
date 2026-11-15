import { originalCypunk } from './cypunk-original.js';
const palette = ['', '#d9fcff', '#102238', '#22dbe7', '#ec4cb4', '#53718c', '#70f79a', '#f4d45b', '#a97ef5', '#3569c8'];
const expressions = {
  idle1:['101','000','010'], idle2:['101','000','111'],
  happy:['101','000','101'], sad:['000','101','010'],
  eat:['101','010','111'], sleep:['000','101','000'],
  lookLeft:['110','100','010'],lookRight:['011','001','010'],lookUp:['101','000','010'],
};
const drawings = [
  {id:'egg',name:'Binary Seed',stage:'egg',rows:['000033330000','000322223000','003212122300','032112122230','032212112230','032212122230','032111122230','003222222300','000333333000','000000000000']},
  {id:'babytchi',name:'Bit',stage:'baby',face:[4,6],rows:['000000000000','000000000000','000000000000','000333330000','003222223000','003222223000','003222223000','003222223000','003222223000','000333330000','000320230000','000330330000']},
  {id:'marutchi',name:'Byte',stage:'child',face:[4,5],rows:['000004000000','000003000000','003333333000','032222222300','032222222300','332222222330','322222222230','332222222330','032222222300','003333333000','000320230000','000330330000']},
  {id:'tamatchi',name:'Compiler',stage:'teen',face:[4,5],rows:['000033330000','000322223000','003222222300','003333333300','003222222300','033222222330','032222222230','003222222300','000344430000','000322230000','003300033000','003000003000']},
  {id:'kuchitamatchi',name:'Syntax Error',stage:'teen',face:[4,5],rows:['000440000000','000030330000','000333223000','043222222300','003222222300','003222222340','003222222300','003222222300','000334433000','003220030000','000330233000','000030003000']},
  {id:'mametchi',name:'JavaScript',stage:'adult',face:[4,3],faceWidth:5,rows:['000070070000','000333333300','003222222230','003222222230','003222222230','003333333330','073032230370','033037730330','000032230000','000032230000','000032023000','000333033300']},
  {id:'ginjirotchi',name:'Sentinel',stage:'adult',original:true},
  {id:'maskutchi',name:'Matrix',stage:'adult',face:[4,3],faceWidth:5,rows:['000060060000','000666666600','006222222260','006222222260','006222222260','066666666660','062062260260','066061160660','000062260000','000061260000','000062026000','000666066600']},
  {id:'kuchipatchi',name:'404',stage:'adult',face:[4,3],faceWidth:5,rows:['000440000000','000033333300','003222222230','003222222230','003222222230','003333333330','003032230300','043032230340','003034430300','000032230000','000032023000','000333033300']},
  {id:'nyorotchi',name:'MissingNumber',stage:'adult',face:[4,5],rows:['033000000000','032300040000','033330033000','032233322300','043222222330','003222222230','033222222300','032222222330','033444333030','000322233000','000033003300','000330000030']},
  {id:'tarakotchi',name:'Blue Screen',stage:'adult',face:[3,3],faceWidth:5,background:9,rows:['055555555550','559999999955','599999999995','599999999995','599999999995','599999999995','559999999955','055555555550','033053350330','000052250000','000032023000','000333033300']},
  {id:'oyajitchi',name:'Glitch Elder',stage:'adult',face:[4,4],rows:['003000004000','004033330000','000322223300','043222222300','003222222340','003222222300','003222222300','000334443330','043222230000','000322223040','003330033000','000300003300']},
];
function canvas(rows) {
  if(rows.length>12||rows.some(row=>row.length>12))throw new Error('Proposal exceeds 12 by 12');
  return [...Array(12-rows.length).fill(''),...rows].map(row=>[...row.padEnd(12,'0')].map(Number));
}
function draw(definition,expression) {
  if(definition.id==='egg')return originalCypunk.egg[expression];
  if(definition.original){
    if(!expression.startsWith('look'))return originalCypunk.mametchi[expression];
    const frame=originalCypunk.mametchi.idle1.map(row=>[...row]);
    for(let y=3;y<=5;y++)for(let x=3;x<=8;x++)frame[y][x]=2;
    if(expression==='lookUp'){frame[2][4]=3;frame[2][7]=3;frame[4][5]=1;return frame;}
    const left=expression==='lookLeft',x=left?3:6;
    frame[3][x]=3;frame[3][x+2]=3;
    frame[4][left?3:8]=3;frame[5][left?4:7]=1;
    return frame;
  }
  const pixels=canvas(definition.rows);
  if(definition.face){
    const [x,faceY]=definition.face,y=faceY-(expression==='lookUp'?1:0);
    const wide={idle1:['10001','00000','00100'],idle2:['10001','00000','01110'],happy:['01010','10001','01110'],sad:['00000','10001','01110'],eat:['10001','00100','01110'],sleep:['00000','11011','00000'],lookLeft:['10100','10000','01000'],lookRight:['00101','00001','00010'],lookUp:['10001','00000','00100']};
    const face=definition.faceWidth===5?wide[expression]:expressions[expression];
    face.forEach((row,dy)=>[...row].forEach((pixel,dx)=>{
      pixels[y+dy][x+dx]=pixel==='1'?(definition.ink||1):(definition.background||2);
    }));
  }
  // Small antenna and code movements keep the face and silhouette steady.
  if(expression==='idle2'){
    if(definition.id==='egg')pixels[9][7]=4;
    else if(definition.id==='maskutchi'){pixels[8][5]=1;pixels[9][5]=2;}
    else if(definition.id==='oyajitchi'){pixels[0][8]=0;pixels[0][9]=4;}
    else if(definition.id==='nyorotchi'){pixels[1][7]=0;pixels[1][8]=4;}
  }
  return pixels.map(Object.freeze);
}
const artwork = {
  type:'Cypunk', palette,
  pets:drawings.map(definition=>({
    id:definition.id,name:definition.name,stage:definition.stage,
    frames:Object.fromEntries((definition.stage==='egg'?['idle1','idle2']:Object.keys(expressions)).map(expression=>[expression,draw(definition,expression)])),
  })),
};

const freezeFrame=frame=>Object.freeze(frame.map(row=>Object.freeze([...row])));
export const cyberpunkPalette=Object.freeze(artwork.palette);
export const cyberpunkNames=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,pet.name])));
export const cyberpunkSprites=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,Object.freeze(Object.fromEntries(Object.entries(pet.frames).map(([key,frame])=>[key,freezeFrame(frame)])))])));
