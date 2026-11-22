// Keep one world pixel of detail. The previous half resolution surface erased
// sprite features and made the characters much coarser than the furniture.
export const pixelGrid = 1;
// One curated palette for scenery, people, fixtures and exported scene images.
export const scenePalette=[
  '#13262b','#203b3d','#29373b','#3b3944','#4f5350','#6d7166','#92998a','#bdc5b1','#dfe1ca','#faf4dd',
  '#123e3b','#245449','#36705a','#4a805e','#68966a','#8ab477','#b0c98b','#536b43','#77864d',
  '#223c58','#31566c','#49768c','#6597b0','#82b5d9','#a4cfe6','#b7d8e9',
  '#3b2d2a','#584237','#754b38','#936044','#b07c51','#c99c62','#e2bd85','#f4d39a',
  '#622e31','#8d3c37','#b34a3b','#d46646','#ef553e','#ef8662',
  '#846b3f','#ad883f','#d6a94e','#f4bb72','#ffdc9d',
  '#b57e57','#d4a478','#e6b78b','#efd5aa','#f8e7bd',
  '#352d49','#574468','#796484','#9b7c9c','#c09abb','#b96087','#d1849c','#e3a5b6',
  '#485663','#769090','#a8d6b7','#a7a2bb','#dbbfc4','#ffffff',
].map(color=>[1,3,5].map(start=>parseInt(color.slice(start,start+2),16)));

let lookup;
export function paletteLookup() {
  if (lookup) return lookup;
  lookup=new Uint8Array(32768);
  for(let code=0;code<32768;code++) {
    const r=(code>>10)*8+4,g=(code>>5&31)*8+4,b=(code&31)*8+4;
    let best=Infinity,index=0;
    scenePalette.forEach(([pr,pg,pb],i)=>{const distance=(r-pr)**2*2+(g-pg)**2*3+(b-pb)**2;if(distance<best){best=distance;index=i;}});
    lookup[code]=index;
  }
  return lookup;
}

export function applyPalette(data) {
  const lut=paletteLookup();
  for(let i=0;i<data.length;i+=4){
    const color=scenePalette[lut[(data[i]>>3)<<10|(data[i+1]>>3)<<5|data[i+2]>>3]];
    data[i]=color[0];data[i+1]=color[1];data[i+2]=color[2];
  }
}

export class PixelRenderer {
  constructor(canvas) {
    this.output=canvas;this.screen=canvas.getContext('2d');
    this.surface=document.createElement('canvas');
    this.ctx=this.surface.getContext('2d',{willReadFrequently:true});
  }
  resize() {
    this.surface.width=Math.ceil(this.output.width/pixelGrid);
    this.surface.height=Math.ceil(this.output.height/pixelGrid);
    this.ctx.setTransform(1/pixelGrid,0,0,1/pixelGrid,0,0);
    this.ctx.imageSmoothingEnabled=false;this.screen.imageSmoothingEnabled=false;
  }
  present() {
    const pixels=this.ctx.getImageData(0,0,this.surface.width,this.surface.height);
    applyPalette(pixels.data);this.ctx.putImageData(pixels,0,0);
    this.screen.drawImage(this.surface,0,0,this.surface.width*pixelGrid,this.surface.height*pixelGrid);
  }
}
