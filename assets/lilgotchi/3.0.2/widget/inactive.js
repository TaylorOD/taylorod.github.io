import { shiftClocks } from '../pets/away.js';

export function inactiveSince(store,family) {
  const value=Number(store.preference(`inactive-${family}`));
  return Number.isFinite(value)&&value>0?value:0;
}

export function hasActivePets(store,families,states=new Map()) {
  return families.some(family=>{
    if(inactiveSince(store,family))return false;
    if(states.get(family)?.state)return true;
    try{return !!store.load(family)?.state;}
    catch{return false;}
  });
}

export function resumeInactive(state,since,now=Date.now()) {
  const next=structuredClone(state);
  const elapsed=now-since;
  shiftClocks(next,elapsed);
  // A pet already on vacation stays on vacation, without counting this pause twice.
  if(next.vacationAt>0)next.vacationAt=Math.max(1,next.vacationAt+elapsed);
  return next;
}
