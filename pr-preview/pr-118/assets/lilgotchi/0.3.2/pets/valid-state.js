const characters = ['egg','babytchi','marutchi','tamatchi','kuchitamatchi','mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi'];
const stages = ['egg','baby','child','teen','adult','dead'];

export function validState(data) {
  if (!data || !stages.includes(data.stage) || !characters.includes(data.character)) return false;
  for (const key of ['age','weight','hunger','happiness','discipline','careMistakes','poopCount','bornAt','stageStartTime','lastHungerDecay','lastHappyDecay','lastPoopTime','lastAgeInc','lastProcessed','snacksInWindow','snackWindowStart','medDoses','sickCount']) {
    if (!Number.isFinite(data[key]) || data[key] < 0) return false;
  }
  if (data.hunger > 4 || data.happiness > 4 || data.discipline > 100 || data.poopCount > 4) return false;
  if (![data.hunger,data.happiness,data.discipline,data.poopCount].every(Number.isInteger)) return false;
  // Older saves omit these fields. Present fields must still be safe to import.
  for (const key of ['energy','health']) if (key in data && (!Number.isFinite(data[key]) || data[key]<0 || data[key]>100)) return false;
  for (const key of ['wellbeingUpdatedAt','careTotal','careDuration','sleepOverrideUntil']) if (key in data && (!Number.isFinite(data[key]) || data[key]<0)) return false;
  if ('sleepOverride' in data && !['auto','sleep','wake'].includes(data.sleepOverride)) return false;
  if (data.careTotal > data.careDuration * 100 + 1) return false;
  if (('careTotal' in data) !== ('careDuration' in data)) return false;
  if (('sleepOverride' in data) !== ('sleepOverrideUntil' in data)) return false;
  if (data.wellbeingUpdatedAt > data.lastProcessed + 300000) return false;
  if ('vacationAt' in data && (!Number.isFinite(data.vacationAt) || data.vacationAt<0 || data.vacationAt>data.lastProcessed+300000)) return false;
  if (data.vacationAt>0 && data.vacationAt<data.lastProcessed) return false;
  if (data.sleepOverride !== undefined && data.sleepOverride !== 'auto' && (!Number.isFinite(data.wellbeingUpdatedAt) || data.sleepOverrideUntil > data.wellbeingUpdatedAt + 7500000)) return false;
  for (const key of ['isSick','isSleeping','lightOn','isDead','isMisbehaving']) if (typeof data[key] !== 'boolean') return false;
  return data.attentionCallTime === null || Number.isFinite(data.attentionCallTime);
}

