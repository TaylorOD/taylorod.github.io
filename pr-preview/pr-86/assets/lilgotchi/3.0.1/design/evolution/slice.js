import { sliceSprites as sprites, slicePalette as palette, sliceNames as names } from '../../pets/slice-sprites.js';
const stages={egg:'egg',babytchi:'baby',marutchi:'child',tamatchi:'teen',kuchitamatchi:'teen'};
export const proposal={type:'Slice',palette,pets:Object.entries(sprites).map(([id,frames])=>({id,name:names[id],stage:stages[id]||'adult',frames}))};
