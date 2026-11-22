import {createResidents} from '../residents.js';
import {World} from '../world.js';
import {scenes,isWalkable} from '../scenes.js';
import {companionSpacing} from '../character-art.js';
import {interactionPose} from '../interaction-art.js';
import {readyTownArt} from '../town-view.js';
import {loadInterior} from '../interior-view.js';

export const ready=()=>Promise.all([readyTownArt(),...['arcade','cabin','rooftop'].map(loadInterior)]);
export function snapshot(id,pointId,phase='settled'){
  const canvas=document.createElement('canvas');
  const world=Object.assign(Object.create(World.prototype),{
    canvas,ctx:canvas.getContext('2d'),id,scene:scenes[id],player:{...scenes[id].spawn},companion:{...scenes[id].spawn,direction:'down'},
    progress:{pizza:'delivered',adopted:true,pet:'sprout',found:[],stamps:[],visited:true},residents:createResidents(),
    reduced:{matches:false},paused:true,walking:false,path:[],direction:'down',gaitDistance:0,interaction:null,
  });
  const point=scenes[id].points.find(p=>p.id===pointId);
  if(point){world.player={x:point.x,y:point.y};world.interaction=interactionPose(id,point);world.direction=world.interaction.direction;world.interactionStarted=0;}
  const gap=companionSpacing(id,world.player.y);
  for(const [dx,dy] of [[0,gap],[gap,0],[-gap,0],[0,-gap]])if(isWalkable(world.scene,world.player.x+dx,world.player.y+dy)){world.companion={x:world.player.x+dx,y:world.player.y+dy,direction:'down'};break;}
  let time=phase==='approach'?0:phase==='arriving'?160:1000;
  world.camera={x:0,y:0};world.transition=0;world.enteredAt=-10000;world.last=1000;world.lifeTime=0;
  if(phase==='leaving'&&point){world.clearInteraction();time=1160;}
  canvas.width=world.scene.width;canvas.height=world.scene.height;world.renderer=null;
  World.prototype.draw.call(world,time);
  return {canvas,actor:world.visualActor(time),point};
}
