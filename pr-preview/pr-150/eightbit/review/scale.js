import {applyPalette} from '../pixel-renderer.js';
import {models} from './model-catalog.js';
import {drawHuman,humanPose,playerLook,characterScale} from '../character-art.js';
import {looks,arcadeRegulars} from '../residents.js';
import {interactionPose,regularPose,drawFurnitureFront} from '../interaction-art.js';
import {loadInterior} from '../interior-view.js';
const $=id=>document.getElementById(id);
const image=await loadInterior('arcade');
const setup=id=>{const ctx=$(id).getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#496475';ctx.fillRect(0,0,$(id).width,$(id).height);ctx.font='16px monospace';return ctx;};
const label=(ctx,text,x,y)=>{ctx.fillStyle='#f8e7bd';ctx.fillText(text,x,y);};
const line=(ctx,x,y,w)=>{ctx.fillStyle='#6ba5a2';ctx.fillRect(x,y,w,1);};
const people=setup('people');line(people,20,240,1080);
const lineup=[['Taylor',playerLook],...looks.slice(0,6).map((look,i)=>[`Neighbor ${i+1}`,look]),['Bartender',looks[0]]];
lineup.forEach(([name,look],i)=>{drawHuman(people,{x:65+i*125,y:240,look,scale:2.6*(look.scale||1)});label(people,name,22+i*125,274);});
line(people,1012,240-60*2.6,90);line(people,1012,240-46*2.6,90);label(people,'60 now',1018,76);label(people,'46 before',1018,114);
const furniture=setup('furniture'),ground=290,adult=180;
const prop=(sx,sy,sw,sh,x,height)=>furniture.drawImage(image,sx*2,sy*2,sw*2,sh*2,x,ground-height,sw/sh*height,height);
drawHuman(furniture,{x:70,y:ground,scale:3});
prop(214,132,50,114,120,114/90*adult);label(furniture,'Rear cabinet',22,330);
drawHuman(furniture,{x:410,y:ground,scale:3});
prop(335,415,34,77,455,77/(60*characterScale('arcade',480))*adult);label(furniture,'Front counter',350,330);
drawHuman(furniture,{x:740,y:ground,scale:3,action:'cabinet',direction:'right'});
line(furniture,690,ground-16*3,125);label(furniture,'Seat meets hips',670,330);
line(furniture,20,ground,1080);
const rows=[['Town',60*characterScale('town',576),'Adult bodies stay consistent beside doors and neighbors'],['Arcade cabinets',90,'Hips at 232, stool top at 232'],['Arcade bar',60*characterScale('arcade',480),'Same scale for customer and bartender'],['House',60*characterScale('cabin',432),'Hands fixed to the keyboard'],['Roof',75,'Same body model with the roof scene scale']];
$('measurements').replaceChildren(...rows.map(([room,height,contact])=>{const row=document.createElement('tr');for(const value of [room,`${height.toFixed(1)} world pixels`,contact]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}return row;}));
const bar=setup('bar');bar.save();bar.scale(1.5,1.5);bar.translate(-90,-330);bar.drawImage(image,0,0,768,512);
const bartender={...regularPose(arcadeRegulars.find(r=>r.playing==='bar')),look:looks[0]},customer={...interactionPose('arcade',{id:'pizza'}),look:playerLook};
for(const actor of [bartender,customer]){drawHuman(bar,{...actor,scale:characterScale('arcade',actor.y),contacts:actor.hands});drawFurnitureFront(bar,'arcade',actor,image);}
bar.restore();

const cast=setup('cast');
models.forEach((model,i)=>{
  const x=112+(i%5)*224,y=170+Math.floor(i/5)*200;
  line(cast,x-100,y,200);cast.save();cast.translate(x,y);cast.scale(2,2);
  model.draw(cast,model.directions[0],model.id==='fisher'?'drift':model.actions[0],model.id==='fisher'?5200:0,'town');cast.restore();
  label(cast,model.name,x-100,y+28);
});

for(const ctx of [people,furniture,bar,cast]){
  const pixels=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
  applyPalette(pixels.data);ctx.putImageData(pixels,0,0);
}
