// All scene layers finish on the same two world pixel grid and 256 color palette.
export const pixelGrid = 2;
export const scenePalette = [];
for (const r of [16,56,96,136,176,216]) for (const g of [16,56,96,136,176,216]) for (const b of [16,56,96,136,176,216]) scenePalette.push([r,g,b]);
for (let i=0;i<24;i++) { const v=Math.round(i*255/23); scenePalette.push([v,v,v]); }
scenePalette.push(...[[248,231,189],[244,187,114],[255,220,157],[239,213,170],[230,183,139],[212,164,120],[181,126,87],[117,75,56],
  [130,181,217],[183,216,233],[239,85,62],[233,184,101],[227,165,182],[168,214,183],[224,225,203],[250,244,221]]);

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
