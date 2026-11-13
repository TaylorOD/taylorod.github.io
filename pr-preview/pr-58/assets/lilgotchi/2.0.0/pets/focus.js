export function visibleEnabledControl(node) {
  if(node.disabled || node.hidden || node.closest?.('[hidden], [inert]'))return false;
  if(node.getClientRects && !node.getClientRects().length)return false;
  if(typeof getComputedStyle==='function' && getComputedStyle(node).visibility==='hidden')return false;
  const closed=node.closest?.('details:not([open])');
  return !closed || (node.tagName==='SUMMARY' && node.parentElement===closed);
}

export function overlayControls(overlay) {
  const nodes=overlay.querySelectorAll?.('button, input, select, textarea, a[href], summary') || [overlay.querySelector?.('button')].filter(Boolean);
  return [...nodes].filter(visibleEnabledControl);
}

// A game can focus its dialog rather than a button when a round starts.
export function trapOverlayTab(event,overlay,active=document.activeElement) {
  if(event.key!=='Tab')return;
  const controls=overlayControls(overlay);
  const first=controls[0],last=controls.at(-1);
  if(!controls.includes(active)){
    event.preventDefault();
    (event.shiftKey?last:first)?.focus();
  }else if(event.shiftKey&&active===first){
    event.preventDefault();last.focus();
  }else if(!event.shiftKey&&active===last){
    event.preventDefault();first.focus();
  }
}
