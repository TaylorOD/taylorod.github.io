// Visitor choices override the site defaults without changing any pet saves.
export function launcherPreferences(store, launcher, notifications) {
  const brand=store.preference('brand-launcher');
  const alerts=store.preference('notifications');
  return {
    brand:brand==='true'||brand!=='false'&&launcher==='brand',
    notifications:alerts==='true'||alerts!=='false'&&notifications!=='off',
  };
}
export function mountLauncherSettings(container,read,change) {
  const doc=container.ownerDocument,buttons=new Map();
  for(const [key,label,description] of [
    ['brand','Always show lilgotchi logo','Use the logo egg and name for the corner button across all pets.'],
    ['notifications','Show care notifications','Show care counts on the corner button and the needs list.'],
  ]) {
    const row=doc.createElement('div');row.className='setting-row';
    const copy=doc.createElement('div');copy.className='setting-copy';
    const title=doc.createElement('strong');title.textContent=label;
    const hint=doc.createElement('p');hint.textContent=description;copy.append(title,hint);
    const button=doc.createElement('button');button.type='button';button.className='setting-toggle';
    button.setAttribute('role','switch');button.setAttribute('aria-label',label);
    const state=doc.createElement('span');state.setAttribute('aria-hidden','true');button.append(state);
    button.addEventListener('click',()=>{change(key,!read()[key]);render();});
    row.append(copy,button);container.append(row);buttons.set(key,{button,state});
  }
  function render(){for(const [key,{button,state}] of buttons){const on=read()[key];button.setAttribute('aria-checked',String(on));state.textContent=on?'On':'Off';}}
  render();return {update:render};
}
