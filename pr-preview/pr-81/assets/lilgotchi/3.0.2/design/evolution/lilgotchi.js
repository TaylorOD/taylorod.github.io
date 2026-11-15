import { lilgotchiSprites as sprites, lilgotchiPalette as palette, lilgotchiNames as names } from '../../pets/lilgotchi-sprites.js';
const stages={egg:'egg',babytchi:'baby',marutchi:'child',tamatchi:'teen',kuchitamatchi:'teen'};
export const proposal={type:'Lilgotchi',palette,pets:Object.entries(sprites).map(([id,frames])=>({id,name:names[id],stage:stages[id]||'adult',frames}))};
