import { cyberpunkSprites as sprites, cyberpunkPalette as palette, cyberpunkNames as names } from '../../pets/cyberpunk-sprites.js';
const stages={egg:'egg',babytchi:'baby',marutchi:'child',tamatchi:'teen',kuchitamatchi:'teen'};
export const proposal={type:'Cypunk',palette,pets:Object.entries(sprites).map(([id,frames])=>({id,name:names[id],stage:stages[id]||'adult',frames}))};
