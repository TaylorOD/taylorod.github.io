import { allowedCharacters } from '../pets/catalog.js';
export function installSnippet({characters='all',character='slice',placement='bottom-right',appearance='dark',launcher='shell',notifications='on'}={}){
  const allowed=allowedCharacters(characters);
  if(!allowed.includes(character))character=allowed[0];
  if(!['bottom-right','bottom-left','top-right','top-left'].includes(placement))throw new Error('Choose a supported placement.');
  if(!['dark','light'].includes(appearance))throw new Error('Choose a supported appearance.');
  if(!['shell','pet','brand'].includes(launcher))throw new Error('Choose a supported launcher.');
  if(!['on','off'].includes(notifications))throw new Error('Choose notifications on or off.');
  const setting=` data-placement="${placement}"`;
  return `<script defer src="https://www.taylordorsett.com/lilgotchi/releases/2.0.1/embed.js" data-characters="${characters==='all'?'all':allowed.join(',')}" data-character="${character}"${setting} data-appearance="${appearance}" data-launcher="${launcher}" data-notifications="${notifications}" data-storage-key="my-pets"></script>`;
}
