import { lilgotchiNames } from '../pets/lilgotchi-sprites.js';
import { getCharacter } from '../pets/catalog.js';
import { sliceNames } from '../pets/slice-sprites.js';
import { cyberpunkNames } from '../pets/cyberpunk-sprites.js';

export const stageLabel = stage => stage[0].toUpperCase()+stage.slice(1);
export function petLabel(family,state) {
  const choice=getCharacter(family);
  const character=state?.character||choice.character,stage=state?.stage||choice.stage;
  const name=family==='slice'?sliceNames[character]:family==='cyberpunk'?cyberpunkNames[character]:family==='lilgotchi'?lilgotchiNames[character]:character==='egg'?'Original':stageLabel(character);
  return `${name} · ${stageLabel(stage)}${state?.vacationAt?' · Paused':''}`;
}
