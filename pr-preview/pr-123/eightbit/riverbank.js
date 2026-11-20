import { box, polygon } from './art.js';

// Broad clear lanes stay connected to the bridge. Only their soft edges wander.
export function riverbanks(ctx) {
  for (let x=0;x<1024;x+=4) {
    const bend=Math.round(Math.sin(x/115)*4 + Math.sin(x/49)*2);
    const north=596+bend, south=680-bend;
    box(ctx,x,558+bend,4,38,'#9d9d81');
    box(ctx,x,north,4,17-bend,'#547558');
    box(ctx,x,666,4,south-666,'#638266');
    box(ctx,x,south,4,44,'#a3a087');
    box(ctx,x,south+44,4,10,'#53765b');
    box(ctx,x,608+Math.round(Math.sin(x/27)*3),4,4,'#748774');
    box(ctx,x,666+Math.round(Math.cos(x/39)*3),4,4,'#8c967d');
  }
  for(let i=0;i<420;i++) {
    const x=(i*137)%1024, bend=Math.round(Math.sin(x/115)*4+Math.sin(x/49)*2);
    const y=i%2 ? 562+bend+(i*19)%29 : 686-bend+(i*17)%32;
    box(ctx,x,y,i%5?2:4,1,i%3?'#b7b297':'#7d886e');
  }
  for(const [x,y] of [[70,607],[148,606],[290,605],[391,609],[617,670],[766,669],[874,608],[967,669]]) {
    polygon(ctx,[[x-9,y],[x-5,y-5],[x+4,y-6],[x+10,y-1],[x+8,y+3],[x-7,y+3]],'#778476');
    box(ctx,x-4,y-4,8,2,'#a9ae95');
    for(let i=0;i<4;i++) {
      const stem=x+13+i*4, top=y-7-i%3*5;
      box(ctx,stem,top,2,y-top+3,'#8b9b66');
      box(ctx,stem-2,top-2,4,4,i%2?'#697b52':'#a69b69');
    }
  }
  for(let i=0;i<60;i++) {
    const x=(i*71)%1024, y=732+(i*13)%22;
    box(ctx,x,y,2,5,'#78915e'); box(ctx,x-2,y+2,6,2,'#658354');
  }
}
