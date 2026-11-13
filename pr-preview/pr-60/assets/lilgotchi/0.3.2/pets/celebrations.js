import { characterName } from './skins.js';

const stages=new Set(['baby','child','teen','adult']);
export function growthEvent(previous,next) {
  if(!previous||!next||next.isDead||!stages.has(next.stage))return null;
  if(previous.character===next.character&&previous.stage===next.stage)return null;
  return {
    key:`${next.bornAt}:${next.stageStartTime}:${next.character}`,
    character:next.character,
    stage:next.stage,
    hatched:previous.stage==='egg',
  };
}

// The card is outside the LCD and never steals focus or dismisses itself.
export class GrowthCelebration {
  constructor(element,{nameFor=characterName}={}) {
    this.element=element;
    this.nameFor=nameFor;
    this.dismissed=new Set();
    this.current=null;
  }
  observe(previous,next) {
    const event=growthEvent(previous,next);
    if(event)this.show(event);
    return event;
  }
  show(event) {
    if(!event||this.dismissed.has(event.key)||this.current?.key===event.key||!this.element)return;
    this.current=event;
    const doc=this.element.ownerDocument;
    const text=doc.createElement('p');
    text.className='growth-message';
    text.setAttribute('role','status');
    text.textContent=`${event.hatched?'Just hatched':'A little growth'}! Meet ${this.nameFor(event.character)}, your ${event.stage} pet.`;
    const close=doc.createElement('button');
    close.type='button';close.textContent='Got it';
    close.setAttribute('aria-label','Dismiss growth update');
    close.addEventListener('click',()=>this.dismiss());
    this.element.replaceChildren(text,close);
    this.element.classList.add('growth-card');
    this.element.hidden=false;
  }
  dismiss() {
    if(this.current)this.dismissed.add(this.current.key);
    if(this.element)this.element.hidden=true;
    this.current=null;
  }
  clear() {
    if(this.element){this.element.hidden=true;this.element.replaceChildren();}
    this.current=null;
    this.dismissed.clear();
  }
}
