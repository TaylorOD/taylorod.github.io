// Scene geometry stays in world pixels so the background and foreground masks agree.
export const roofRail = {left:48,right:718,top:356,floor:403,posts:[48,132,218,304,389,476,562,648,718]};
export const pokerTop = [[493,296],[509,281],[544,274],[595,271],[645,276],[677,288],[696,305],[693,319],[669,331],[626,340],[552,340],[516,330],[493,316]];
const polygon=(ctx,points,color)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(color){ctx.fillStyle=color;ctx.fill();}};
function copyShape(ctx,image,points,dy=0,dx=0){ctx.save();polygon(ctx,points.map(([x,y])=>[x+dx,y+dy]));ctx.clip();ctx.drawImage(image,dx,dy,768,512);ctx.restore();}

export function paintFixtures(ctx,id,image){
  if(id==='rooftop'){
    const {left,right,top,floor,posts}=roofRail;
    // Raise the front guard to the same physical height as the rear guard.
    for(const x of posts){ctx.fillStyle='#244b42';ctx.fillRect(x-2,top,5,floor-top);ctx.fillStyle='#729174';ctx.fillRect(x-2,top,1,floor-top);ctx.fillStyle='#a0a582';ctx.fillRect(x-3,top-2,7,3);}
    ctx.fillStyle='#244b42';ctx.fillRect(left,top,right-left,5);ctx.fillStyle='#729174';ctx.fillRect(left,top,right-left,1);
  }
  if(id==='arcade'){
    // Each deck, case and leg shares a floor anchor. The painted backglass is retained.
    for(const [dx,dy,color] of [[0,0,'#31574b'],[-30,48,'#433b67'],[-55,96,'#713d32']]){
      const pts=points=>points.map(([x,y])=>[x+dx,y+dy]);
      polygon(ctx,pts([[62,177],[104,215],[147,202],[147,231],[104,245],[62,207]]),color);
      polygon(ctx,pts([[104,215],[147,202],[147,231],[104,245]]),'#343b35');
      for(const [x,y,ground] of [[65,207,237],[104,241,270],[144,229,261]]){
        ctx.fillStyle='#34473c';ctx.fillRect(x+dx,y+dy,5,ground-y);ctx.fillStyle='#bfaa74';ctx.fillRect(x+dx,y+dy,2,ground-y-3);ctx.fillStyle='#e3c980';ctx.fillRect(x+dx-1,ground+dy-4,7,3);
      }
      polygon(ctx,pts([[62,177],[104,164],[147,202],[104,215]]),'#d7a14e');
      polygon(ctx,pts([[66,178],[103,168],[141,201],[104,211]]),'#283c3b');
      for(const [x,y] of [[97,180],[112,190],[99,198]]){
        ctx.fillStyle=color;ctx.fillRect(x+dx-5,y+dy-3,10,6);ctx.fillStyle='#e6b862';ctx.fillRect(x+dx-3,y+dy-2,6,4);ctx.fillStyle='#f8e7bd';ctx.fillRect(x+dx-2,y+dy-2,3,2);
      }
      polygon(ctx,pts([[71,180],[76,180],[99,206],[95,207]]),'#779d95');
      for(const [x,y] of [[110,204],[121,200]]){ctx.fillStyle='#efb56d';ctx.fillRect(x+dx,y+dy,9,2);}
      for(let i=0;i<4;i++){ctx.fillStyle='#a48b55';ctx.fillRect(110+dx+i*6,223+dy-i*2,3,6);}
      if(!dy)copyShape(ctx,image,[[61,167],[104,155],[106,204],[61,217]],-40);
      else if(dy===48)copyShape(ctx,image,[[29,198],[72,185],[76,237],[29,249]],-23,2);
      else copyShape(ctx,image,[[6,237],[49,220],[53,276],[6,288]],-12);
    }
    // Keep the painted felt, rim and lettering. Rebuild the exposed rug and legs
    // beneath it instead of stretching the seated people to a low tabletop.
    ctx.fillStyle='#713c37';ctx.fillRect(482,274,218,88);
    ctx.strokeStyle='#c39246';ctx.lineWidth=2;ctx.strokeRect(486,278,210,80);
    for(let x=489;x<695;x+=6)for(const y of [282,354]){ctx.fillStyle='#d7a44f';ctx.fillRect(x,y,3,2);}
    for(const [x,y] of [[510,329],[548,348],[641,348],[681,329]]){
      ctx.fillStyle='#4f392b';ctx.fillRect(x-4,y-48,8,48);ctx.fillStyle='#b58238';ctx.fillRect(x-3,y-47,3,46);ctx.fillStyle='#d5ac57';ctx.fillRect(x-4,y-4,9,3);
    }
    copyShape(ctx,image,pokerTop,-21);
    // The near chair remains in front of the table, with its feet on the rug.
    copyShape(ctx,image,[[490,302],[504,297],[529,312],[532,334],[526,356],[491,346]]);
    // Preserve the spiral stair that crosses the far right of the table.
    copyShape(ctx,image,[[682,271],[700,271],[700,362],[663,362],[668,344],[685,327]]);
  }
}

export function fixtureSurface(image,id){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=512;
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(image,0,0,768,512);paintFixtures(ctx,id,image);
  return canvas;
}
