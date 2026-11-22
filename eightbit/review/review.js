import { World } from '../world.js';
import { scenes } from '../scenes.js';
import { loadInterior } from '../interior-view.js';
import { loadTownArt } from '../town-view.js';

const $=id=>document.getElementById(id);
loadTownArt();
await Promise.all(['arcade','cabin','rooftop'].map(loadInterior));
const progress={pizza:'delivered',adopted:true,pet:'sprout',found:[],stamps:[],visited:true};
let lastAction='none',frames=0,renderTime=0;
const world=new World($('game'),{progress,
  onAction:action=>{lastAction=action;},
  onPosition:(id,player)=>{
    frames++;
    if(frames%30===0)$('status').textContent=`${id} · position ${Math.round(player.x)}, ${Math.round(player.y)} · action ${lastAction} · render ${renderTime.toFixed(1)} ms`;
  }
});
const draw=world.draw.bind(world);
world.draw=time=>{const start=performance.now();draw(time);renderTime=renderTime*.9+(performance.now()-start)*.1;};
function scene(){world.enter($('scene').value);world.lifeTime=0;lastAction='none';$('destination').replaceChildren(...scenes[world.id].points.map(point=>new Option(point.label,point.id)));}
$('scene').onchange=scene;
$('walk').onclick=()=>{world.pause(false);$('freeze').textContent='Pause';world.goTo($('destination').value);};
$('freeze').onclick=()=>{world.pause(!world.paused);$('freeze').textContent=world.paused?'Resume':'Pause';};
$('pizza').onchange=()=>{progress.pizza=$('pizza').checked?'carrying':'delivered';};
$('save').onclick=()=>{
  const id=world.id;
  const canvas=document.createElement('canvas');canvas.width=world.scene.width;canvas.height=world.scene.height;
  const snapshot=Object.assign(Object.create(World.prototype),world,{canvas,ctx:canvas.getContext('2d'),camera:{x:0,y:0},renderer:null,transition:0});
  World.prototype.draw.call(snapshot,world.last);
  canvas.toBlob(blob=>{
    const link=document.createElement('a'),url=URL.createObjectURL(blob);
    link.href=url;link.download=`missoula-${id}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
};
const requested=new URLSearchParams(location.search);
if(scenes[requested.get('scene')])$('scene').value=requested.get('scene');
scene();
if(scenes[world.id].points.some(point=>point.id===requested.get('point'))){$('destination').value=requested.get('point');world.goTo(requested.get('point'));}
