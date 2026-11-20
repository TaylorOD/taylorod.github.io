import { TamagotchiApp } from './game.js';
import { overlayControls } from './focus.js';
import { overlayContentHeight } from './overlay-size.js';
import { petType, validState, configureStorage } from './storage.js';
import { configurationActionId } from '../widget/settings.js';

const params=new URLSearchParams(location.search);
const embedded=params.get('embed')==='1';
let channel=null;
let saved=null;
let saveId=0;
let lastConfiguration='';
let configurationReady=false;
function publishConfiguration(){
  if(!channel||!window.app||!configurationReady)return;
  const configuration={vacation:window.app.state.vacationAt>0,scanlines:document.documentElement.classList.contains('scanlines'),eink:window.app.eink,muted:window.app.sound.muted,classic:petType==='classic'};
  const key=JSON.stringify(configuration);
  if(key===lastConfiguration)return;
  lastConfiguration=key;channel.postMessage({type:'configuration',configuration});
}
document.documentElement.dataset.pet=petType;
document.documentElement.dataset.embedded=String(embedded);
if(petType!=='classic') {
  const style=document.createElement('link');
  style.rel='stylesheet'; style.href=new URL('./custom-themes.css',import.meta.url).href;
  const loaded=new Promise(resolve=>{style.onload=resolve;style.onerror=resolve;});
  document.head.append(style); await loaded;
  document.getElementById('eink-row').hidden=true;
}
function start(initial, muted=true, eink=false,scanlines=false) {
  for(const overlay of document.querySelectorAll('.overlay')) {
    const title=overlay.querySelector('.overlay-title');
    title.id=`${overlay.id}-title`;overlay.setAttribute('aria-labelledby',title.id);
  }
  saved=initial;
  if(embedded) configureStorage({load:()=>saved,save:state=>{
    saved=state;
    channel.postMessage({type:'save',id:++saveId,state});
    publishConfiguration();
  }});
  window.app=new TamagotchiApp({scanlines,onScanlinesChange:value=>{
    if(channel){channel.postMessage({type:'preference',name:'scanlines',value});publishConfiguration();}
    else try{localStorage.setItem('lilgotchi:scanlines',String(value));}catch{}
  },eink:petType==='classic'&&eink,onThemeChange:value=>{
    if(channel){channel.postMessage({type:'preference',name:'eink',value});publishConfiguration();}
    else try{localStorage.setItem('lilgotchi:eink',String(value));}catch{}
  }});
  if(!muted) window.app.handleAction('mute');
  document.getElementById('mute-btn').addEventListener('click',()=>{channel?.postMessage({type:'preference',name:'muted',value:window.app.sound.muted});publishConfiguration();});
  window.app.state.save();
  if(channel) {
    window.app.render();
    channel.postMessage({type:'ready'});
    configurationReady=true;
    publishConfiguration();
    setInterval(()=>channel.postMessage({type:'care-status',state:JSON.parse(JSON.stringify(window.app.state))}),5000);
    let lastHeight=0;
    const resize=()=>{
      const device=document.getElementById('device');
      const overlay=document.querySelector('.overlay.show');
      let height=Math.ceil(device.getBoundingClientRect().height+24);
      if(overlay) {
        height=Math.max(height,overlayContentHeight(overlay)+12);
      }
      height=Math.min(1200,Math.max(100,height));
      if(height!==lastHeight){lastHeight=height;channel.postMessage({type:'resize',height});}
    };
    const sizes=new ResizeObserver(resize);
    sizes.observe(document.getElementById('device'));
    for(const overlay of document.querySelectorAll('.overlay')) {
      sizes.observe(overlay);
      for(const child of overlay.children)sizes.observe(child);
    }
    new MutationObserver(resize).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
    resize();
  }
}
if(embedded) {
  const expectedOrigin=params.get('parentOrigin');
  const nonce=params.get('nonce');
  const connect=event=>{
    if(event.source!==parent || event.origin!==expectedOrigin || event.data?.type!=='lilgotchi:connect' || event.data.nonce!==nonce || !event.ports[0] || channel) return;
    window.removeEventListener('message',connect);
    channel=event.ports[0];
    channel.onmessage=event=>{
      const message=event.data;
      if(!message || typeof message.type!=='string') return;
      if(message.type==='configure' && window.app){
        const id=configurationActionId(message.action,petType==='classic');
        if(id){document.getElementById(id)?.click();publishConfiguration();}
      }
      if(message.type==='snapshot' && Number.isSafeInteger(message.id) && window.app) {
        if(message.closing){window.app.gameActive=false;window.app.gameId=(window.app.gameId||0)+1;}
        channel.postMessage({type:'snapshot',id:message.id,state:JSON.parse(JSON.stringify(window.app.state))});
      }
      if(message.type==='visibility' && typeof message.visible==='boolean' && window.app){
        window.app.panelVisible=message.visible;
        window.app.sound.suspended=!message.visible;
        if(message.visible){window.app.processMissedTime();window.app.updateButtons();}
        else {
          window.app.gameActive=false;window.app.gameId=(window.app.gameId||0)+1;
          const overlay=document.querySelector('.overlay.show');
          if(overlay && overlay.id!=='death-overlay')window.app.closeOverlay(overlay.id);
          window.app.state.save();
        }
      }
      if(message.type==='save-status') document.getElementById('save-status').textContent=String(message.text||'').slice(0,160);
    };
    const initial=event.data.state;
    start(validState(initial)?initial:null,event.data.muted!==false,event.data.eink===true,event.data.scanlines===true);
  };
  window.addEventListener('message',connect);
} else {
  let eink=false,scanlines=false;
  try{eink=localStorage.getItem('lilgotchi:eink')==='true';scanlines=localStorage.getItem('lilgotchi:scanlines')==='true';}catch{}
  start(null,true,eink,scanlines);
}
window.addEventListener('pagehide',()=>window.app?.state.save());
window.restorePetSession=data=>{
  if(!window.app || !validState(data)) return;
  window.app.state.vacationAt=data.vacationAt||0;
  for(const key of Object.keys(window.app.state)) if(Object.hasOwn(data,key)) window.app.state[key]=data[key];
  window.app.processMissedTime(); window.app.updateButtons();
};
document.addEventListener('keydown',event=>{
  const overlay=document.querySelector('.overlay.show');
  if(event.key==='Escape') {
    event.preventDefault();
    if(overlay && overlay.id!=='death-overlay') {
      window.app.gameActive=false; window.app.closeOverlay(overlay.id);
    } else if(channel) channel.postMessage({type:'close'});
  }
  if(event.key==='Tab' && overlay) {
    const controls=overlayControls(overlay);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey && document.activeElement===first) {event.preventDefault();last?.focus();}
    else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
  }
});

// Frames cannot naturally chain a gesture to their containing drawer.
const scrollHost=delta=>channel?.postMessage({type:'scroll',delta:Math.max(-1000,Math.min(1000,delta))});
document.addEventListener('wheel',event=>{
  if(!channel || event.ctrlKey)return;
  event.preventDefault();
  scrollHost(event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1));
},{passive:false});
let touchY=null;
document.addEventListener('touchstart',event=>{touchY=event.touches.length===1?event.touches[0].clientY:null;},{passive:true});
document.addEventListener('touchmove',event=>{
  if(!channel || touchY===null || event.touches.length!==1)return;
  const next=event.touches[0].clientY;
  event.preventDefault();scrollHost(touchY-next);touchY=next;
},{passive:false});
