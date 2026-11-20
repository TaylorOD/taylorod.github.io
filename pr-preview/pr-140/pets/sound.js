export class SoundManager {
  constructor(){ this.ctx=null; this.muted=true; }
  init(){ if(!this.ctx) try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  beep(freq,dur,vol=.15){
    if(this.muted||!this.ctx) return;
    try{
      const o=this.ctx.createOscillator(),g=this.ctx.createGain();
      o.type='square'; o.frequency.value=freq; g.gain.value=vol;
      o.connect(g); g.connect(this.ctx.destination);
      o.start(); o.stop(this.ctx.currentTime+dur/1000);
    }catch(e){}
  }
  btnPress(){ this.beep(800,50); }
  attention(){ this.beep(1000,100); setTimeout(()=>this.beep(1200,100),150); }
  happy(){ this.beep(600,80); setTimeout(()=>this.beep(900,120),100); }
  sad(){ this.beep(300,200); }
  gameWin(){ [0,100,200].forEach((d,i)=>setTimeout(()=>this.beep(600+i*200,100),d)); }
  gameLose(){ this.beep(400,100); setTimeout(()=>this.beep(200,200),120); }
  death(){ this.beep(200,500,.1); }
  hatch(){ [0,150,300,450].forEach((d,i)=>setTimeout(()=>this.beep(500+i*100,80),d)); }
  eat(){ this.beep(500,60); setTimeout(()=>this.beep(600,60),80); }
  clean(){ this.beep(700,50); setTimeout(()=>this.beep(900,50),60); setTimeout(()=>this.beep(1100,50),120); }
  medicine(){ this.beep(400,80); setTimeout(()=>this.beep(600,80),100); setTimeout(()=>this.beep(800,80),200); }
  discipline(){ this.beep(200,100); setTimeout(()=>this.beep(400,100),120); }
  denied(){ this.beep(200,150,.1); }
  toggleMute(){ this.muted=!this.muted; }
}

