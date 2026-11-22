import {scenes} from '../scenes.js';
import {ready,snapshot} from './snapshot.js';
const $=id=>document.getElementById(id);
await ready();
function paint(){
  const room=$('room').value,phase=$('phase').value;$('contacts').replaceChildren();
  for(const point of scenes[room].points){
    const frame=snapshot(room,point.id,phase),figure=document.createElement('figure'),canvas=document.createElement('canvas'),caption=document.createElement('figcaption');
    canvas.width=360;canvas.height=260;canvas.setAttribute('aria-label',`${point.label}, ${phase}`);
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    const x=Math.max(0,Math.min(frame.canvas.width-360,frame.actor.x-180)),y=Math.max(0,Math.min(frame.canvas.height-260,frame.actor.y-190));
    ctx.drawImage(frame.canvas,x,y,360,260,0,0,360,260);
    const link=document.createElement('a');link.href=`stills.html?scene=${room}&point=${point.id}`;link.textContent=point.label;caption.append(link);figure.append(canvas,caption);$('contacts').append(figure);
  }
  $('status').textContent=`${scenes[room].points.length} destinations. ${$('phase').selectedOptions[0].textContent}.`;
}
const query=new URLSearchParams(location.search);if(scenes[query.get('scene')])$('room').value=query.get('scene');
$('room').onchange=paint;$('phase').onchange=paint;paint();
