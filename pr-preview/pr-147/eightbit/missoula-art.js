import { box, polygon, text } from './art.js';

// Main Hall and the hillside M, based on the university's campus photographs.
// https://www.umt.edu/news/2023/06/060623fulb.php
export function mountSentinel(ctx, width) {
  ctx.save(); ctx.scale(width / 1024, 1);
  polygon(ctx, [[-60,224],[34,190],[97,157],[170,130],[242,108],[306,91],[347,116],[398,164],[455,224]], '#7e886c');
  polygon(ctx, [[306,91],[347,116],[398,164],[455,224],[323,224],[338,178],[316,142]], '#677b65');
  for (let i=0;i<60;i++) {
    const x=90+i*47%265, y=159+i*19%49;
    box(ctx,x,y,4+i%3*2,1,'#899075');
  }
  // Switchbacks climb the slope beneath the white letter.
  const trail=[[256,204],[283,193],[261,185],[291,173],[271,163],[295,151]];
  for(let i=1;i<trail.length;i++) {
    const [x,y]=trail[i-1], [xx,yy]=trail[i];
    polygon(ctx,[[x,y],[xx,yy],[xx+2,yy+2],[x+2,y+2]],'#a9a087');
  }
  polygon(ctx,[[268,142],[274,128],[280,128],[284,135],[293,128],[300,128],[294,142],[288,142],[292,134],[283,141],[278,134],[274,142]],'#f0e6c9');
  ctx.restore();
}

export function universityCampus(ctx) {
  // The Oval and small neighboring roofs establish distance from the street.
  polygon(ctx,[[102,266],[128,256],[273,256],[298,266],[273,280],[128,280]],'#638365');
  polygon(ctx,[[192,263],[205,263],[205,290],[189,448],[139,448],[190,290]],'#b09d81');
  polygon(ctx,[[195,272],[202,272],[201,290],[185,448],[145,448],[194,290]],'#c0af8e');
  for (let y=296; y<448; y+=18) {
    const depth=(y-290)/158, center=198-34*depth, half=4+16*depth;
    box(ctx,center-half,y,half*2,1,'#a4977c');
  }
  for(const [x,w] of [[106,33],[272,31]]) {
    box(ctx,x,231,w,29,'#967b69'); polygon(ctx,[[x-3,231],[x+6,220],[x+w-6,220],[x+w+3,231]],'#637776');
    for(let xx=x+5;xx<x+w-3;xx+=9) box(ctx,xx,239,4,11,'#4a686b');
  }
  box(ctx,132,219,136,45,'#aa7059');
  polygon(ctx,[[125,220],[144,203],[255,203],[274,220]],'#607b7c');
  box(ctx,132,221,136,3,'#c09b7a'); box(ctx,132,245,136,2,'#c09b7a'); box(ctx,132,261,136,4,'#c3b29a');
  for(const x of [140,153,166,179,222,235,248,260]) {
    box(ctx,x,227,6,13,'#3f5960'); box(ctx,x,250,6,10,'#3f5960');
    box(ctx,x-1,226,8,2,'#d1ae87'); box(ctx,x+2,229,1,11,'#ad9780');
  }
  for(const x of [150,242]) {
    polygon(ctx,[[x-11,219],[x,204],[x+11,219]],'#b67b60');
    box(ctx,x-4,214,8,9,'#465f66'); box(ctx,x-5,222,10,2,'#d3ac87');
  }
  // Tall central clock tower, copper roof, small corner pinnacles and arched entry.
  box(ctx,188,188,25,76,'#b67d63'); box(ctx,188,190,3,71,'#d09b77'); box(ctx,210,190,3,71,'#8e6358');
  polygon(ctx,[[185,189],[201,158],[216,189]],'#72a39a');
  polygon(ctx,[[201,158],[216,189],[202,189]],'#558782'); box(ctx,200,153,2,8,'#ddd2af');
  for(const x of [188,211]) { box(ctx,x,181,2,12,'#dbba8d'); polygon(ctx,[[x-2,181],[x+1,173],[x+4,181]],'#88aaa0'); }
  box(ctx,190,195,21,2,'#d6ae86');
  box(ctx,195,201,12,12,'#ddc5a0'); box(ctx,197,203,8,8,'#334e58');
  box(ctx,200,203,1,5,'#eee0b9'); box(ctx,200,207,4,1,'#eee0b9');
  box(ctx,190,217,21,2,'#d2a985');
  for(const y of [224,238]) for(const x of [194,203]) { box(ctx,x,y,5,10,'#435b62'); box(ctx,x,y-1,5,2,'#d0a07d'); }
  box(ctx,189,251,24,14,'#c4b49a'); box(ctx,196,255,10,10,'#324f55'); box(ctx,198,253,6,3,'#324f55');
  box(ctx,192,265,18,2,'#d2bda0'); box(ctx,189,267,24,2,'#a69e85');
  grizzlyStatue(ctx, 133, 344);
}

// Rudy Autio's upright grizzly rests its forepaws on a rock at the Oval.
function grizzlyStatue(ctx, x, y) {
  ctx.save(); ctx.translate(x,y);
  polygon(ctx,[[-29,1],[-17,-7],[18,-7],[31,1],[20,10],[-21,10]],'#48634e');
  box(ctx,-24,-9,48,13,'#8a8975'); box(ctx,-20,-14,40,7,'#aaa28a');
  polygon(ctx,[[1,-15],[0,-39],[9,-48],[20,-43],[25,-15]],'#5c665b');
  polygon(ctx,[[-19,-17],[-20,-41],[-14,-59],[-5,-63],[3,-53],[1,-36],[-7,-16]],'#655c45');
  box(ctx,-17,-65,17,17,'#756a4d'); box(ctx,-14,-69,5,6,'#655c45'); box(ctx,-2,-66,4,5,'#655c45');
  box(ctx,-2,-59,11,7,'#81765a'); box(ctx,6,-59,4,4,'#3e4438'); box(ctx,-2,-62,2,2,'#303c34');
  polygon(ctx,[[-4,-49],[5,-47],[15,-45],[16,-40],[4,-40],[-9,-42]],'#7c7152');
  box(ctx,-20,-20,9,7,'#494c3b'); box(ctx,-8,-20,9,7,'#494c3b');
  box(ctx,-16,-48,3,18,'#8a7b58');
  box(ctx,-13,-7,27,10,'#6b353e'); text(ctx,'UM',0,-2,9,'#e6d5b5');
  ctx.restore();
}
