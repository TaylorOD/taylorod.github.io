import { allowedCharacters } from '../pets/catalog.js';
export function installSnippet({characters='all',character='slice',placement='bottom-right',appearance='dark'}={}){
  const allowed=allowedCharacters(characters);
  if(!allowed.includes(character))character=allowed[0];
  if(!['bottom-right','bottom-left','inline'].includes(placement))throw new Error('Choose a supported placement.');
  if(!['dark','light'].includes(appearance))throw new Error('Choose a supported appearance.');
  const setting=placement==='inline'?' mode="inline"':` placement="${placement}"`;
  return `<script type="module" src="/assets/lilgotchi/0.1.0/lilgotchi.js"></script>\n<lil-gotchi characters="${characters==='all'?'all':allowed.join(',')}" character="${character}"${setting} appearance="${appearance}" storage-key="my-pets"></lil-gotchi>`;
}
