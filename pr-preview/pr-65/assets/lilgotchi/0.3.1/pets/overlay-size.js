// Measure natural flex content, not the iframe's current viewport height.
export function overlayContentHeight(overlay, styleFor = getComputedStyle) {
  const style = styleFor(overlay);
  const number = value => Number.parseFloat(value) || 0;
  const children = [...overlay.children].filter(node => node.getClientRects().length);
  const content = children.reduce((total, node) => {
    const css = styleFor(node);
    return total + node.getBoundingClientRect().height + number(css.marginTop) + number(css.marginBottom);
  }, 0);
  return Math.ceil(content + Math.max(0, children.length - 1) * number(style.rowGap)
    + number(style.paddingTop) + number(style.paddingBottom)
    + number(style.borderTopWidth) + number(style.borderBottomWidth));
}
