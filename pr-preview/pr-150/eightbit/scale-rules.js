// Total stature is a scene reference, not a claim about Taylor's real height.
export const bodyReference=Object.freeze({heightCm:175,heightUnits:60,headUnits:20,torsoUnits:21,legUnits:19,maxReachUnits:24});
export const sceneProfiles=Object.freeze({
  town:{scale:.7,projection:'Street level uses one scale. The campus path recedes separately.'},
  arcade:{scale:1.75,back:{y:260,scale:1.5},front:{y:488,scale:2.1},projection:'Scale increases between the rear cabinets and the front counter.'},
  cabin:{scale:2.25,projection:'One room scale. Floor depth is separate from vertical furniture height.'},
  rooftop:{scale:1.25,projection:'One roof scale. Distant buildings are scenery, not the roof floor plane.'},
});
export const clamp=value=>Math.max(0,Math.min(1,value));
export function depthFactor(room,x,y){
  return room==='town'&&x>=340&&x<=480&&y<566?.28+.72*clamp((y-303)/263):1;
}
export function sceneBodyScale(room,y=0){
  const p=sceneProfiles[room];
  if(!p)throw new Error(`Unknown scene: ${room}`);
  return p.back?p.back.scale+(p.front.scale-p.back.scale)*clamp((y-p.back.y)/(p.front.y-p.back.y)):p.scale;
}
export function pixelsPerCm(room,x,y){return bodyReference.heightUnits/bodyReference.heightCm*sceneBodyScale(room,y)*depthFactor(room,x,y);}
export function projectHeight(room,ground,heightCm){return {x:ground[0],y:ground[1]-heightCm*pixelsPerCm(room,...ground)};}
export function dimensionReport(item){
  const expected=projectHeight(item.room,item.ground,item.heightCm),observed=item.ground[1]-item.top[1];
  const inferredCm=observed/pixelsPerCm(item.room,...item.ground),error=(inferredCm-item.heightCm)/item.heightCm;
  return {...item,expected,inferredCm,error,status:item.confidence==='unknown'?'unmeasured':Math.abs(error)>item.tolerance?'mismatch':item.confidence==='estimated'?'provisional':'within range'};
}
