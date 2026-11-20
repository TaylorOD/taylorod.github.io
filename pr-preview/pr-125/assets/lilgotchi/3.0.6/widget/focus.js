// Closed details can report layout rectangles for controls they do not display.
export function visibleControl(node) {
  if(node.disabled || !node.getClientRects().length)return false;
  const closed=node.closest('details:not([open])');
  return !closed || (node.tagName==='SUMMARY' && node.parentElement===closed);
}
