// These silhouettes follow the existing painted pines. Their roots set the draw order.
export const woodlandTrees = [
  {x:1125,y:304,top:187,width:43},
  {x:1182,y:402,top:268,width:48,chase:true},
  {x:1210,y:244,top:160,width:30},
  {x:1232,y:310,top:229,width:35},
  {x:1256,y:257,top:155,width:39},
  {x:1282,y:358,top:246,width:47,chase:true},
  {x:1251,y:411,top:336,width:32,chase:true},
  {x:1312,y:258,top:150,width:43},
  {x:1318,y:409,top:310,width:43,chase:true},
  {x:1344,y:296,top:210,width:35,chase:true},
  {x:1367,y:219,top:147,width:30},
  {x:1486,y:238,top:139,width:35},
  {x:1507,y:301,top:210,width:37},
  {x:1470,y:414,top:340,width:31,chase:true},
  {x:1522,y:415,top:279,width:43},
];

export function woodlandForeground(ctx, painting, tree) {
  const {x,y,top,width}=tree, h=y-top-16;
  const edge=[[0,0],[.14,.14],[.08,.14],[.25,.3],[.15,.3],[.34,.48],
    [.21,.48],[.43,.69],[.29,.69],[.5,1],[.09,1],[.09,1+16/h]];
  const points=[...edge,...edge.slice().reverse().map(([dx,dy])=>[-dx,dy])];
  ctx.save();ctx.beginPath();
  points.forEach(([dx,dy],i)=>i?ctx.lineTo(x+dx*width,top+dy*h):ctx.moveTo(x+dx*width,top+dy*h));
  ctx.closePath();ctx.clip();
  ctx.drawImage(painting,0,0,1536,1024);
  ctx.restore();
}
