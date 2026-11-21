import { person, pet } from '../eightbit/art.js';
import { createResidents, drawResident, drawArcadeRegular, arcadePersonScale, arcadeRegulars } from '../eightbit/residents.js';
import { drawScout } from '../eightbit/scout.js';
import { campusScale, campusWalker } from '../eightbit/campus-life.js';

const manifest = await fetch('./manifest.json').then(r=>r.json());
const directions = manifest.style.directions;
const image = async src => { const img=new Image();img.src=src;await img.decode();return img; };
const backgrounds = Object.fromEntries(await Promise.all(['town','arcade','cabin','rooftop'].map(async id=>[id,await image(`../eightbit/assets/${id}.png`)])));
document.querySelector('#summary').textContent=`${manifest.summary.models} model entries. 752 direction and action definitions. ${manifest.summary.targets} interaction points. ${manifest.summary.playerFacingAndCarryCases} player arrival cases with four facings and both pizza states.`;
const draftNotes={main:'Proposed title image. The current game opens straight into town. This does not replace the separate portfolio homepage.',town:'Closer scenery shapes. Fix BASIL to BASAL and add the SBG sign. Match all character outlines and pixel sizes.',arcade:'Clearer machine shapes and separate contact poses. The cabinet hands still need exact control anchors. Restore the player hoodie, shorts and red shoes.',cabin:'Keep the house layout. Simplify the character pixels to match the room. Desk, chair and keyboard need separate contact layers.',rooftop:'Keep the skyline and clear landing. Restore the player clothes and the actual companion sprite. Check seat depth at the pizza table.'};
for(const id of ['main','town','arcade','cabin','rooftop']){
  const block=document.createElement('article');block.className='draft';
  block.innerHTML=`<h3>${id==='cabin'?'house':id}</h3><p>${draftNotes[id]}</p><div class="comparison">${id==='main'?'':`<figure><img src="../eightbit/assets/${id}.png" alt="Current ${id} background"><figcaption>current background</figcaption></figure>`}<figure><img src="drafts/${id}.png" alt="Proposed ${id} pixel art"><figcaption>draft for review</figcaption></figure></div>`;
  document.querySelector('#draft-grid').append(block);
}
function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function models(){
  const root=document.querySelector('#model-grid');root.replaceChildren();const pose=document.querySelector('#pose').value;
  const people=[{id:'taylor'},...createResidents().slice(0,8).map((r,i)=>({...r,id:`resident ${i+1}`})),...arcadeRegulars.map((r,i)=>({...r,id:`arcade regular ${i+1}`})),...Array.from({length:3},(_,i)=>({...campusWalker(0,i),id:`campus student ${i+1}`}))];
  for(const item of people){
    const article=document.createElement('article');const title=document.createElement('h3');title.textContent=item.id;article.append(title);
    const c=makeCanvas(288,110),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    directions.forEach((direction,i)=>{
      const x=36+i*72,y=77;
      if(item.id==='taylor')person(ctx,x,y,direction,pose==='walk',110,pose==='carry',1);
      else {
        const r={...item,x,y,direction,look:{...item.look,scale:1},walking:pose==='walk',resting:pose==='sit'?'sit':null,seated:false,chatting:pose==='talk',playing:pose==='cabinet'?'cabinet':null};
        if(r.playing)drawArcadeRegular(ctx,r,110,true);else drawResident(ctx,r,110,false);
      }
      ctx.fillStyle='#f3e2ba';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(direction,x,100);
    });article.append(c);root.append(article);
  }
}
function contacts(){
  const room=document.querySelector('#room').value,carrying=document.querySelector('#carry').checked,root=document.querySelector('#contact-grid');root.replaceChildren();
  for(const point of manifest.targets.filter(p=>p.scene===room)){
    const article=document.createElement('article');article.className='contact';
    const title=document.createElement('h3');title.textContent=`${point.id} · ${point.label}`;article.append(title);
    const detail=document.createElement('p');detail.textContent=point.contactSpec;article.append(detail);
    const poses=document.createElement('div');poses.className='poses';
    directions.forEach(direction=>{
      const fig=document.createElement('figure'),c=makeCanvas(240,180),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
      const scale=room==='arcade'?arcadePersonScale:room==='town'?.9*campusScale(point.x,point.y):1;
      ctx.save();ctx.translate(120-point.x,145-point.y);ctx.drawImage(backgrounds[room],0,0,room==='town'?1536:768,room==='town'?1024:512);
      person(ctx,point.x,point.y,direction,false,0,carrying,scale);
      ctx.fillStyle='#ffd083';ctx.fillRect(point.x-10,point.y+5,20,1);ctx.restore();
      const caption=document.createElement('figcaption');caption.textContent=direction;fig.append(c,caption);poses.append(fig);
    });article.append(poses);root.append(article);
  }
}
const ctx=document.querySelector('#animals').getContext('2d');ctx.imageSmoothingEnabled=false;
const scouts=[{direction:1},{direction:-1},{vertical:true,entering:false},{vertical:true,entering:true},{sleep:true}];
scouts.forEach((s,i)=>{drawScout(ctx,{x:80+i*150,y:67,...s},0,s.sleep);});
['original','slice','lilgotchi','cypunk'].forEach((id,r)=>{
  ctx.fillStyle='#f3e2ba';ctx.font='12px monospace';ctx.fillText(id,12,115+r*58);
  [...directions,'happy','sleep'].forEach((direction,i)=>pet(ctx,200+i*120,130+r*58,id,0,direction==='sleep',1,directions.includes(direction)?direction:'down',direction==='happy'));
});
document.querySelector('#pose').addEventListener('change',models);
document.querySelector('#room').addEventListener('change',contacts);
document.querySelector('#carry').addEventListener('change',contacts);
document.querySelector('#compact').addEventListener('change',event=>document.querySelector('#contacts').classList.toggle('compact',event.target.checked));
models();contacts();
