const actionIds=Object.freeze({vacation:'vacation-toggle',scanlines:'scanline-toggle',eink:'eink-toggle',mute:'mute-btn',reset:'reset-game-btn'});
export function configurationActionId(action,classic=true){
  return typeof action==='string' && Object.hasOwn(actionIds,action) && (action!=='eink'||classic) ? actionIds[action] : null;
}
export function validConfiguration(value){
  return !!value && ['vacation','scanlines','eink','muted','classic'].every(key=>typeof value[key]==='boolean');
}
export function mountSettings(container,sendCommand,pauseContainer=container){
  const doc=container.ownerDocument;
  const rows=new Map();
  const specs=[
    ['vacation','Vacation','Pause care and growth until you return.'],
    ['eink','E ink theme','A simple black and white screen.'],
    ['mute','Sound','Little sounds while you play.'],
    ['scanlines','LCD scanlines','Faint lines for an old LCD look.'],
  ];
  let ready=false,configuration=null;
  for(const [action,label,description] of specs){
    const row=doc.createElement('div');row.className='setting-row';
    const copy=doc.createElement('div');copy.className='setting-copy';
    const title=doc.createElement('strong');title.textContent=label;
    const hint=doc.createElement('p');hint.textContent=description;copy.append(title,hint);
    const button=doc.createElement('button');button.type='button';button.className='setting-toggle';
    button.setAttribute('role','switch');button.setAttribute('aria-label',label);button.setAttribute('aria-checked','false');
    const state=doc.createElement('span');state.setAttribute('aria-hidden','true');state.textContent='Off';button.append(state);
    button.disabled=true;
    button.addEventListener('click',()=>{if(ready&&configuration&&configurationActionId(action,configuration.classic))sendCommand(action);});
    row.append(copy,button);(action==='vacation'?pauseContainer:container).append(row);rows.set(action,{row,button,state});
  }
  const reset=doc.createElement('div');reset.className='settings-reset';
  const hint=doc.createElement('p');hint.textContent='Start fresh with this pet. You will be asked to confirm.';
  const restart=doc.createElement('button');restart.type='button';restart.textContent='Start again';restart.disabled=true;
  restart.addEventListener('click',()=>{if(ready&&configuration)sendCommand('reset');});
  reset.append(hint,restart);pauseContainer.append(reset);
  function render(){
    for(const [action,{row,button,state}] of rows){
      row.hidden=action==='eink'&&!configuration?.classic;
      const enabled=configuration ? action==='mute'?!configuration.muted:configuration[action] : false;
      button.setAttribute('aria-checked',String(enabled));state.textContent=enabled?'On':'Off';
      button.disabled=!ready||!configuration;
    }
    restart.disabled=!ready||!configuration;
  }
  return {
    update(value){if(!validConfiguration(value))return;configuration={...value};render();},
    setReady(value){ready=value===true;if(!ready)configuration=null;render();},
  };
}
