import { validState } from '../pets/valid-state.js';

import { families, legacyFamily, requireAllowed } from '../pets/catalog.js';
export { families, legacyFamily } from '../pets/catalog.js';
const memory = new Map();
const sessionOnly = new Set();
const localOwners = new Map();
const LEASE_MS = 15000;
export const saveKey = (instance, family) => `lilgotchi:v1:${encodeURIComponent(instance)}:${family}`;
const clone = value => JSON.parse(JSON.stringify(value));

export function validEnvelope(data, instance, family) {
  if (!data || data.schema !== 1 || !families.includes(data.family) || typeof data.instance !== 'string') return false;
  if (instance !== undefined && data.instance !== instance) return false;
  if (family !== undefined && data.family !== family) return false;
  if (!Number.isSafeInteger(data.revision) || data.revision < 0 || !Number.isFinite(data.savedAt) || data.savedAt < 0 || !validState(data.state)) return false;
  const state=data.state;
  const identities={egg:['egg'],baby:['babytchi'],child:['marutchi'],teen:['tamatchi','kuchitamatchi'],adult:['mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi']};
  if(state.stage!=='dead' && !identities[state.stage]?.includes(state.character))return false;
  if(state.isDead !== (state.stage==='dead') || state.weight>99 || state.age>1000000)return false;
  for(const key of ['age','weight','careMistakes','snacksInWindow','medDoses','sickCount']) if(!Number.isSafeInteger(state[key]))return false;
  return [null,'tamatchi','kuchitamatchi'].includes(state.prevTeen) && [null,'hungry','sad','misbehave','sick'].includes(state.attentionReason) && (state.attentionCallTime===null || state.attentionCallTime>=0);
}

export function parseImport(text, allowed=families) {
  if (typeof text !== 'string' || text.length > 32768) throw new Error('This save file is too large.');
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('This is not a valid save file.'); }
  if (!validEnvelope(data)) throw new Error('This save has unsupported or invalid game data.');
  requireAllowed(data.family,allowed);
  if (data.savedAt > Date.now() + 300000) throw new Error('This save is dated in the future.');
  for(const key of ['bornAt','stageStartTime','lastHungerDecay','lastHappyDecay','lastPoopTime','lastAgeInc','lastProcessed','snackWindowStart','attentionCallTime']) {
    if(data.state[key]!==null && data.state[key]>Date.now()+300000)throw new Error('This save contains a future game clock.');
  }
  return data;
}

export class SaveStore {
  constructor(instance = 'default', options = {}) {
    this.instance = instance;
    this.owner = options.owner || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    this.now = options.now || Date.now;
    this.locks = options.locks === undefined ? globalThis.navigator?.locks : options.locks;
    this.persistent = true;
    this.revisions = new Map();
    this.releases = new Map();
    try { this.storage = options.storage === undefined ? globalThis.localStorage : options.storage; }
    catch { this.storage = null; }
    if (!this.storage) this.persistent = false;
  }
  read(key) {
    if(sessionOnly.has(key)){this.persistent=false;return memory.get(key)??null;}
    if (!this.persistent && memory.has(key)) return memory.get(key);
    try {
      if (this.storage) {
        const raw = this.storage.getItem(key);
        if (raw !== null) { memory.set(key,raw); return raw; }
        if (this.persistent) return null;
      }
    } catch { this.persistent = false; }
    return memory.get(key) ?? null;
  }
  write(key, value) {
    memory.set(key,value);
    try { if (!this.storage) throw new Error(); this.storage.setItem(key,value); }
    catch { this.persistent = false; sessionOnly.add(key); }
  }
  load(family) {
    const key = saveKey(this.instance,family);
    const raw = this.read(key);
    if (raw===null) { this.revisions.set(family,0); return null; }
    let data;
    try { data=JSON.parse(raw); } catch { throw new Error('Saved progress is damaged. Export it before starting again.'); }
    if (!validEnvelope(data,this.instance,family)) throw new Error('Saved progress needs recovery. It has not been replaced.');
    this.revisions.set(family,data.revision);
    return clone(data);
  }
  migrateLegacy(family) {
    if (!families.includes(family)) throw new Error('Unknown character');
    if (!['default','slice','cyberpunk'].includes(family)) return false;
    if (!this.owns(family)) throw new Error('This pet is active in another window.');
    const key=saveKey(this.instance,family);
    // Check durable storage directly. A failed migration must remain retryable.
    if (this.read(key)!==null) return false;
    if (!this.storage) return false;
    let destination;
    try { destination=this.storage.getItem(key); } catch { this.persistent=false;return false; }
    if (destination!==null) return false;
    const source=`taylor-pocket-pets-p1-v1-${legacyFamily[family]}`;
    const raw=this.storage.getItem(source);
    if (raw===null) return false;
    let state;
    try { state=JSON.parse(raw); } catch { throw new Error('Your old pet needs recovery. Its save has not been changed.'); }
    const envelope={schema:1,instance:this.instance,family,revision:1,savedAt:this.now(),state};
    parseImport(JSON.stringify(envelope));
    const serialized=JSON.stringify(envelope);
    if (!this.owns(family)) throw new Error('This pet is active in another window.');
    this.storage.setItem(key,serialized);
    if (this.storage.getItem(key)!==serialized) throw new Error('Your old pet could not be copied. Try again.');
    memory.set(key,serialized);
    sessionOnly.delete(key);
    this.revisions.set(family,1);
    // The destination itself prevents repeat copies, even if this receipt fails.
    try { this.storage.setItem(`${key}:migration`,JSON.stringify({source,completedAt:this.now()})); } catch {}
    return true;
  }
  preference(name, value) {
    const key=`lilgotchi:preferences:${encodeURIComponent(this.instance)}:${name}`;
    if (value !== undefined) this.write(key,String(value));
    return this.read(key);
  }
  lease(family) {
    try { return JSON.parse(this.read(saveKey(this.instance,family)+':lease') || 'null'); } catch { return null; }
  }
  async acquire(family) {
    const key=saveKey(this.instance,family);
    if (localOwners.has(key) && localOwners.get(key)!==this.owner && (this.locks || this.lease(family)?.expires>this.now())) return false;
    if (this.releases.has(family)) return this.owns(family);
    if (this.locks) {
      let answer;
      const acquired=new Promise(resolve=>{answer=resolve;});
      this.locks.request(key,{ifAvailable:true},async lock=>{
        if (!lock) { answer(false); return; }
        localOwners.set(key,this.owner);
        await new Promise(resolve=>{this.releases.set(family,resolve); answer(true);});
      }).catch(()=>answer(false));
      return acquired;
    }
    const lease=this.lease(family);
    if (lease && lease.owner!==this.owner && lease.expires>this.now()) return false;
    localOwners.set(key,this.owner);
    this.write(key+':lease',JSON.stringify({owner:this.owner,expires:this.now()+LEASE_MS}));
    this.releases.set(family,()=>{});
    return this.owns(family);
  }
  owns(family) {
    const key=saveKey(this.instance,family);
    if (localOwners.get(key)!==this.owner || !this.releases.has(family)) return false;
    if (this.locks) return true;
    const lease=this.lease(family);
    return lease?.owner===this.owner && lease.expires>this.now();
  }
  renew(family) {
    if (!this.owns(family)) return false;
    if (!this.locks) this.write(saveKey(this.instance,family)+':lease',JSON.stringify({owner:this.owner,expires:this.now()+LEASE_MS}));
    return true;
  }
  save(family,state) {
    if (!families.includes(family) || !validState(state)) throw new Error('Invalid game state. Progress was not replaced.');
    if (!this.owns(family)) throw new Error('This pet is active in another window.');
    const key=saveKey(this.instance,family);
    const expected=this.revisions.get(family) || 0;
    const current=this.read(key);
    if (current!==null) {
      let data;
      try { data=JSON.parse(current); } catch { throw new Error('Saved progress needs recovery.'); }
      if (!validEnvelope(data,this.instance,family) || data.revision!==expected) throw new Error('Newer progress exists. Reopen this pet to continue.');
    } else if (expected!==0) throw new Error('Progress changed in another window.');
    const envelope={schema:1,instance:this.instance,family,revision:expected+1,savedAt:this.now(),state:clone(state)};
    if(!validEnvelope(envelope,this.instance,family))throw new Error('Invalid game state. Progress was not replaced.');
    this.write(key,JSON.stringify(envelope));
    this.revisions.set(family,envelope.revision);
    this.renew(family);
    return envelope;
  }
  replace(family,state) {
    if(!this.owns(family))throw new Error('This pet is active in another window.');
    const key=saveKey(this.instance,family);
    const raw=this.read(key);
    if(raw!==null)this.write(`${key}:recovery`,raw);
    const envelope={schema:1,instance:this.instance,family,revision:1,savedAt:this.now(),state:clone(state)};
    if(!validEnvelope(envelope,this.instance,family))throw new Error('Invalid imported state.');
    this.write(key,JSON.stringify(envelope));this.revisions.set(family,1);return envelope;
  }
  raw(family){return this.read(saveKey(this.instance,family));}
  release(family) {
    const key=saveKey(this.instance,family);
    if (!this.locks && this.lease(family)?.owner===this.owner) this.write(key+':lease',JSON.stringify({owner:this.owner,expires:0}));
    if(localOwners.get(key)===this.owner) localOwners.delete(key);
    this.releases.get(family)?.();
    this.releases.delete(family);
  }
  dispose() { for(const family of [...this.releases.keys()]) this.release(family); }
}
