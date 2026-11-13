const palette=['','#fff0cc','#e7c88d','#435345','#c7dfcf','#dac9a5','#735443','#638b82','#fffbea'];
const expressions=['idle1','idle2','happy','sad','eat','sleep'];
const designs=[
  {id:'egg',name:'Little Egg',stage:'egg',widths:[2,4,6,6,4],fill:1,edge:2},
  {id:'babytchi',name:'Peep Egg',stage:'baby',widths:[2,4,6,8,8,6,4],fill:1,edge:2,face:8},
  {id:'marutchi',name:'Growing Egg',stage:'child',widths:[2,4,6,8,8,10,10,8,6],fill:1,edge:2,face:6},
  {id:'tamatchi',name:'Smooth Egg',stage:'teen',widths:[2,4,6,8,8,10,10,10,8,6],fill:1,edge:2,face:6,marks:[[4,3,8],[3,5,8]]},
  {id:'kuchitamatchi',name:'Speckled Egg',stage:'teen',widths:[2,4,6,8,8,10,10,10,8,6],fill:5,edge:2,face:6,marks:[[5,3,6],[3,5,6],[8,5,6],[3,8,6],[7,10,6]]},
  {id:'mametchi',name:'Duck Egg',stage:'adult',widths:[2,4,6,8,8,10,10,10,10,8,6],fill:4,edge:2,face:6,marks:[[4,3,8],[3,5,8],[8,9,1]]},
  {id:'ginjirotchi',name:'Quail Egg',stage:'adult',widths:[2,4,6,8,8,8,6,4],fill:5,edge:6,face:7,marks:[[5,5,6],[3,7,6],[8,7,6],[4,9,6],[7,10,6]]},
  {id:'maskutchi',name:'Goose Egg',stage:'adult',widths:[2,4,6,6,8,8,8,10,10,10,8,6],fill:8,edge:2,face:6,marks:[[4,3,1],[3,7,1],[8,9,1]]},
  {id:'kuchipatchi',name:'Jumbo Egg',stage:'adult',widths:[4,6,8,10,10,12,12,12,12,12,10,8],fill:1,edge:2,face:6,marks:[[3,3,8],[2,5,8],[2,6,8],[9,9,2]]},
  {id:'nyorotchi',name:'Golden Egg',stage:'adult',widths:[2,4,6,8,8,10,10,10,8,6],fill:2,edge:6,face:6,ink:6,marks:[[5,3,8],[4,4,8],[3,5,8],[3,6,1],[8,9,1]]},
  {id:'tarakotchi',name:'Century Egg',stage:'adult',widths:[2,4,6,8,10,10,10,10,8,6],fill:7,edge:6,face:6,ink:8,marks:[[5,3,4],[4,4,4],[3,5,4],[8,9,3]]},
  {id:'oyajitchi',name:'Cracked Elder',stage:'adult',widths:[2,4,6,6,8,8,8,10,10,10,8,6],fill:8,edge:2,face:6,marks:[[5,1,3],[6,2,3],[5,3,3],[6,4,3],[4,3,1],[3,7,1]]},
];
function draw(design,expression){
  const frame=Array.from({length:12},()=>Array(12).fill(0));
  const top=12-design.widths.length;
  design.widths.forEach((width,row)=>{
    const left=(12-width)/2;
    for(let x=left;x<left+width;x++)frame[top+row][x]=row===design.widths.length-1||x===left||x===left+width-1?design.edge:design.fill;
  });
  for(const [x,y,color] of design.marks||[])if(frame[y][x])frame[y][x]=color;
  if(design.stage==='egg'){
    if(expression==='idle2'){frame[8][5]=8;frame[8][6]=8;}
    return frame;
  }
  const y=design.face,ink=design.ink||3;
  const pixel=(x,dy,color=ink)=>{if(frame[y+dy]?.[x])frame[y+dy][x]=color;};
  if(expression==='happy'){
    pixel(4,0);pixel(3,1);pixel(5,1);pixel(7,0);pixel(6,1);pixel(8,1);pixel(5,2);pixel(6,2);
  }else if(expression==='sleep'){
    pixel(3,1);pixel(4,1);pixel(7,1);pixel(8,1);
  }else if(expression==='sad'){
    pixel(4,0);pixel(7,0);pixel(5,1);pixel(6,1);pixel(4,2);pixel(7,2);
  }else{
    pixel(4,0);pixel(7,0);
    if(expression==='eat'){pixel(5,1);pixel(6,1);pixel(5,2);pixel(6,2);}
    else if(expression==='idle2'){pixel(5,2);pixel(6,2);}
    else pixel(5,2);
  }
  if(design.id==='oyajitchi'){
    // A missing side shard opens into a long jagged crack beside the face.
    for(const [x,y] of [[8,2],[8,3],[7,3],[8,4],[9,4],[8,5]])frame[y][x]=0;
    for(const [x,y] of [[7,4],[7,5],[8,6],[9,7],[8,8],[9,9],[8,10]])frame[y][x]=3;
  }
  return frame;
}
const artwork={
  type:'Lilgotchi',palette,
  pets:designs.map(design=>({id:design.id,name:design.name,stage:design.stage,frames:Object.fromEntries((design.stage==='egg'?['idle1','idle2']:expressions).map(expression=>[expression,draw(design,expression)]))})),
};

const freezeFrame=frame=>Object.freeze(frame.map(row=>Object.freeze([...row])));
export const lilgotchiPalette=Object.freeze(artwork.palette);
export const lilgotchiNames=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,pet.name])));
export const lilgotchiSprites=Object.freeze(Object.fromEntries(artwork.pets.map(pet=>[pet.id,Object.freeze(Object.fromEntries(Object.entries(pet.frames).map(([key,frame])=>[key,freezeFrame(pet.id==='egg'?frame.slice(2):frame)])))])));
