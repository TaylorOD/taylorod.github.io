const locks=new Set();
let originalOverflow;
export function lockPage(owner,root=document.documentElement) {
  if(locks.has(owner))return;
  if(!locks.size){originalOverflow=root.style.overflow;root.style.overflow='hidden';}
  locks.add(owner);
}
export function unlockPage(owner,root=document.documentElement) {
  if(!locks.delete(owner))return;
  if(!locks.size)root.style.overflow=originalOverflow;
}
