import { catalog, allowedCharacters, requireAllowed, initialCharacter } from './pets/catalog.js';
import { DialogueHost } from './widget/dialogue-host.js';
import { visibleControl } from './widget/focus.js';
import { lockPage, unlockPage } from './widget/scroll-lock.js';
import { launcherIcon as launcherArt } from './widget/launcher.js';
import { SaveStore, legacyFamily, parseImport } from './widget/save-store.js';

const asset = path => new URL(path,import.meta.url).href;
class LilGotchi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this.queue=Promise.resolve();
    this.requestId=0;
    this.pending=new Map();
  }
  connectedCallback() {
    if(this.initialized) return;
    this.initialized=true;
    this.store=new SaveStore(this.getAttribute('storage-key')||'default');
    try { this.allowed=allowedCharacters(this.getAttribute('characters')); }
    catch(error){this.shadowRoot.innerHTML='<p role="alert"></p>';this.shadowRoot.querySelector('p').textContent=error.message;this.emit('error',{message:error.message});return;}
    this.family=initialCharacter(this.store.preference('character'),this.getAttribute('character'),this.allowed);
    this.inline=this.getAttribute('mode')==='inline';
    this.shadowRoot.innerHTML=`<link rel="stylesheet" href="${asset('./widget/shell.css')}">
      <button class="launcher" aria-label="Open lilgotchi" aria-haspopup="dialog">${launcherArt(this.family)}</button>
      <${this.inline?'section class="inline"':'dialog'} aria-label="lilgotchi">
      <header><h2><img src="${asset('./widget/egg.svg')}" width="20" height="24" alt="" style="vertical-align:middle"> lilgotchi</h2><button class="close" aria-label="Close lilgotchi">×</button>
      <label class="chooser">Your pet <select aria-label="Character">${this.allowed.map(id=>`<option value="${id}">${catalog.find(choice=>choice.id===id).name}</option>`).join('')}</select></label></header>
      <div class="frame"></div><p class="status" role="status"></p>
      <button class="retry" hidden>Try again</button><details><summary>Save and help</summary><div class="tools"><button class="export">Export save</button><button class="import-button">Import save</button></div>
      <input class="file" type="file" accept="application/json,.json" hidden>
      <div class="import" hidden><p></p><button class="confirm-import">Replace this pet</button> <button class="cancel-import">Cancel</button></div>
      <footer>Progress stays in this browser. <a href="${asset('./pets/NOTICE.md')}" target="_blank" rel="noopener">Credits</a></footer></details>
      </${this.inline?'section':'dialog'}>`;
    this.panel=this.shadowRoot.querySelector(this.inline?'section':'dialog');
    this.select=this.shadowRoot.querySelector('select');
    this.select.value=this.family;
    this.bind('.launcher','click',()=>this.open());
    this.bind('.close','click',()=>this.close());
    this.select.addEventListener('change',()=>this.setCharacter(this.select.value));
    this.panel.addEventListener('keydown',event=>{
      if(this.inline || event.key!=='Tab')return;
      const controls=[...this.panel.querySelectorAll('button,select,summary,a,iframe')].filter(visibleControl);
      if(event.shiftKey && this.shadowRoot.activeElement===controls[0]){event.preventDefault();controls.at(-1)?.focus();}
      else if(!event.shiftKey && this.shadowRoot.activeElement===controls.at(-1)){event.preventDefault();controls[0]?.focus();}
    });
    this.panel.addEventListener('cancel',event=>{event.preventDefault();this.close();});
    this.bind('.retry','click',()=>this.serial(async()=>{await this.unload();await this.mount();}));
    this.bind('.export','click',()=>this.exportSave());
    this.bind('.import-button','click',()=>this.shadowRoot.querySelector('.file').click());
    this.bind('.file','change',event=>this.previewImport(event.target.files[0]));
    this.bind('.cancel-import','click',()=>{this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;});
    this.bind('.confirm-import','click',()=>this.confirmImport());
    if(this.inline){this.shadowRoot.querySelector('.launcher').hidden=true;this.shadowRoot.querySelector('.close').hidden=true;this.open();}
  }
  updateLauncher(){this.shadowRoot.querySelector('.launcher').innerHTML=launcherArt(this.family);}
  bind(selector,event,callback){this.shadowRoot.querySelector(selector).addEventListener(event,callback);}
  emit(name,detail={}){this.dispatchEvent(new CustomEvent(`lilgotchi:${name}`,{detail,bubbles:true,composed:true}));}
  serial(callback){this.queue=this.queue.then(callback).catch(error=>this.fail(error));return this.queue;}
  status(text,error=false){const node=this.shadowRoot.querySelector('.status');if(node.textContent!==text)node.textContent=text;node.classList.toggle('error',error);}
  fail(error){this.select.value=this.family;this.status(error.message||'Could not load lilgotchi.',true);this.shadowRoot.querySelector('.retry').hidden=false;this.emit('error',{message:error.message||'Unknown error'});}
  open(){return this.serial(async()=>{
    if(!this.isConnected)return;
    if(!this.inline && !this.panel.open){this.panel.showModal();lockPage(this);this.shadowRoot.querySelector('.close').focus();}
    if(!this.frame)await this.mount();
    this.emit('open',{character:this.family});
  });}
  close(){return this.serial(async()=>{
    await this.unload();
    if(!this.inline){this.panel.close();unlockPage(this);this.shadowRoot.querySelector('.launcher').focus();}
    this.emit('close',{character:this.family});
  });}
  setCharacter(family){
    try{requireAllowed(family,this.allowed||[]);}catch(error){return Promise.reject(error);}
    return this.serial(async()=>{
      if(this.family===family)return;
      const visible=this.inline||this.panel.open;
      await this.unload();
      this.family=family;this.updateLauncher();this.select.value=family;this.store.preference('character',family);
      this.shadowRoot.querySelector('.import').hidden=true;
      if(visible)await this.mount();
      this.emit('characterchange',{character:family});
    });
  }
  async mount(){
    const container=this.shadowRoot.querySelector('.frame');
    container.textContent='';
    this.shadowRoot.querySelector('.retry').hidden=true;
    this.status('Loading your pet…');
    let saved;
    if(!await this.store.acquire(this.family)){
      container.innerHTML='<p class="loading">This pet is active in another window. Close it there, then try again here.</p>';
      this.status('Read only while another window is playing.');
      this.shadowRoot.querySelector('.retry').hidden=false;return;
    }
    try {
      if(this.hasAttribute('migrate-legacy'))this.store.migrateLegacy(this.family);
      saved=this.store.load(this.family);
    } catch(error){this.store.release(this.family);this.fail(error);return;}
    if(!this.isConnected){this.store.release(this.family);return;}
    const frame=document.createElement('iframe');
    this.frame=frame;
    frame.style.height='340px';
    frame.title=`${this.family} virtual pet game`;
    const url=new URL('./pets/game.html',import.meta.url);
    const nonce=crypto.randomUUID();
    url.search=new URLSearchParams({pet:legacyFamily[this.family],character:this.family,embed:'1',parentOrigin:location.origin,nonce});
    const channel=new MessageChannel();
    this.port=channel.port1;
    const activeFamily=this.family;
    this.dialogueHost=new DialogueHost(this.dialogueAdapter,message=>channel.port1.postMessage(message),activeFamily);
    this.port.onmessage=event=>{if(this.frame===frame)this.receive(event.data,activeFamily);};
    frame.addEventListener('load',()=>{
      if(this.frame!==frame)return;
      frame.contentWindow.postMessage({type:'lilgotchi:connect',nonce,dialogueEnabled:this.store.preference('dialogue')==='true',dialogueAvailable:typeof this.dialogueAdapter==='function',state:saved?.state||null,muted:this.hasAttribute('muted') || this.store.preference('muted')!=='false',eink:this.store.preference('eink')==='true'},url.origin,[channel.port2]);
    },{once:true});
    frame.src=url.href;container.append(frame);
    this.loadTimeout=setTimeout(()=>{if(this.frame===frame && !this.ready)this.fail(new Error('The game did not load. Check that all widget files are available.'));},12000);
    this.heartbeat=setInterval(()=>{
      if(!this.store.renew(activeFamily)) {this.fail(new Error('This pet is now active elsewhere. Reopen it to continue.'));this.detachFrame();this.store.release(activeFamily);}
    },5000);
  }
  receive(message,family){
    if(!message || family!==this.family || typeof message.type!=='string')return;
    if(message.type.startsWith('dialogue-'))this.dialogueHost?.receive(message);
    if(message.type==='scroll' && Number.isFinite(message.delta) && Math.abs(message.delta)<=1000){
      if(this.inline)window.scrollBy(0,message.delta);else this.panel.scrollBy(0,message.delta);
    }
    if(message.type==='resize' && Number.isSafeInteger(message.height) && message.height>=100 && message.height<=1200 && this.frame)this.frame.style.height=`${message.height}px`;
    if(message.type==='save'){
      try{this.store.save(family,message.state);this.status(this.store.persistent?'Saved in this browser':'Progress lasts for this visit');}
      catch(error){this.fail(error);this.detachFrame();this.store.release(family);}
    }
    if(message.type==='ready'){this.ready=true;clearTimeout(this.loadTimeout);this.emit('ready',{character:family});}
    if(message.type==='snapshot' && Number.isSafeInteger(message.id))this.pending.get(message.id)?.(message.state);
    if(message.type==='close')this.close();
    if(message.type==='preference' && ['muted','eink','dialogue'].includes(message.name) && typeof message.value==='boolean')this.store.preference(message.name,message.value);
  }
  async snapshot(closing=false){
    if(!this.port || !this.ready)return;
    const id=++this.requestId;
    const state=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('Could not save the latest frame. Try closing again.'));},2500);
      this.pending.set(id,state=>{clearTimeout(timer);this.pending.delete(id);resolve(state);});
      this.port.postMessage({type:'snapshot',id,closing});
    });
    if(state)this.store.save(this.family,state);
  }
  detachFrame(){
    this.dialogueHost?.cancel();
    clearInterval(this.heartbeat);clearTimeout(this.loadTimeout);
    this.frame?.remove();this.frame=null;this.ready=false;
    this.port?.close();this.port=null;
    for(const resolve of this.pending.values())resolve(null);
    this.pending.clear();
  }
  async unload(){this.dialogueHost?.cancel();await this.snapshot(true);this.detachFrame();this.store.release(this.family);}
  disconnectedCallback(){
    // Removal keeps the latest action save. The close method waits for its final snapshot.
    unlockPage(this);this.detachFrame();this.store?.dispose();this.initialized=false;
  }
  exportSave(){return this.serial(async()=>{
    await this.snapshot();
    const raw=this.store.raw(this.family);
    if(!raw)throw new Error('Open this pet before exporting its save.');
    const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=`lilgotchi-${this.family}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });}
  async previewImport(file){
    if(!file)return;
    this.importData=null;
    this.shadowRoot.querySelector('.import').hidden=true;
    try{
      if(file.size>32768)throw new Error('This save file is too large.');
      this.importData=parseImport(await file.text(),this.allowed);
      const panel=this.shadowRoot.querySelector('.import');
      panel.querySelector('p').textContent=`Replace ${this.importData.family} with this age ${this.importData.state.age} pet? Your previous save will be kept as a recovery copy.`;
      panel.hidden=false;panel.querySelector('button').focus();
    }catch(error){this.fail(error);}
    this.shadowRoot.querySelector('.file').value='';
  }
  confirmImport(){return this.serial(async()=>{
    const data=this.importData;if(!data)return;
    requireAllowed(data.family,this.allowed);
    await this.unload();
    if(!await this.store.acquire(data.family))throw new Error('Close this pet in the other window before importing.');
    try{
      this.store.replace(data.family,data.state);
      this.family=data.family;this.updateLauncher();this.select.value=data.family;this.store.preference('character',data.family);
      this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;
    }finally{this.store.release(data.family);}
    await this.mount();
  });}
}
if(!customElements.get('lil-gotchi'))customElements.define('lil-gotchi',LilGotchi);
export { LilGotchi };
