import {scenes} from '../scenes.js';
import {ready,snapshot} from './snapshot.js';
import {World} from '../world.js';
const query=new URLSearchParams(location.search),id=scenes[query.get('scene')]?query.get('scene'):'town';
await ready();
const canvas=query.has('postcard')?World.prototype.postcard.call({progress:{pet:'sprout'}},query.get('postcard')):snapshot(id,query.get('point')).canvas;canvas.id='scene';canvas.setAttribute('aria-label','Static scene from the actual game renderer');
document.getElementById('scene').replaceWith(canvas);
document.getElementById('save').onclick=()=>{const link=document.createElement('a');link.download=`missoula-${id}.png`;link.href=canvas.toDataURL();link.click();};
document.title=`Missoula ${id} scene image`;
