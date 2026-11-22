import { discoveries } from './hunt.js';
import { pet } from './art.js';
export function hiddenFriends(ctx,room,progress,time=0) {
  return discoveries.filter(d=>d.room===room&&d.id!=='slice'&&!progress.found?.includes(d.id)).map(d=>({
    y:d.y,draw:()=>pet(ctx,d.x,d.y,d.id,time,false,.45,'down')
  }));
}
