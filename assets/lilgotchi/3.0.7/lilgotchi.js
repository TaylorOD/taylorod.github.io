import { readColorMap, cleanColors } from './pets/colors.js';
import { mountColorControls } from './widget/color-controls.js';
import { catalog, allowedCharacters, requireAllowed, initialCharacter } from './pets/catalog.js';
import { visibleControl } from './widget/focus.js';
import { lockPage, unlockPage } from './widget/scroll-lock.js';
import { launcherIcon as launcherArt, savedCare } from './widget/launcher.js';
import { SaveStore, legacyFamily, parseImport } from './widget/save-store.js';
import { validState } from './pets/valid-state.js';
import { PetHistory } from './widget/pet-history.js';
import { mountCareGuide } from './widget/care-guide.js';
import { launcherPreferences, mountLauncherSettings } from './widget/launcher-settings.js';
import { mountSettings } from './widget/settings.js';
import { inactiveSince, resumeInactive, hasActivePets } from './widget/inactive.js';
import { careNeeds, refreshCare } from './widget/care-monitor.js';
import { petLabel } from './widget/pet-label.js';
import { careGrade } from './pets/wellbeing.js';

const asset = path => new URL(path,import.meta.url).href;
class LilGotchi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this.queue=Promise.resolve();
    this.requestId=0;
    this.pending=new Map();
    this.careStates=new Map();
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
      <button class="launcher" part="launcher" aria-label="Open lilgotchi" aria-haspopup="dialog">${launcherArt(this.family)}</button>
      <${this.inline?'section class="inline"':'dialog'} aria-label="lilgotchi">
      <header><h2><img src="${asset('./widget/egg.svg')}" width="20" height="24" alt="" style="vertical-align:middle"> lilgotchi</h2><button class="close" aria-label="Close lilgotchi">×</button>
      <label class="chooser"><span class="pet-summary"><span class="pet-identity"></span><span class="pet-care" hidden></span></span><select aria-label="Character">${this.allowed.map(id=>`<option value="${id}">${catalog.find(choice=>choice.id===id).name}</option>`).join('')}</select></label></header>
      <aside class="welcome"><p>Meet your little roommate. Feed and play together, then use Care when something needs attention. Growth happens over time, even while you are away.</p><button class="welcome-tour">Quick tour</button> <button class="welcome-close">Got it</button></aside>
      <details class="care-needs" hidden><summary></summary><div class="needs-list"></div></details><p class="return-summary" hidden></p><div class="frame"></div>
      <button class="retry" hidden>Try again</button><details class="save-help"><summary><span class="save-label">Settings</span><span class="status" role="status"></span></summary><div class="guide-host"></div><details class="pet-history"><summary>Remembered pets</summary><p class="history-status"></p><ol class="history-list"></ol></details><details class="settings-group"><summary>Display and sound</summary><div class="game-options"></div><div class="launcher-options"></div><div class="color-options"></div></details><details class="settings-group"><summary>Pause or restart</summary><div class="pause-options"></div><div class="inactive-option setting-row"><div class="setting-copy"><strong>Take a break from this pet</strong><p>Keep your progress. No growth, care or notifications until you start it again.</p></div><button class="make-inactive">Make inactive</button></div></details><details class="settings-group"><summary>Save backups</summary><div class="tools"><button class="export">Export save</button><button class="import-button">Import save</button></div>
      <input class="file" type="file" accept="application/json,.json" hidden>
      <div class="import" hidden><p></p><button class="confirm-import">Replace this pet</button> <button class="cancel-import">Cancel</button></div>
      <p class="backup-help">Progress stays in this browser on this website. Clearing site data removes it. Export a backup to move it or keep it safe. No account or automatic sync is needed.</p></details><footer><a href="https://www.taylordorsett.com/lilgotchi/" target="_blank" rel="noopener">Website</a><a href="https://github.com/TaylorOD/lilgotchi" target="_blank" rel="noopener">GitHub</a></footer><button class="settings-close">Close settings</button></details>
      </${this.inline?'section':'dialog'}>`;
    this.panel=this.shadowRoot.querySelector(this.inline?'section':'dialog');
    this.select=this.shadowRoot.querySelector('select');
    this.select.value=this.family;
    this.shadowRoot.querySelector('.welcome').hidden=this.store.preference('introduced')==='true';
    this.bind('.welcome-close','click',()=>{this.shadowRoot.querySelector('.welcome').hidden=true;this.store.preference('introduced',true);});
    this.updateLauncher();
    this.renderHistory();
    this.refreshNotifications=(event)=>{if(event?.type==='storage' && (!event.key?.startsWith('lilgotchi:') || event.key.endsWith(':lease')))return;if(!document.hidden)this.serial(()=>this.refreshCare());};
    this.careTimer=setInterval(this.refreshNotifications,30000);
    window.addEventListener('storage',this.refreshNotifications);
    document.addEventListener('visibilitychange',this.refreshNotifications);
    this.bind('.pet-history','toggle',()=>{
      if(!this.shadowRoot.querySelector('.pet-history').open)return;
      for(const [family,{state}] of this.careStates)if(state.isDead)this.store.preference(`memorial-${family}`,state.bornAt);
      this.updateLauncher();
    });
    this.refreshNotifications();
    this.launcherSettings=mountLauncherSettings(this.shadowRoot.querySelector('.launcher-options'),
      ()=>this.launcherPreferences(),
      (key,on)=>{
        if(this.previewOptions)this.previewOptions[key==='brand'?'launcher':'notifications']=key==='brand'?(on?'brand':'shell'):(on?'on':'off');
        this.store.preference(key==='brand'?'brand-launcher':'notifications',on);this.updateLauncher();
      });
    this.settings=mountSettings(this.shadowRoot.querySelector('.game-options'),action=>{
      if(this.ready)this.port?.postMessage({type:'configure',action});
    },this.shadowRoot.querySelector('.pause-options'));
    this.bind('.settings-close','click',()=>{const details=this.shadowRoot.querySelector('.save-help');details.open=false;details.querySelector('summary').focus();});
    this.colorControls=mountColorControls(this.shadowRoot.querySelector('.color-options'),colors=>{
      this.store.preference('colors-'+this.family,JSON.stringify(cleanColors(colors)));
      this.port?.postMessage({type:'colors',colors:this.colorsFor(this.family)});
      this.updateLauncher();
    });
    this.colorControls.update(this.family,this.colorsFor(this.family));
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
    this.bind('.make-inactive','click',()=>this.makeInactive());
    this.bind('.export','click',()=>this.exportSave());
    this.bind('.import-button','click',()=>this.shadowRoot.querySelector('.file').click());
    this.bind('.file','change',event=>this.previewImport(event.target.files[0]));
    this.bind('.cancel-import','click',()=>{this.importPreviewId=(this.importPreviewId||0)+1;this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;this.restoreImportFocus();});
    this.bind('.confirm-import','click',()=>this.confirmImport());
    if(this.inline){this.shadowRoot.querySelector('.launcher').hidden=true;this.shadowRoot.querySelector('.close').hidden=true;this.open();}
  }
  launcherPreferences(){
    return this.previewOptions
      ? {brand:this.previewOptions.launcher==='brand',notifications:this.previewOptions.notifications!=='off'}
      : launcherPreferences(this.store,this.getAttribute('launcher'),this.getAttribute('notifications'));
  }
  // The setup page previews choices without starting pets or replacing saves.
  preview(options){
    const allowed=allowedCharacters(options.characters);
    requireAllowed(options.character,allowed);
    return this.serial(async()=>{
      const changed=this.family!==options.character;
      if(changed)await this.unload();
      this.previewOptions={...options};
      for(const name of ['placement','appearance','launcher','notifications'])this.setAttribute(name,options[name]);
      this.allowed=allowed;
      this.family=options.character;
      this.select.replaceChildren(...allowed.map(id=>new Option(catalog.find(choice=>choice.id===id).name,id)));
      this.select.value=this.family;
      this.updateLauncher();
      if(changed&&(this.inline||this.panel.open))await this.mount();
    });
  }
  colorsFor(family){
    const saved=this.store.preference('colors-'+family);
    if(saved!==null&&saved!==undefined&&saved!==''){
      try{return cleanColors(JSON.parse(saved));}catch{}
    }
    return readColorMap(this.getAttribute('colors'))[family]||{};
  }
  updateLauncher(state){
    this.colorControls?.update(this.family,this.colorsFor(this.family));
    if(!state){try{state=this.store.load(this.family)?.state;}catch{ /* Recovery stays in the normal open flow. */ }}
    const inactive=inactiveSince(this.store,this.family);
    this.shadowRoot.querySelector('.pet-identity').textContent=inactive?`${catalog.find(choice=>choice.id===this.family).name} · Inactive`:state?petLabel(this.family,state):`${catalog.find(choice=>choice.id===this.family).name} · Not started`;
    const care=this.shadowRoot.querySelector('.pet-care');
    care.hidden=!state;
    care.textContent=state?`Care: ${inactive||state.vacationAt>0?'Paused':state.isDead?'Remembered':careGrade(state).label}`:'';
    const pause=this.shadowRoot.querySelector('.inactive-option');if(pause)pause.hidden=!!inactive||!state;
    this.shadowRoot.querySelector('.game-options').hidden=!!inactive||!state;
    const reset=this.shadowRoot.querySelector('.settings-reset');if(reset)reset.hidden=!!inactive||!state;
    this.shadowRoot.querySelector('.export').disabled=!state;
    if(state)this.careStates.set(this.family,{state,stale:!this.ready});
    const button=this.shadowRoot.querySelector('.launcher');
    const preferences=this.launcherPreferences();
    this.launcherSettings?.update();
    const brand=preferences.brand||(!this.previewOptions&&!hasActivePets(this.store,this.allowed,this.careStates));
    button.classList.toggle('brand-launcher',brand);
    button.innerHTML=brand?`<img class="brand-egg" src="${asset('./widget/egg.svg')}" alt=""><span class="launcher-label">lilgotchi</span>`:launcherArt(this.family,state||catalog.find(choice=>choice.id===this.family),{shell:this.getAttribute('launcher')!=='pet',eink:this.store.preference('eink')==='true',colors:this.colorsFor(this.family)});
    const rows=this.allowed.flatMap(family=>{
      if(inactiveSince(this.store,family))return [];
      const entry=this.careStates.get(family);
      const needs=careNeeds(entry?.state,this.store.preference(`memorial-${family}`));
      return needs.length?[{family,needs,stale:entry.stale}]:[];
    });
    const count=rows.reduce((sum,row)=>sum+row.needs.length,0);
    const enabled=preferences.notifications;
    if(enabled&&count)button.insertAdjacentHTML('beforeend',`<span class="care-badge" aria-hidden="true">${count>99?'99+':count}</span>`);
    const label=`Open lilgotchi${enabled&&count?`, ${count} ${count===1?'notification':'notifications'}`:''}`;
    button.setAttribute('aria-label',label);button.title=label;
    const details=this.shadowRoot.querySelector('.care-needs');
    details.hidden=!enabled||!count;
    details.querySelector('summary').textContent=`${count} ${count===1?'thing needs':'things need'} attention`;
    const list=details.querySelector('.needs-list');
    // Preserve keyboard focus while care updates arrive from the frame.
    const signature=JSON.stringify(rows);
    if(signature===this.careSignature)return;
    this.careSignature=signature;list.replaceChildren();
    for(const row of rows){
      const item=document.createElement('button');
      item.textContent=`${catalog.find(choice=>choice.id===row.family).name}: ${row.needs.join(', ')}${row.stale?' (last saved)':''}`;
      item.addEventListener('click',async()=>{
        await this.setCharacter(row.family);
        const entry=this.careStates.get(row.family);
        if(entry?.state.isDead){
          this.store.preference(`memorial-${row.family}`,entry.state.bornAt);
          this.shadowRoot.querySelector('.save-help').open=true;
          this.shadowRoot.querySelector('.pet-history').open=true;
          this.updateLauncher();
        }
        this.select.focus();
      });
      list.append(item);
    }
  }
  async refreshCare(){
    const entries=await refreshCare(this.store,this.allowed,this.frame?this.family:null);
    if(!this.isConnected)return;
    for(const entry of entries){this.careStates.set(entry.family,entry);this.rememberDeath(entry.family,entry.state);}
    this.renderHistory();this.updateLauncher();
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
  fail(error){
    this.select.value=this.family;this.status(error.message||'Could not load lilgotchi.',true);
    const container=this.shadowRoot.querySelector('.frame');
    container.classList.remove('is-loading');container.removeAttribute('aria-busy');container.style.minHeight='';
    this.shadowRoot.querySelector('.retry').hidden=false;this.emit('error',{message:error.message||'Unknown error'});
  }
  open(){return this.serial(async()=>{
    if(!this.isConnected)return;
    if(!this.inline && !this.panel.open){this.panel.showModal();lockPage(this);this.shadowRoot.querySelector('.close').focus();}
    await this.refreshCare();
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
  makeInactive(){return this.serial(async()=>{
    const family=this.family;
    await this.unload();
    if(!await this.store.acquire(family))throw new Error('Close the other page using this pet first.');
    try{this.store.preference(`inactive-${family}`,Date.now());}
    finally{this.store.release(family);}
    this.updateLauncher();await this.mount();
    this.shadowRoot.querySelector('.save-help').open=false;
    this.shadowRoot.querySelector('.inactive-card button')?.focus();
  });}
  startInactive(){return this.serial(async()=>{
    const family=this.family,since=inactiveSince(this.store,family);
    if(!since)return;
    if(!await this.store.acquire(family))throw new Error('Close the other page using this pet first.');
    try{
      const saved=this.store.load(family);
      if(saved)this.store.save(family,resumeInactive(saved.state,since));
      this.store.preference(`inactive-${family}`,0);
    }finally{this.store.release(family);}
    await this.mount();this.updateLauncher();this.select.focus();
  });}
  startPet(){
    const family=this.family;
    return this.serial(async()=>{
      if(this.family!==family)return;
      await this.unload();
      await this.mount(true);
      this.updateLauncher();this.select.focus();
    });
  }
  async mount(startNew=false){
    const container=this.shadowRoot.querySelector('.frame');
    container.textContent='';
    if(inactiveSince(this.store,this.family)){
      container.classList.remove('is-loading');container.removeAttribute('aria-busy');container.style.minHeight='';
      const card=document.createElement('div');card.className='inactive-card';
      const title=document.createElement('h3');title.textContent=`${catalog.find(choice=>choice.id===this.family).name} is inactive`;
      const text=document.createElement('p');text.textContent='Your progress is saved. No growth, care or notifications until you start this pet again.';
      const button=document.createElement('button');button.textContent='Start pet';button.addEventListener('click',()=>this.startInactive());
      card.append(title,text,button);container.append(card);
      this.status('Inactive');this.shadowRoot.querySelector('.retry').hidden=true;
      this.shadowRoot.querySelector('.return-summary').hidden=true;return;
    }
    container.classList.add('is-loading');
    container.setAttribute('aria-busy','true');
    this.shadowRoot.querySelector('.retry').hidden=true;
    this.status('Loading your pet…');
    let saved;
    if(!await this.store.acquire(this.family)){
      container.innerHTML='<p class="loading">This pet is active in another browser tab or page. Close that tab or page, then try again here. Closing its pet drawer keeps it active.</p>';
      this.status('Read only while another window is playing.');
      container.classList.remove('is-loading');container.removeAttribute('aria-busy');container.style.minHeight='';
      this.shadowRoot.querySelector('.retry').hidden=false;return;
    }
    try {
      if(this.hasAttribute('migrate-legacy'))this.store.migrateLegacy(this.family);
      saved=this.store.load(this.family);
      this.returnState=saved && Date.now()-saved.savedAt>60000?saved.state:null;
      this.shadowRoot.querySelector('.return-summary').hidden=true;
    } catch(error){this.store.release(this.family);this.fail(error);return;}
    if(!this.isConnected){this.store.release(this.family);return;}
    if(!saved&&!startNew){
      this.store.release(this.family);
      container.classList.remove('is-loading');container.removeAttribute('aria-busy');container.style.minHeight='';
      const card=document.createElement('div');card.className='inactive-card';
      const title=document.createElement('h3');title.textContent=`Meet ${catalog.find(choice=>choice.id===this.family).name}`;
      const text=document.createElement('p');text.textContent='Start your pet when you’re ready. Until then, there’s no countdown or care to keep up with.';
      const button=document.createElement('button');button.textContent='Start pet';button.addEventListener('click',()=>this.startPet());
      card.append(title,text,button);container.append(card);
      this.status('Not started');this.shadowRoot.querySelector('.retry').hidden=true;
      this.updateLauncher();return;
    }
    const frame=document.createElement('iframe');
    this.frame=frame;
    frame.style.height='340px';
    frame.style.visibility='hidden';
    frame.title=`${catalog.find(choice=>choice.id===this.family).name} virtual pet game`;
    const url=new URL('./pets/game.html',import.meta.url);
    const nonce=crypto.randomUUID();
    url.search=new URLSearchParams({pet:legacyFamily[this.family],character:this.family,embed:'1',parentOrigin:location.origin,nonce});
    const channel=new MessageChannel();
    this.port=channel.port1;
    const activeFamily=this.family;
    this.port.onmessage=event=>{if(this.frame===frame)this.receive(event.data,activeFamily);};
    frame.addEventListener('load',()=>{
      if(this.frame!==frame)return;
      frame.contentWindow.postMessage({type:'lilgotchi:connect',nonce,state:saved?.state||null,muted:this.hasAttribute('muted') || this.store.preference('muted')!=='false',eink:this.store.preference('eink')==='true',scanlines:this.store.preference('scanlines')==='true',colors:this.colorsFor(activeFamily)},url.origin,[channel.port2]);
    },{once:true});
    frame.src=url.href;container.append(frame);
    this.loadTimeout=setTimeout(()=>{if(this.frame===frame && !this.ready)this.fail(new Error('The game did not load. Check that all widget files are available.'));},12000);
    this.heartbeat=setInterval(()=>{
      if(!this.store.renew(activeFamily)) {this.fail(new Error('This pet is now active elsewhere. Reopen it to continue.'));this.detachFrame();this.store.release(activeFamily);}
    },5000);
  }
  receive(message,family){
    if(!message || family!==this.family || typeof message.type!=='string')return;
    if(message.type==='configuration')this.settings?.update(message.configuration);
    if(message.type==='care-status' && validState(message.state))this.updateLauncher(message.state);
    if(message.type==='scroll' && Number.isFinite(message.delta) && Math.abs(message.delta)<=1000){
      if(this.inline)window.scrollBy(0,message.delta);else this.panel.scrollBy(0,message.delta);
    }
    if(message.type==='resize' && Number.isSafeInteger(message.height) && message.height>=100 && message.height<=1200 && this.frame)this.frame.style.height=`${message.height}px`;
    if(message.type==='save'){
      try{this.savePet(family,message.state);this.status(this.store.persistent?'Saved in this browser':'Progress lasts for this visit');this.savedFeedback(message.state);}
      catch(error){this.fail(error);this.detachFrame();this.store.release(family);}
    }
    if(message.type==='ready'){
      this.ready=true;this.settings?.setReady(true);clearTimeout(this.loadTimeout);
      if(this.frame)this.frame.style.visibility='visible';
      const container=this.shadowRoot.querySelector('.frame');
      container.classList.remove('is-loading');container.removeAttribute('aria-busy');container.style.minHeight='';
      this.emit('ready',{character:family});
    }
    if(message.type==='snapshot' && Number.isSafeInteger(message.id))this.pending.get(message.id)?.(message.state);
    if(message.type==='close')this.close();
    if(message.type==='preference' && ['muted','eink','scanlines'].includes(message.name) && typeof message.value==='boolean'){this.store.preference(message.name,message.value);if(message.name==='eink')this.updateLauncher();}
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
    // Keep the drawer's space while the next pet connects and paints.
    const container=this.shadowRoot.querySelector('.frame');
    if(this.frame && container)container.style.minHeight=`${Math.ceil(this.frame.getBoundingClientRect().height)}px`;
    clearInterval(this.heartbeat);clearTimeout(this.loadTimeout);
    this.frame?.remove();this.frame=null;this.ready=false;this.settings?.setReady(false);
    this.port?.close();this.port=null;
    for(const resolve of this.pending.values())resolve(null);
    this.pending.clear();
  }
  async unload(){await this.snapshot(true);this.detachFrame();this.store.release(this.family);}
  disconnectedCallback(){
    // Removal keeps the latest action save. The close method waits for its final snapshot.
    clearInterval(this.careTimer);window.removeEventListener('storage',this.refreshNotifications);document.removeEventListener('visibilitychange',this.refreshNotifications);
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
      this.prepareFileImport(text,this.shadowRoot.querySelector('.import-button'));
    }catch(error){if(request===this.importPreviewId)this.fail(error);}
    finally{this.shadowRoot.querySelector('.file').value='';}
  }
  restoreImportFocus(){
    const target=this.importFocus;
    if(target && visibleControl(target))target.focus();else this.select.focus();
    this.importFocus=null;
  }
  prepareFileImport(text,origin=this.shadowRoot.querySelector('.import-button')){
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
      this.store.preference(`inactive-${data.family}`,0);
      this.rememberDeath(data.family,data.state);this.renderHistory();
      this.family=data.family;this.updateLauncher();this.select.value=data.family;this.store.preference('character',data.family);
      this.shadowRoot.querySelector('.import').hidden=true;this.importData=null;
    }finally{this.store.release(data.family);}
    await this.mount();
    this.importFocus=null;this.select.focus();
  });}
}
if(!customElements.get('lil-gotchi'))customElements.define('lil-gotchi',LilGotchi);
export { LilGotchi };
