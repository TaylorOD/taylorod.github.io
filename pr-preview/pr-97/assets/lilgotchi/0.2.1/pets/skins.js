import { sliceSprites, slicePalette, sliceNames } from './slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette, cyberpunkNames } from './cyberpunk-sprites.js';
import { classicSprites } from './classic-sprites.js';
import { petType } from './storage.js';

export const SP = structuredClone(classicSprites);
export const palette = petType === 'pizza' ? slicePalette : petType === 'cyberpunk' ? cyberpunkPalette : [];
if (petType === 'pizza') Object.assign(SP, sliceSprites);
if (petType === 'cyberpunk') Object.assign(SP, cyberpunkSprites);
export const characterName = name => petType === 'pizza' ? sliceNames[name] : petType === 'cyberpunk' ? cyberpunkNames[name] : name.charAt(0).toUpperCase()+name.slice(1);
