import { catalog, families } from '../pets/catalog.js';
import { validEnvelope } from './save-store.js';
import { sliceNames } from '../pets/slice-sprites.js';
import { cyberpunkNames } from '../pets/cyberpunk-sprites.js';

export const HISTORY_LIMIT=12;
export const historyKey=(instance,family)=>`lilgotchi:history:v1:${encodeURIComponent(instance)}:${family}`;
const fields=['age','bornAt','character','family','recordedAt'];
const identities=new Set(catalog.map(choice=>choice.character));
const time=value=>Number.isSafeInteger(value)&&value>=0;
export function validHistoryEntry(entry,family){
  return !!entry && typeof entry==='object' && !Array.isArray(entry) &&
    Object.keys(entry).sort().join(',')===fields.join(',') &&
    families.includes(entry.family) && (family===undefined || entry.family===family) &&
    identities.has(entry.character) && Number.isSafeInteger(entry.age) && entry.age>=0 && entry.age<=1000000 &&
    time(entry.bornAt) && time(entry.recordedAt) && entry.recordedAt>=entry.bornAt;
}
const newest=(a,b)=>b.recordedAt-a.recordedAt || b.bornAt-a.bornAt || a.family.localeCompare(b.family);
export class PetHistory {
  constructor(store){this.store=store;}
  list(family){
    if(family!==undefined && !families.includes(family))throw new Error('Unknown history character.');
    const entries=[];
    for(const id of family===undefined?families:[family]){
      const raw=this.store.read(historyKey(this.store.instance,id));
      if(raw===null)continue;
      let data;
      try{if(raw.length>16384)throw new Error();data=JSON.parse(raw);}catch{throw new Error('Pet history needs recovery. It has not been replaced.');}
      if(!data || data.schema!==1 || data.instance!==this.store.instance || data.family!==id || !Array.isArray(data.entries) ||
        data.entries.length>HISTORY_LIMIT || !data.entries.every(entry=>validHistoryEntry(entry,id)) ||
        new Set(data.entries.map(entry=>entry.bornAt)).size!==data.entries.length)throw new Error('Pet history needs recovery. It has not been replaced.');
      entries.push(...data.entries);
    }
    return entries.sort(newest);
  }
  recordDeath(family,state){
    const now=this.store.now();
    if(!families.includes(family) || !time(now) || !validEnvelope({schema:1,instance:this.store.instance,family,revision:1,savedAt:now,state}) || !time(state.bornAt) || state.bornAt>now)throw new Error('Invalid pet history.');
    if(!this.store.owns(family))throw new Error('This pet is active in another window.');
    if(!state.isDead)return false;
    const entries=this.list(family);
    if(entries.some(entry=>entry.bornAt===state.bornAt))return false;
    const entry={family,character:state.character,bornAt:state.bornAt,age:state.age,recordedAt:now};
    if(!validHistoryEntry(entry,family))throw new Error('Invalid pet history.');
    entries.push(entry);entries.sort(newest);entries.length=Math.min(entries.length,HISTORY_LIMIT);
    this.store.write(historyKey(this.store.instance,family),JSON.stringify({schema:1,instance:this.store.instance,family,entries}));
    return true;
  }
  describe(entry){
    if(!validHistoryEntry(entry))throw new Error('Invalid pet history.');
    const choice=catalog.find(choice=>choice.id===entry.family);
    const identity=entry.family==='slice'?sliceNames[entry.character]:entry.family==='cyberpunk'?cyberpunkNames[entry.character]:catalog.find(choice=>choice.character===entry.character)?.name||entry.character;
    return `${choice.name} · ${identity} · ${entry.age} ${entry.age===1?'day':'days'} old`;
  }
}
