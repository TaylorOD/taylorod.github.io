import { allowedCharacters } from '../pets/catalog.js';
export function installSnippet({characters='all',character='slice',placement='bottom-right',appearance='dark'}={}){
  const allowed=allowedCharacters(characters);
  if(!allowed.includes(character))character=allowed[0];
  if(!['bottom-right','bottom-left','inline'].includes(placement))throw new Error('Choose a supported placement.');
  if(!['dark','light'].includes(appearance))throw new Error('Choose a supported appearance.');
  const setting=placement==='inline'?' data-mode="inline"':` data-placement="${placement}"`;
  return `<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.3.0/embed.js" data-characters="${characters==='all'?'all':allowed.join(',')}" data-character="${character}"${setting} data-appearance="${appearance}" data-storage-key="my-pets"></script>`;
}
