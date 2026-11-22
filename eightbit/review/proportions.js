import {loadInterior} from '../interior-view.js';
import {bodyReference,sceneProfiles,sceneBodyScale,depthFactor,dimensionReport} from '../scale-rules.js';
import {landmarks} from '../scale-landmarks.js';
import {drawHuman,humanPose} from '../character-art.js';
import {scenes,isWalkable} from '../scenes.js';
import {interactionPose,drawFurnitureFront} from '../interaction-art.js';
import {models} from './model-catalog.js';
import {applyPalette} from '../pixel-renderer.js';
const $=id=>document.getElementById(id),images=new Map();
const text=(ctx,value,x,y)=>{ctx.fillStyle='#f8e7bd';ctx.font='16px monospace';ctx.fillText(value,x,y);};
const line=(ctx,x,y,w,color='#f8e7bd')=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,1);};
const palette=ctx=>{const pixels=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);applyPalette(pixels.data);ctx.putImageData(pixels,0,0);};
const setup=id=>{const ctx=$(id).getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#496475';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);return ctx;};
const ctx=setup('body');
for(const [x,label,proportions] of [[145,'Before',{...bodyReference,legUnits:23,torsoUnits:17}],[385,'Corrected',bodyReference]]){
  drawHuman(ctx,{x,y:240,scale:3,proportions});line(ctx,x-70,60,140);line(ctx,x-70,240,140);line(ctx,x-45,240-proportions.legUnits*3,90,'#e9b865');
  text(ctx,label,x-55,275);text(ctx,`legs ${proportions.legUnits} / torso ${proportions.torsoUnits}`,x-100,300);
}
for(const [i,direction] of ['left','right','up'].entries()){const x=650+i*145;drawHuman(ctx,{x,y:240,scale:3,direction});text(ctx,direction,x-30,275);}
palette(ctx);
const linked={cabinet:'lilgotchi',stool:'lilgotchi',bar:'pizza',poker:'poker',desk:'about',keyboard:'about',chair:'about',shelf:'books',bed:'pets','rear-guard':'view','front-guard':'photo','arcade-door':'arcade','wilma-door':'wilma','cabin-door':'cabin','shop-door':'runners','bench-seat':'bench',carousel:'carousel'};
function reach(room,point){
  const pose=interactionPose(room,point),body=humanPose(pose.direction,pose.action),scale=sceneBodyScale(room,pose.y)*depthFactor(room,pose.x,pose.y);
  return Math.max(0,...(pose.hands||[]).map(([x,y],i)=>Math.hypot((x-pose.x)/scale-(body.side?body.face*3:(i?1:-1)*body.width/2),(y-pose.y)/scale-body.shoulder-3)));
}
function cells(values){const row=document.createElement('tr');for(const value of values){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}return row;}
for(const item of landmarks){
  const report=dimensionReport(item),row=cells([`${item.room} / ${item.label}`,`${item.heightCm} cm`,item.confidence==='unknown'?'not verified':`${report.inferredCm.toFixed(1)} cm`,item.confidence==='unknown'?'unknown':`${(report.error*100).toFixed(0)}%`,item.confidence,report.status]);
  const button=document.createElement('button');button.dataset.object=item.id;button.textContent=`${item.room} / ${item.label}`;button.onclick=()=>{$('room').value=item.room;selectRoom(item.id);$('scene-art').scrollIntoView({block:'center'});};row.firstChild.replaceChildren(button);row.lastChild.className=report.status==='mismatch'?'bad':report.status==='within range'?'good':'';$('ledger').append(row);
}
for(const [room,scene] of Object.entries(scenes))for(const point of scene.points){
  const arm=reach(room,point),pose=interactionPose(room,point),row=cells([`${room} / ${point.id}`,isWalkable(scene,point.x,point.y)?'clear':'blocked',pose.hands?`${arm.toFixed(1)} / ${bodyReference.maxReachUnits} ${arm<=bodyReference.maxReachUnits?'within reach':'too far'}`:'no hand contact','']);
  const link=document.createElement('a');link.href=`stills.html?scene=${room}&point=${point.id}`;link.textContent='View pose and layers';row.lastChild.append(link);$('contacts').append(row);
}
for(const model of models)$('roster').append(cells([model.name,model.physicalReference,'design reference']));
async function paint(){
  const room=$('room').value,item=landmarks.find(item=>item.room===room&&item.id===$('object').value),report=dimensionReport(item),scene=scenes[room],canvas=$('scene-art');
  if(!images.has(room)){if(room==='town'){const image=new Image();image.src=new URL('../assets/town.png',import.meta.url).href;await image.decode();images.set(room,image);}else images.set(room,await loadInterior(room));}
  if(room!==$('room').value||item.id!==$('object').value)return;
  canvas.width=scene.width;canvas.height=scene.height;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(images.get(room),0,0,scene.width,scene.height);
  const scale=sceneBodyScale(room,item.ground[1])*depthFactor(room,...item.ground),x=item.ground[0],y=item.ground[1];
  ctx.save();ctx.globalAlpha=.6;drawHuman(ctx,{x:Math.min(scene.width-50,x+38),y,scale});ctx.restore();
  const ruler=(rx,top,color)=>{ctx.fillStyle=color;ctx.fillRect(rx,top,2,y-top);ctx.fillRect(rx-6,top,14,2);ctx.fillRect(rx-6,y,14,2);};ruler(x,item.top[1],'#ffffff');ruler(x-14,report.expected.y,'#e9b865');
  const point=scene.points.find(p=>p.id===linked[item.id]);
  if(point&&$('show-contact').checked){const pose=interactionPose(room,point);drawHuman(ctx,{...pose,scale:sceneBodyScale(room,pose.y)*depthFactor(room,pose.x,pose.y),contacts:pose.hands});drawFurnitureFront(ctx,room,pose,images.get(room));for(const [hx,hy] of pose.hands||[]){ctx.fillStyle='#55ffff';ctx.fillRect(hx-4,hy,9,1);ctx.fillRect(hx,hy-4,1,9);}}
  palette(ctx);
  $('finding').textContent=`${item.label}: ${report.status}. Target ${item.heightCm} cm. ${item.confidence==='unknown'?'The physical height is not verified.':`The art implies ${report.inferredCm.toFixed(1)} cm, ${(report.error*100).toFixed(0)}% from the reference.`} ${item.note}`;
  $('projection').textContent=sceneProfiles[room].projection;$('source').replaceChildren(document.createTextNode(item.source?'Reference object: ':'Reference: chosen design target. '));
  if(item.source){const a=document.createElement('a');a.href=item.source;a.textContent='manufacturer dimensions';$('source').append(a);}
  const depth=setup('depth'),samples=room==='arcade'?[[260,360],[374,360],[488,360]]:room==='town'?[[303,420],[430,420],[576,420]]:room==='cabin'?[[328,384],[380,640],[440,384]]:[[280,384],[340,384],[388,384]];
  samples.forEach(([groundY,groundX],i)=>{const sx=175+i*350,s=sceneBodyScale(room,groundY)*depthFactor(room,groundX,groundY);drawHuman(depth,{x:sx,y:220,scale:s});line(depth,sx-110,220,220);text(depth,`floor ${groundY} / ${(60*s).toFixed(1)} px`,sx-110,250);text(depth,'same 175 cm adult',sx-100,275);});palette(depth);
}
function selectRoom(id){$('object').replaceChildren(...landmarks.filter(item=>item.room===$('room').value).map(item=>new Option(item.label,item.id)));if(landmarks.some(item=>item.room===$('room').value&&item.id===id))$('object').value=id;paint();}
$('room').onchange=()=>selectRoom();$('object').onchange=paint;$('show-contact').onchange=paint;
const query=new URLSearchParams(location.search);if(scenes[query.get('scene')])$('room').value=query.get('scene');selectRoom(query.get('object'));
