import { C } from './constants.js';
import { PF } from './font.js';
import { SP, palette } from './skins.js';
import { petType } from './storage.js';
import { frameInfo } from './layout.js';
import { pixelSize } from './pixel-size.js';

export class Renderer {
  constructor(canvas){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d');
    this.w=C.W; this.h=C.H;
    this.buf=Array.from({length:this.h},()=>new Uint8Array(this.w));
    this.updateColors();
    canvas.width=this.w*C.SCALE;
    canvas.height=this.h*C.SCALE;
    if(canvas.parentElement && typeof ResizeObserver!=='undefined') {
      const resize=()=>{
        const parent=canvas.parentElement;
        const style=getComputedStyle(parent);
        const available=parent.clientWidth-parseFloat(style.paddingLeft||0)-parseFloat(style.paddingRight||0);
        const size=pixelSize(available,globalThis.devicePixelRatio||1);
        this.pixelScale=size.scale;this.pixelGap=Math.min(size.scale-1,size.gap);
        canvas.width=size.width;canvas.height=size.height;
        canvas.style.width=`${size.cssWidth}px`;canvas.style.height=`${size.cssHeight}px`;
        this.render(this.inverted||false);
      };
      this.resizeObserver=new ResizeObserver(resize);this.resizeObserver.observe(canvas.parentElement);
      window.addEventListener('resize',resize);resize();
    }
  }
  updateColors(){
    const s=getComputedStyle(document.documentElement);
    this.bg=s.getPropertyValue('--lcd-bg').trim()||'#c4cfa1';
    this.fg=s.getPropertyValue('--lcd-fg').trim()||'#0f380f';
  }
  clear(){ for(let y=0;y<this.h;y++) this.buf[y].fill(0); this.rejectedPixels=[]; this.lastComposition=[]; }
  setPixel(x,y,v=1){
    if(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<this.w&&y>=0&&y<this.h) this.buf[y][x]=v;
    else if(v) {
      const rejected={family:petType,frame:this.drawingContext||'unlabeled',x,y,value:v};
      (this.rejectedPixels??=[]).push(rejected);
      if(this.strictBounds) throw new Error(`Clipped sprite pixel: ${JSON.stringify(rejected)}`);
    }
  }
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
    this.inverted=invert;
    const s=this.pixelScale||C.SCALE,gap=this.pixelGap??1;
    this.ctx.fillStyle=invert?(petType==='classic'?this.fg:'#030504'):this.bg;
    this.ctx.fillRect(0,0,this.w*s,this.h*s);
    this.ctx.fillStyle=invert?this.bg:this.fg;
    for(let y=0;y<this.h;y++)
      for(let x=0;x<this.w;x++)
        if(this.buf[y][x]) {
          this.ctx.fillStyle = invert ? (petType==='classic'?this.bg:'#334038') : (palette[this.buf[y][x]] || this.fg);
          this.ctx.fillRect(x*s+gap,y*s+gap,s-gap,s-gap);
        }
  }
  renderToCanvas(canvas,sp){
    frameInfo(sp);
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

