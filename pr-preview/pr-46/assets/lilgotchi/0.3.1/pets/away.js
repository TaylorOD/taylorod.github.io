// Pause every relative game clock together so a holiday cannot age a pet.
const clocks=['stageStartTime','lastProcessed','lastHungerDecay','lastHappyDecay','lastPoopTime','lastAgeInc','snackWindowStart','attentionCallTime','wellbeingUpdatedAt'];
export const MAX_CATCHUP=8*60*60*1000;
export function shiftClocks(state,elapsed) {
  if(!Number.isFinite(elapsed)||elapsed===0)return;
  for(const key of clocks)if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+elapsed);
  if(state.sleepOverrideUntil>0)state.sleepOverrideUntil=Math.max(0,state.sleepOverrideUntil+elapsed);
}
export function resumeVacation(state,now) {
  if(!Number.isFinite(state.vacationAt)||state.vacationAt<=0||!Number.isFinite(now)||now<0)return false;
  // Rebase together even after a system clock correction, retaining elapsed phases.
  shiftClocks(state,now-state.vacationAt);
  state.vacationAt=0;
  return true;
}
export function limitAbsence(state,now) {
  const skipped=Math.max(0,now-state.lastProcessed-MAX_CATCHUP);
  shiftClocks(state,skipped);
  return skipped;
}
