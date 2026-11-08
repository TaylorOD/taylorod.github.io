// Frames stay complete. Placement moves their opaque bounds, never their pixels.
const metadata = new WeakMap();
export const screen = {left:0, top:0, right:31, bottom:15};

export function frameInfo(pixels) {
  if(metadata.has(pixels)) return metadata.get(pixels);
  const height=pixels?.length, width=pixels?.[0]?.length;
  if(!width || !height || pixels.some(row=>row.length!==width)) throw new Error('Sprite frames must be rectangular');
  let left=width,top=height,right=-1,bottom=-1,count=0;
  pixels.forEach((row,y)=>row.forEach((value,x)=>{
    if(!Number.isInteger(value)||value<0||value>255) throw new Error('Invalid sprite palette value');
    if(value){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);count++;}
  }));
  if(!count) throw new Error('Sprite frame has no visible pixels');
  const info={width,height,left,right,top,bottom,count,anchor:{x:Math.floor(width/2),y:height-1}};
  metadata.set(pixels,info);
  return info;
}

export const overlaps=(a,b)=>a.left<=b.right&&a.right>=b.left&&a.top<=b.bottom&&a.bottom>=b.top;

export function placeFrame(pixels,x,y,occupied=[],area=screen) {
  const info=frameInfo(pixels);
  const preferred={left:x+info.left,right:x+info.right,top:y+info.top,bottom:y+info.bottom};
  if(Number.isInteger(x)&&Number.isInteger(y)&&preferred.left>=area.left&&preferred.right<=area.right&&preferred.top>=area.top&&preferred.bottom<=area.bottom&&!occupied.some(other=>overlaps(preferred,other))) return {x,y,bounds:preferred,distance:0};
  const candidates=[];
  for(let py=area.top-info.top;py<=area.bottom-info.bottom;py++)
    for(let px=area.left-info.left;px<=area.right-info.right;px++) {
      const bounds={left:px+info.left,right:px+info.right,top:py+info.top,bottom:py+info.bottom};
      if(!occupied.some(other=>overlaps(bounds,other))) candidates.push({x:px,y:py,bounds,distance:Math.abs(px-x)+Math.abs(py-y)});
    }
  candidates.sort((a,b)=>a.distance-b.distance||Math.abs(a.y-y)-Math.abs(b.y-y)||a.y-b.y||a.x-b.x);
  if(!candidates.length) throw new Error('Sprite composition does not fit the screen');
  return candidates[0];
}

export function drawScene(renderer,items,occupied=[]) {
  const placed=[];
  for(const item of items) {
    const position=placeFrame(item.pixels,item.x,item.y,[...occupied,...placed.map(part=>part.bounds)],item.area||screen);
    renderer.drawingContext=item.name;
    renderer.drawSprite(item.pixels,position.x,position.y);
    placed.push({...position,name:item.name,pixels:item.pixels});
  }
  renderer.drawingContext=null;
  renderer.lastComposition=placed;
  return placed;
}

export function centeredBody(pixels,name='body') {
  const {width,height}=frameInfo(pixels);
  return {pixels,name,x:Math.floor((32-width)/2),y:Math.floor((16-height)/2)+1};
}
