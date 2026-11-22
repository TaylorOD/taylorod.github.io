import { models } from './model-catalog.js';
import { PixelRenderer } from '../pixel-renderer.js';
const $=id=>document.getElementById(id);
let cards=[],running=false,last=0,overview=false;
$('summary').textContent=`${models.length} model entries. Shared ground lines and world pixel measurements, with no automatic resizing of individual models.`;
$('model').replaceChildren(...models.map(model=>new Option(model.name,model.id)));
function measure(model,direction,action,time,room){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const ctx=canvas.getContext('2d');ctx.translate(256,350);model.draw(ctx,direction,action,time,room);
  const pixels=ctx.getImageData(0,0,512,512).data;let left=512,right=0,top=512,bottom=0;
  for(let y=0;y<512;y++)for(let x=0;x<512;x++)if(pixels[(y*512+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  return `${right-left+1} × ${bottom-top+1} world px`;
}
function paint(time=0){
  cards.forEach(({renderer,direction,frame,model,action,label})=>{
    const ctx=renderer.ctx,room=$('room').value,zoom=room==='town'?2:1;
    ctx.fillStyle='#243e43';ctx.fillRect(0,0,240,240);
    ctx.fillStyle='#6ba5a2';ctx.fillRect(0,190,240,1);
    ctx.save();ctx.translate(120,190);ctx.scale(zoom,zoom);model.draw(ctx,direction,action,frame*(action==='walk'?65:130)+time,room);ctx.restore();renderer.present();
    if(!time)label.textContent=`${overview?model.name+' / '+direction+' / '+action:direction+' · frame '+(frame+1)} · ${measure(model,direction,action,frame*(action==='walk'?65:130),room)}`;
  });
}
function card(model,direction,action,frame){
  const figure=document.createElement('figure'),canvas=document.createElement('canvas'),label=document.createElement('figcaption');
  canvas.width=240;canvas.height=240;figure.append(canvas,label);$('frames').append(figure);
  const renderer=new PixelRenderer(canvas);renderer.resize();cards.push({renderer,direction,frame,model,action,label});
}
function frames(){
  overview=false;const model=models.find(model=>model.id===$('model').value),action=$('action').value;
  cards=[];$('frames').replaceChildren();
  for(const direction of model.directions)for(let frame=0;frame<(model.human&&action==='walk'?8:4);frame++)card(model,direction,action,frame);
  $('metrics').textContent=`${model.name}: ${model.directions.join(', ')}. Actions: ${model.actions.join(', ')}. Bounds include equipment, shadows and headwear.`;
  paint();
}
function select(){const model=models.find(model=>model.id===$('model').value);$('action').replaceChildren(...model.actions.map(action=>new Option(action,action)));frames();}
$('model').onchange=select;$('action').onchange=frames;$('room').onchange=()=>paint();
$('overview').onclick=()=>{
  overview=true;running=false;$('animate').textContent='Animate';cards=[];$('frames').replaceChildren();
  for(const model of models)card(model,model.directions[0],model.actions[0],0);
  $('metrics').textContent='All 44 models at the same zoom. Town is the shared comparison scale. Scene changes apply to humans and companions. Scout sleeping uses the house pose. Other animals and river characters retain their town sizes.';paint();
};
$('directions').onclick=()=>{
  overview=true;running=false;$('animate').textContent='Animate';cards=[];$('frames').replaceChildren();
  for(const model of models)for(const direction of model.directions)card(model,direction,model.actions.includes('walk')?'walk':model.actions[0],0);
  $('metrics').textContent='Every declared facing for all 44 models. Walking where supported, otherwise the first supported action. The scene selector applies to humans and companions.';paint();
};
$('poses').onclick=()=>{
  overview=true;running=false;$('animate').textContent='Animate';cards=[];$('frames').replaceChildren();
  const model=models.find(model=>model.id===$('model').value);
  for(const action of model.actions)for(const direction of model.directions)card(model,direction,action,0);
  $('metrics').textContent=`Every action and facing for ${model.name}. Choose one action to inspect all of its frames.`;paint();
};
$('animate').onclick=()=>{running=!running;$('animate').textContent=running?'Pause':'Animate';};
function tick(time){if(running&&time-last>=65){paint(time);last=time;}requestAnimationFrame(tick);}
const requested=new URLSearchParams(location.search);
if(models.some(model=>model.id===requested.get('model')))$('model').value=requested.get('model');
if(['town','arcade','cabin','rooftop'].includes(requested.get('scene')))$('room').value=requested.get('scene');
select();
if(models.find(model=>model.id===$('model').value).actions.includes(requested.get('action'))){$('action').value=requested.get('action');frames();}
if(requested.get('view')==='cast')$('overview').onclick();
if(requested.get('view')==='directions')$('directions').onclick();
if(requested.get('view')==='poses')$('poses').onclick();
requestAnimationFrame(tick);
