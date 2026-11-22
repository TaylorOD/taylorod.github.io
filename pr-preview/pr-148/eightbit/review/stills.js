import {World} from '../world.js';
import {scenes,isWalkable} from '../scenes.js';
import {interactionPose} from '../interaction-art.js';
import {readyTownArt} from '../town-view.js';
import {loadInterior} from '../interior-view.js';
const requested=new URLSearchParams(location.search),id=scenes[requested.get('scene')]?requested.get('scene'):'town';
await Promise.all([readyTownArt(),...['arcade','cabin','rooftop'].map(loadInterior)]);
const canvas=document.getElementById('scene');
const world=new World(canvas,{progress:{pizza:'delivered',adopted:true,pet:'sprout',found:[],stamps:[],visited:true},onAction(){}});
world.enter(id);world.pause(true);cancelAnimationFrame(world.frame);world.resizeObserver.disconnect();
const point=world.scene.points.find(point=>point.id===requested.get('point'));
if(point){world.player={x:point.x,y:point.y};world.interaction=interactionPose(id,point);world.direction=world.interaction.direction;world.interactionStarted=0;}
for(const [dx,dy] of [[44,0],[-44,0],[0,-44],[0,44]])if(isWalkable(world.scene,world.player.x+dx,world.player.y+dy)){world.companion={x:world.player.x+dx,y:world.player.y+dy,direction:'down'};break;}
world.camera={x:0,y:0};world.transition=0;world.enteredAt=-10000;world.last=1000;world.lifeTime=0;
canvas.width=world.scene.width;canvas.height=world.scene.height;world.renderer=null;
World.prototype.draw.call(world,1000);
document.title=`Missoula ${id} scene image`;
