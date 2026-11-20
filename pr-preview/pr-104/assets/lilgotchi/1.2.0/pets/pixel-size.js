// Whole device pixels keep the grid sharp at fractional browser zoom too.
export function pixelSize(available,dpr=1) {
  const ratio=Number.isFinite(dpr)&&dpr>0?dpr:1;
  const scale=Math.max(1,Math.min(Math.floor(available*ratio/32),Math.round(8*ratio)));
  return {scale,gap:Math.max(1,Math.round(ratio)),width:32*scale,height:16*scale,cssWidth:32*scale/ratio,cssHeight:16*scale/ratio};
}
