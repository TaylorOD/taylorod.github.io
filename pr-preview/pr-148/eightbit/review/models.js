import { models } from './model-catalog.js';
import { PixelRenderer } from '../pixel-renderer.js';
const $=id=>document.getElementById(id);
let cards=[],running=false,last=0;
$('summary').textContent=`${models.length} model entries using the same pixel grid and palette as the scenes.`;
$('model').replaceChildren(...models.map(model=>new Option(model.name,model.id)));
function paint(time=0){
  const selected=models.find(model=>model.id===$('model').value);
  cards.forEach(({renderer,direction,frame,model=selected,action=$('action').value})=>{
    const ctx=renderer.ctx;ctx.fillStyle='#243e43';ctx.fillRect(0,0,192,192);
    ctx.save();ctx.translate(96,150);ctx.scale(2,2);model.draw(ctx,direction,action,frame*130+time);ctx.restore();renderer.present();
  });
}
function frames(){
  const model=models.find(model=>model.id===$('model').value);cards=[];$('frames').replaceChildren();
  for(const direction of model.directions)for(let frame=0;frame<4;frame++){
    const figure=document.createElement('figure'),canvas=document.createElement('canvas'),label=document.createElement('figcaption');
    canvas.width=192;canvas.height=192;label.textContent=`${direction} · frame ${frame+1}`;figure.append(canvas,label);$('frames').append(figure);
    const renderer=new PixelRenderer(canvas);renderer.resize();cards.push({renderer,direction,frame});
  }
  paint();
}
function select(){const model=models.find(model=>model.id===$('model').value);$('action').replaceChildren(...model.actions.map(action=>new Option(action,action)));frames();}
$('model').onchange=select;$('action').onchange=()=>paint();
$('overview').onclick=()=>{
  running=false;$('animate').textContent='Animate';cards=[];$('frames').replaceChildren();
  for(const model of models){
    const figure=document.createElement('figure'),canvas=document.createElement('canvas'),label=document.createElement('figcaption');
    canvas.width=192;canvas.height=192;label.textContent=model.name;figure.append(canvas,label);$('frames').append(figure);
    const renderer=new PixelRenderer(canvas);renderer.resize();cards.push({renderer,model,direction:model.directions[0],action:model.actions[0],frame:0});
  }
  paint();
};
$('animate').onclick=()=>{running=!running;$('animate').textContent=running?'Pause':'Animate';};
function tick(time){if(running&&time-last>=130){paint(time);last=time;}requestAnimationFrame(tick);}
select();requestAnimationFrame(tick);
