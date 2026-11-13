import { catalog, allowedCharacters, requireAllowed, initialCharacter } from './pets/catalog.js';
import { visibleControl } from './widget/focus.js';
import { lockPage, unlockPage } from './widget/scroll-lock.js';
import { launcherIcon as launcherArt, savedCare } from './widget/launcher.js';
import { SaveStore, legacyFamily, parseImport } from './widget/save-store.js';
import { validState } from './pets/valid-state.js';
import { PetHistory } from './widget/pet-history.js';
import { mountCareGuide } from './widget/care-guide.js';

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
    this.history=new PetHistory(this.store);
    try { this.allowed=allowedCharacters(this.getAttribute('characters')); }
    catch(error){this.shadowRoot.innerHTML='<p role="alert"></p>';this.shadowRoot.querySelector('p').textContent=error.message;this.emit('error',{message:error.message});return;}
    this.family=initialCharacter(this.store.preference('character'),this.getAttribute('character'),this.allowed);
    this.inline=this.getAttribute('mode')==='inline';
    this.shadowRoot.innerHTML=`<link rel="stylesheet" href="${asset('./widget/shell.css')}">
      <button class="launcher" aria-label="Open lilgotchi" aria-haspopup="dialog">${launcherArt(this.family)}</button>
      <${this.inline?'section class="inline"':'dialog'} aria-label="lilgotchi">
      <header><h2><img src="${asset('./widget/egg.svg')}" width="20" height="24" alt="" style="vertical-align:middle"> lilgotchi</h2><button class="close" aria-label="Close lilgotchi">×</button>
      <label class="chooser">Your pet <select aria-label="Character">${this.allowed.map(id=>`<option value="${id}">${catalog.find(choice=>choice.id===id).name}</option>`).join('')}</select></label></header>
      <aside class="welcome"><p>Meet your little roommate. Feed and play together, then use Care when something needs attention. Growth happens over time, even while you are away.</p><button class="welcome-tour">Quick tour</button> <button class="welcome-close">Got it</button></aside>
      <p class="return-summary" hidden></p><div class="frame"></div><p class="status" role="status"></p>
      <button class="retry" hidden>Try again</button><details class="save-help"><summary>Save and help</summary><div class="tools"><button class="export">Export save</button><button class="import-button">Import save</button></div>
      <input class="file" type="file" accept="application/json,.json" hidden>
      <details class="paste-save"><summary>Paste a save instead</summary><label for="save-text">Exported save text</label><p id="paste-hint">Open your exported JSON file as text and paste its contents here. Nothing is uploaded.</p><textarea id="save-text" rows="5" maxlength="32768" spellcheck="false" aria-describedby="paste-hint"></textarea><button class="preview-paste">Preview pasted save</button></details>
      <div class="import" hidden><p></p><button class="confirm-import">Replace this pet</button> <button class="cancel-import">Cancel</button></div>
      <div class="guide-host"></div>
      <details class="pet-history"><summary>Remembered pets</summary><p class="history-status"></p><ol class="history-list"></ol></details>
      <footer>Progress stays in this browser on this website. Clearing site data removes it. Export a backup to move it or keep it safe. No account or automatic sync is needed. <a href="${asset('./pets/NOTICE.md')}" target="_blank" rel="noopener">Credits</a></footer></details>
      </${this.inline?'section':'dialog'}>`;
    this.panel=this.shadowRoot.querySelector(this.inline?'section':'dialog');
    this.select=this.shadowRoot.querySelector('select');
    this.select.value=this.family;
    this.shadowRoot.querySelector('.welcome').hidden=this.store.preference('introduced')==='true';
    this.bind('.welcome-close','click',()=>{this.shadowRoot.querySelector('.welcome').hidden=true;this.store.preference('introduced',true);});
    this.updateLauncher();
    this.renderHistory();
    this.careGuide=mountCareGuide(this.shadowRoot.querySelector('.guide-host'));
    this.bind('.welcome-tour','click',()=>{
      this.shadowRoot.querySelector('.welcome').hidden=true;this.store.preference('introduced',true);
      this.shadowRoot.querySelector('.save-help').open=true;this.careGuide.reset();this.careGuide.element.open=true;
      this.careGuide.element.querySelector('summary').focus();
    });
    this.bind('.launcher','click',()=>this.open());
    this.bind('.close','click',()=>this.close());
    this.select.addEventListener('change',()=>this.setCharacter(this.select.value));
    this.panel.addEventListener('keydown',event=>{
      if(this.inline || event.key!=='Tab')return;
      const controls=[...this.panel.querySelectorAll('button,select,textarea,summary,a,iframe')].filter(visibleControl);
      if(event.shiftKey && this.shadowRoot.activeElement===controls[0]){event.preventDefault();controls.at(-1)?.focus();}
      else if(!event.shiftKey && this.shadowRoot.activeElement===controls.at(-1)){event.preventDefault();controls[0]?.focus();}
    });
    this.panel.addEventListener('cancel',event=>{event.preventDefault();this.close();});
    this.bind('.retry','click',()=>this.serial(async()=>{await this.unload();await this.mount();}));
    this.bind('.export','click',()=>this.exportSave());
    this.bind('.import-button','click',()=>this.shadowRoot.querySelector('.file').click());
    this.bind('.file','change',event=>this.previewImport(event.target.files[0]));
    this.bind('.preview-paste','click',()=>this.previewImportText(this.shadowRoot.querySelector('#save-text').value));
    this.bind('.cancel-import','click',()=>{this.importPreviewId=(this.importPreviewId||0)+1;this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;this.restoreImportFocus();});
    this.bind('.confirm-import','click',()=>this.confirmImport());
    if(this.inline){this.shadowRoot.querySelector('.launcher').hidden=true;this.shadowRoot.querySelector('.close').hidden=true;this.open();}
  }
  updateLauncher(state){
    if(!state){try{state=this.store.load(this.family)?.state;}catch{ /* Recovery stays in the normal open flow. */ }}
    const button=this.shadowRoot.querySelector('.launcher'),care=savedCare(state);
    button.innerHTML=launcherArt(this.family,state||catalog.find(choice=>choice.id===this.family))+(care?'<span class="care-dot" aria-hidden="true"></span>':'');
    const label=`Open lilgotchi${state?`, ${state.stage}`:''}${state?.vacationAt?'. Vacation paused':care?`. ${this.ready?'Live care':'Last saved'}: ${care}`:''}`;
    button.setAttribute('aria-label',label);button.title=label;
  }
  renderHistory(){
    const list=this.shadowRoot.querySelector('.history-list'),status=this.shadowRoot.querySelector('.history-status');
    list.replaceChildren();
    try{
      const entries=this.allowed.flatMap(family=>this.history.list(family)).sort((a,b)=>b.recordedAt-a.recordedAt);
      for(const entry of entries){const item=document.createElement('li');item.textContent=this.history.describe(entry);list.append(item);}
      status.textContent=this.historyError||(!entries.length?'Pets who pass away will be remembered here.':this.store.persistent?'Remembered in this browser.':'These memories last for this visit.');
    }catch(error){status.textContent=error.message;}
  }
  rememberDeath(family,state){
    if(!state?.isDead)return;
    try{this.history.recordDeath(family,state);}catch(error){this.historyError=error.message;}
  }
  savePet(family,state){
    // Preserve a dead lifetime before a restart replaces the active save.
    let previous;
    try{previous=JSON.parse(this.store.raw(family)||'null')?.state;}catch{ /* The save store reports damaged active data. */ }
    this.rememberDeath(family,previous);
    this.store.save(family,state);
    this.rememberDeath(family,state);
    this.renderHistory();
  }
  savedFeedback(state){
    this.updateLauncher(state);
    const node=this.shadowRoot.querySelector('.status');node.classList.add('saved');
    clearTimeout(this.savedTimer);this.savedTimer=setTimeout(()=>node.classList.remove('saved'),1000);
    if(this.returnState){
      const previous=this.returnState;this.returnState=null;
      const summary=this.shadowRoot.querySelector('.return-summary');
      const changes=[];
      if(previous.character!==state.character)changes.push(`Your pet grew into a new ${state.stage}.`);
      if(state.age>previous.age)changes.push(`Now ${state.age} days old.`);
      const care=savedCare(state);if(care)changes.push(`${care}.`);
      summary.textContent=changes.length?`While you were away: ${changes.join(' ')}`:'Welcome back. Your progress is ready.';summary.hidden=false;
    }
  }
  bind(selector,event,callback){this.shadowRoot.querySelector(selector).addEventListener(event,callback);}
  emit(name,detail={}){this.dispatchEvent(new CustomEvent(`lilgotchi:${name}`,{detail,bubbles:true,composed:true}));}
  serial(callback){this.queue=this.queue.then(callback).catch(error=>this.fail(error));return this.queue;}
  status(text,error=false){const node=this.shadowRoot.querySelector('.status');if(node.textContent!==text)node.textContent=text;node.classList.toggle('error',error);}
  fail(error){this.select.value=this.family;this.status(error.message||'Could not load lilgotchi.',true);this.shadowRoot.querySelector('.retry').hidden=false;this.emit('error',{message:error.message||'Unknown error'});}
  open(){return this.serial(async()=>{
    if(!this.isConnected)return;
    if(!this.inline && !this.panel.open){this.panel.showModal();lockPage(this);this.shadowRoot.querySelector('.close').focus();}
    if(!this.frame)await this.mount();
    this.port?.postMessage({type:'visibility',visible:true});
    this.emit('open',{character:this.family});
  });}
  close(){return this.serial(async()=>{
    await this.snapshot(true);
    this.port?.postMessage({type:'visibility',visible:false});
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
      container.innerHTML='<p class="loading">This pet is active in another browser tab or page. Close that tab or page, then try again here. Closing its pet drawer keeps it active.</p>';
      this.status('Read only while another window is playing.');
      this.shadowRoot.querySelector('.retry').hidden=false;return;
    }
    try {
      if(this.hasAttribute('migrate-legacy'))this.store.migrateLegacy(this.family);
      saved=this.store.load(this.family);
      this.returnState=saved && Date.now()-saved.savedAt>60000?saved.state:null;
      this.shadowRoot.querySelector('.return-summary').hidden=true;
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
    this.port.onmessage=event=>{if(this.frame===frame)this.receive(event.data,activeFamily);};
    frame.addEventListener('load',()=>{
      if(this.frame!==frame)return;
      frame.contentWindow.postMessage({type:'lilgotchi:connect',nonce,state:saved?.state||null,muted:this.hasAttribute('muted') || this.store.preference('muted')!=='false',eink:this.store.preference('eink')==='true',scanlines:this.store.preference('scanlines')==='true'},url.origin,[channel.port2]);
    },{once:true});
    frame.src=url.href;container.append(frame);
    this.loadTimeout=setTimeout(()=>{if(this.frame===frame && !this.ready)this.fail(new Error('The game did not load. Check that all widget files are available.'));},12000);
    this.heartbeat=setInterval(()=>{
      if(!this.store.renew(activeFamily)) {this.fail(new Error('This pet is now active elsewhere. Reopen it to continue.'));this.detachFrame();this.store.release(activeFamily);}
    },5000);
  }
  receive(message,family){
    if(!message || family!==this.family || typeof message.type!=='string')return;
    if(message.type==='care-status' && validState(message.state))this.updateLauncher(message.state);
    if(message.type==='scroll' && Number.isFinite(message.delta) && Math.abs(message.delta)<=1000){
      if(this.inline)window.scrollBy(0,message.delta);else this.panel.scrollBy(0,message.delta);
    }
    if(message.type==='resize' && Number.isSafeInteger(message.height) && message.height>=100 && message.height<=1200 && this.frame)this.frame.style.height=`${message.height}px`;
    if(message.type==='save'){
      try{this.savePet(family,message.state);this.status(this.store.persistent?'Saved in this browser':'Progress lasts for this visit');this.savedFeedback(message.state);}
      catch(error){this.fail(error);this.detachFrame();this.store.release(family);}
    }
    if(message.type==='ready'){this.ready=true;clearTimeout(this.loadTimeout);this.emit('ready',{character:family});}
    if(message.type==='snapshot' && Number.isSafeInteger(message.id))this.pending.get(message.id)?.(message.state);
    if(message.type==='close')this.close();
    if(message.type==='preference' && ['muted','eink','scanlines'].includes(message.name) && typeof message.value==='boolean')this.store.preference(message.name,message.value);
  }
  async snapshot(closing=false){
    if(!this.port || !this.ready)return;
    const id=++this.requestId;
    const state=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('Could not save the latest frame. Try closing again.'));},2500);
      this.pending.set(id,state=>{clearTimeout(timer);this.pending.delete(id);resolve(state);});
      this.port.postMessage({type:'snapshot',id,closing});
    });
    if(state){this.savePet(this.family,state);this.updateLauncher(state);}
  }
  detachFrame(){
    
    clearInterval(this.heartbeat);clearTimeout(this.loadTimeout);
    this.frame?.remove();this.frame=null;this.ready=false;
    this.port?.close();this.port=null;
    for(const resolve of this.pending.values())resolve(null);
    this.pending.clear();
  }
  async unload(){await this.snapshot(true);this.detachFrame();this.store.release(this.family);}
  disconnectedCallback(){
    // Removal keeps the latest action save. The close method waits for its final snapshot.
    unlockPage(this);clearTimeout(this.savedTimer);this.detachFrame();this.store?.dispose();this.initialized=false;
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
    const request=this.importPreviewId=(this.importPreviewId||0)+1;
    this.importData=null;
    this.shadowRoot.querySelector('.import').hidden=true;
    try{
      if(file.size>32768)throw new Error('This save file is too large.');
      const text=await file.text();
      if(request!==this.importPreviewId)return;
      this.previewImportText(text,this.shadowRoot.querySelector('.import-button'));
    }catch(error){if(request===this.importPreviewId)this.fail(error);}
    finally{this.shadowRoot.querySelector('.file').value='';}
  }
  restoreImportFocus(){
    const target=this.importFocus;
    if(target && visibleControl(target))target.focus();else this.select.focus();
    this.importFocus=null;
  }
  previewImportText(text,origin=this.shadowRoot.querySelector('.preview-paste')){
    this.importPreviewId=(this.importPreviewId||0)+1;
    this.importData=null;
    this.shadowRoot.querySelector('.import').hidden=true;
    try{
      this.importData=parseImport(text,this.allowed);
      this.importFocus=origin;
      this.status('Review this backup before replacing your pet.');
      this.shadowRoot.querySelector('.retry').hidden=true;
      const panel=this.shadowRoot.querySelector('.import');
      panel.querySelector('p').textContent=`Replace ${catalog.find(choice=>choice.id===this.importData.family).name} with this ${this.importData.state.stage}, age ${this.importData.state.age}? Your previous save will be kept as a recovery copy.`;
      panel.hidden=false;panel.querySelector('button').focus();
    }catch(error){this.fail(error);}
  }
  confirmImport(){return this.serial(async()=>{
    const data=this.importData;if(!data)return;
    requireAllowed(data.family,this.allowed);
    await this.unload();
    if(!await this.store.acquire(data.family))throw new Error('Close the other browser tab or page using this pet before importing. Closing its drawer keeps it active.');
    try{
      let previous;
      try{previous=JSON.parse(this.store.raw(data.family)||'null')?.state;}catch{ /* Replacement preserves damaged raw data as a recovery copy. */ }
      this.rememberDeath(data.family,previous);
      this.store.replace(data.family,data.state);
      this.rememberDeath(data.family,data.state);this.renderHistory();
      this.family=data.family;this.updateLauncher();this.select.value=data.family;this.store.preference('character',data.family);
      this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;
      this.shadowRoot.querySelector('#save-text').value='';
    }finally{this.store.release(data.family);}
    await this.mount();
    this.importFocus=null;this.select.focus();
  });}
}
if(!customElements.get('lil-gotchi'))customElements.define('lil-gotchi',LilGotchi);
export { LilGotchi };
