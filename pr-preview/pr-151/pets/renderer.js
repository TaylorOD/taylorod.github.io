import { C } from './constants.js';
import { PF } from './font.js';
import { SP, palette } from './skins.js';

export class Renderer {
  constructor(canvas){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d');
    this.w=C.W; this.h=C.H;
    this.buf=Array.from({length:this.h},()=>new Uint8Array(this.w));
    this.updateColors();
    canvas.width=this.w*C.SCALE;
    canvas.height=this.h*C.SCALE;
  }
  updateColors(){
    const s=getComputedStyle(document.documentElement);
    this.bg=s.getPropertyValue('--lcd-bg').trim()||'#c4cfa1';
    this.fg=s.getPropertyValue('--lcd-fg').trim()||'#0f380f';
  }
  clear(){ for(let y=0;y<this.h;y++) this.buf[y].fill(0); }
  setPixel(x,y,v=1){ if(x>=0&&x<this.w&&y>=0&&y<this.h) this.buf[y][x]=v; }
  drawSprite(sp,px,py){
    for(let y=0;y<sp.length;y++)
      for(let x=0;x<sp[y].length;x++)
        if(sp[y][x]) this.setPixel(px+x,py+y,sp[y][x]);
  }
  drawText(txt,px,py){
    let cx=px;
    for(const ch of txt.toUpperCase()){
      const g=PF[ch];
      if(g){ this.drawSprite(g,cx,py); cx+=g[0].length+1; }
      else cx+=3;
    }
  }
  drawHearts(count,max,px,py){
    for(let i=0;i<max;i++) this.drawSprite(i<count?SP.heart:SP.heartEmpty,px+i*6,py);
  }
  // Progress bar: x,y, width, fraction 0-1
  drawBar(px,py,w,frac){
    for(let x=0;x<w;x++) this.setPixel(px+x,py);
    for(let x=0;x<w;x++) this.setPixel(px+x,py+2);
    this.setPixel(px,py+1); this.setPixel(px+w-1,py+1);
    const fill=Math.floor((w-2)*Math.min(1,frac));
    for(let x=0;x<fill;x++) this.setPixel(px+1+x,py+1);
  }
  render(invert=false){
    const s=C.SCALE;
    this.ctx.fillStyle=invert?'#030504':this.bg;
    this.ctx.fillRect(0,0,this.w*s,this.h*s);
    this.ctx.fillStyle=invert?this.bg:this.fg;
    for(let y=0;y<this.h;y++)
      for(let x=0;x<this.w;x++)
        if(this.buf[y][x]) {
          this.ctx.fillStyle = invert ? '#334038' : (palette[this.buf[y][x]] || this.fg);
          this.ctx.fillRect(x*s+1,y*s+1,s-1,s-1);
        }
  }
  renderToCanvas(canvas,sp){
    const ctx=canvas.getContext('2d');
    const s=4;
    canvas.width=sp[0].length*s;
    canvas.height=sp.length*s;
    ctx.fillStyle=this.bg;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=this.fg;
    for(let y=0;y<sp.length;y++)
      for(let x=0;x<sp[y].length;x++)
        if(sp[y][x]) { ctx.fillStyle=palette[sp[y][x]] || this.fg; ctx.fillRect(x*s,y*s,s,s); }
  }
}

