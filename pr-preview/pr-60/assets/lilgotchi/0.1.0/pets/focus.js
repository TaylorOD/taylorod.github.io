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
