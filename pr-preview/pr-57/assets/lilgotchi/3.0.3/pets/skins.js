import { lilgotchiSprites, lilgotchiPalette, lilgotchiNames } from './lilgotchi-sprites.js';
import { sliceSprites, slicePalette, sliceNames } from './slice-sprites.js';
import { cyberpunkSprites, cyberpunkPalette, cyberpunkNames } from './cyberpunk-sprites.js';
import { classicSprites } from './classic-sprites.js';
import { originalSprites } from './original-sprites.js';
import { petType } from './storage.js';

export const SP = structuredClone(classicSprites);
if (petType === 'classic') Object.assign(SP, originalSprites);
export const palette = petType === 'pizza' ? slicePalette : petType === 'cyberpunk' ? cyberpunkPalette : petType === 'lilgotchi' ? lilgotchiPalette : [];
if (petType === 'pizza') Object.assign(SP, sliceSprites);
if (petType === 'cyberpunk') Object.assign(SP, cyberpunkSprites);
if (petType === 'lilgotchi') Object.assign(SP, lilgotchiSprites);
export const characterName = name => petType === 'pizza' ? sliceNames[name] : petType === 'cyberpunk' ? cyberpunkNames[name] : petType === 'lilgotchi' ? lilgotchiNames[name] : name.charAt(0).toUpperCase()+name.slice(1);
