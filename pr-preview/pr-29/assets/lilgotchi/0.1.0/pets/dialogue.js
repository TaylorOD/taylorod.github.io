import { families } from './catalog.js';
// Optional dialogue context. No provider code or credentials belong here.
export const personalities={
      babytchi:'a curious newborn baby, very simple speech, coos and babbles',
      marutchi:'a playful child, energetic, uses simple words',
      tamatchi:'a well-behaved teenager, friendly and eager to learn',
      kuchitamatchi:'a mischievous teenager with a big appetite, a bit sassy',
      mametchi:'intelligent, studious, polite, sometimes nerdy',
      ginjirotchi:'friendly, gentle, easygoing, loves everyone',
      maskutchi:'mysterious, cool, a bit shy but loyal',
      kuchipatchi:'laid-back, food-loving, cheerful, always hungry',
      nyorotchi:'super chill, unbothered, lazy but content',
      tarakotchi:'grumpy, disheveled, low-energy, sarcastic',
      oyajitchi:'a wise old man, eccentric, philosophical, tells stories',
    };
export const triggers=Object.freeze(['fed_meal','fed_snack','played_won','played_lost','cleaned','woke_up','going_sleep','hungry','sad','sick','evolved','discipline','idle','misbehave']);
export const LIMIT=280;
export function contextFor(state,event,family,name){
  return {event,family,character:state.character,name,personality:personalities[state.character],hunger:state.hunger,happiness:state.happiness,discipline:state.discipline,age:state.age,weight:state.weight};
}
export function validContext(c){
  return !!c && Object.keys(c).sort().join(',')==='age,character,discipline,event,family,happiness,hunger,name,personality,weight' && triggers.includes(c.event) && families.includes(c.family) && Object.hasOwn(personalities,c.character) && c.personality===personalities[c.character] && typeof c.name==='string' && c.name.length>0 && c.name.length<=50 && ['hunger','happiness','discipline','age','weight'].every(k=>Number.isFinite(c[k]) && c[k]>=0) && c.hunger<=4 && c.happiness<=4 && c.discipline<=100 && c.age<=1000 && c.weight<=1000;
}
export const validReply=text=>typeof text==='string' && text.trim().length>0 && text.length<=LIMIT;
export class Dialogue {
  constructor(send,available=false,display=()=>{}){this.send=send;this.available=available;this.enabled=false;this.display=display;this.id=0;}
  get on(){return this.available && this.enabled;}
  cancel(){clearTimeout(this.timer);if(this.busy)this.send({type:'dialogue-cancel',id:this.id});this.id++;this.busy=false;this.last=null;this.display('','');}
  talk(context){
    if(!this.on || this.busy || !validContext(context))return;
    this.last=context;this.busy=true;const id=++this.id;
    this.display('Thinking...','busy');
    this.timer=setTimeout(()=>{this.send({type:'dialogue-cancel',id});this.receive({id,error:true});},10000);
    this.send({type:'dialogue-request',id,context});
  }
  receive(message){
    if(!this.busy || message.id!==this.id)return;
    clearTimeout(this.timer);this.busy=false;
    if(message.error || !validReply(message.text))this.display('Could not get a reply. Try again.','error');
    else this.display(message.text,'reply');
  }
  retry(){if(this.last)this.talk(this.last);}
}
