const palette=['','#fff0c2','#b96b32','#ffd15a','#cf432f','#38271f','#5f9c58','#dfb889','#ffe66a','#92acb8','#b975c5','#713c24','#9e3028'];
const drawings=[
 ['egg','Dough','egg',[4,6],['000000000000','000000000000','000055550000','000511115000','005111111500','005111111500','000511115000','000055550000']],
 ['babytchi','Dough Drop','baby',[4,6],['000005500000','000051150000','000511115000','005111111500','005111111500','005111111500','000511115000','000051150000','000055055000']],
 ['marutchi','Pizza Puff','child',[4,6],['000055550000','000522225000','005233332500','052443344250','052333333250','523333333325','523333333325','052333333250','005222222500','000550055000']],
 ['tamatchi','Little Slice','teen',[4,5],['005555555500','052222222250','005333333500','005333333500','000533335000','000533335000','000053350000','000053350000','000005500000','000055055000']],
 ['kuchitamatchi','Folded Slice','teen',[4,5],['000055555000','000522222500','005333332500','053333332500','053333332500','005333325000','000533325000','000053325000','000005335000','000055005500']],
 ['mametchi','Margherita','adult',[4,5],['055555555550','522222222225','052222222250','053114461350','053114461350','005333113500','005333333500','000533335000','005314613500','000534435000','000056150000','000005500000','000055055000']],
 ['ginjirotchi','Pepperoni','adult',[4,5],['055555555550','522222222225','052222222250','053443344350','053443344350','005333333500','005333333500','000533335000','005344333500','000534435000','000054450000','000005500000','000055055000']],
 ['maskutchi','BBQ Chicken','adult',[4,5],['005555555500','052222222250','052222222250','05377BAA7350','053BB7A7B350','005A33733500','005333333500','0053333B3500','0005377A5000','00537AB33500','00005BB50000','000053350000','000005500000','000055055000']],
 ['kuchipatchi','Meat Lovers','adult',[4,6],['005555555500','052222222250','522222222225','5244BB3BB425','5234BB3BB325','52C333333C25','52C333333C25','523333333325','5244C3BB4325','523BC33BC325','052222222250','005555555500','000550055000']],
 ['nyorotchi','Anchovy','adult',[4,5],['000555555000','005222222500','005393339500','005339993500','005333993500','005393339500','005333333500','000533335000','000539935000','000539335000','000053950000','000053350000','000005500000','000055055000']],
 ['tarakotchi','Pineapple','adult',[4,5],['005555555500','052222222250','052222222250','05188C188150','05188C188150','005133133500','005333333500','0053333C1500','000531885000','00538C133500','00005C850000','000053150000','000005500000','000055055000']],
 ['oyajitchi','Spoiled Slice','adult',[4,5],['005555555500','052222222250','052222222250','051166111150','005166611500','005111111500','005111111500','000511115000','000516615000','000516115000','000051150000','000051150000','000005155000','000055055000']],
];
const faces={idle1:['505','000','050'],idle2:['505','000','555'],happy:['050','505','555'],sad:['000','505','050'],eat:['505','050','555'],sleep:['000','505','000'],lookLeft:['550','500','050'],lookRight:['055','005','050'],lookUp:['505','000','050']};
function canvas(rows){
 if(rows.length>14||rows.some(row=>row.length>12))throw new Error('Slice proposal exceeds its display');
 return [...Array(Math.max(12,rows.length)-rows.length).fill(''),...rows].map(row=>[...row.padEnd(12,'0')].map(value=>parseInt(value,16)));
}
function pose(rows,face,expression){
 const pixels=canvas(rows);
 if(expression)faces[expression].forEach((row,dy)=>[...row].forEach((value,dx)=>{if(value!=='0')pixels[face[1]+dy-(expression==='lookUp'?1:0)][face[0]+dx]=Number(value);}));
 if(expression==='idle2'){
  const foot=pixels[pixels.length-1].findIndex(value=>value===5);
  if(foot>0){pixels[pixels.length-1][foot]=0;pixels[pixels.length-1][foot-1]=5;}
 }
 return pixels;
}
const artwork={type:'Slice',palette,pets:drawings.map(([id,name,stage,face,rows])=>({
 id,name,stage,
 frames:id==='egg'?{idle1:pose(rows,face),idle2:pose(rows.map(row=>'0'+row.slice(0,-1)),face)}:Object.fromEntries(Object.keys(faces).map(expression=>[expression,pose(rows,face,expression)]))
}))};

const freezeFrame=frame=>Object.freeze(frame.map(row=>Object.freeze([...row])));
export const slicePalette=Object.freeze(artwork.palette);
export const sliceNames=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,pet.name])));
export const sliceSprites=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,Object.freeze(Object.fromEntries(Object.entries(pet.frames).map(([key,frame])=>[key,freezeFrame(pet.id==='egg'?frame.slice(2):frame)])))])));
