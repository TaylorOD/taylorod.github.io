const steps=Object.freeze([
  {title:'Meet your pet', paragraphs:[
    'Feed offers meals for food and snacks for happiness. Too many snacks can make your pet sick. Play a guessing game to lift its mood.',
    'Care changes with the moment. Clean waste first, or use it to sleep and wake. More care keeps medicine, discipline and the other controls within reach.'
  ]},
  {title:'Read the little signals', paragraphs:[
    'Food and happiness show how satisfied your pet is. Energy drops while awake and recovers during sleep. Health is an advisory wellbeing meter. It does not replace the illness icon, medicine or the original care rules.',
    'A care grade appears after ten minutes of measured care. It averages food, happiness, energy and health over time: Perfect is at least 90, Good is at least 75, Normal is at least 50, and Bad is below 50. It describes that average, not your pet’s worth. The original evolution branches still use care mistakes and discipline.'
  ]},
  {title:'Rest and grow', paragraphs:[
    'Sleep and Wake control rest for a limited period before the normal schedule resumes. Lights only change the display and bedtime lighting. Turning a light off is not the same as asking an awake pet to sleep.',
    'Use medicine when your pet is sick. Use discipline when it is misbehaving, rather than whenever it refuses something. Eggs need time to hatch. Later stages grow through care. A named starting character begins a fresh life at the stage shown, so an adult can be zero days old.'
  ]},
  {title:'Come back when you can', paragraphs:[
    'While you are away, progress catches up for up to eight hours. Vacation pauses care and growth when you need a longer break. After you first open a pet, its launcher follows live care while this page remains active. Before that, it shows the last saved state. Closing the drawer keeps the pet active. Close the browser tab or page to release it for another window.',
    'Your pet saves in this browser on this website. Use Export save in Settings for a backup or to move it elsewhere. Import previews a replacement first. Clearing browser data can remove progress. If storage is unavailable, progress may last only for this visit.'
  ]}
]);

// All guide copy is rendered as text, never supplied as HTML.
export function mountCareGuide(container){
  const document=container.ownerDocument;
  const details=document.createElement('details');details.className='care-guide';
  const summary=document.createElement('summary');summary.textContent='How to care for your pet';
  const content=document.createElement('div');content.className='care-guide-content';
  const progress=document.createElement('p');progress.className='care-guide-progress';progress.setAttribute('aria-live','polite');
  const title=document.createElement('h3');title.tabIndex=-1;
  const paragraphs=document.createElement('div');
  const controls=document.createElement('div');controls.className='care-guide-controls';
  const back=document.createElement('button');back.type='button';back.textContent='Back';
  const next=document.createElement('button');next.type='button';
  const replay=document.createElement('button');replay.type='button';replay.textContent='Start again';
  let index=0;
  const render=(focus=false)=>{
    progress.textContent=`Step ${index+1} of ${steps.length}`;
    title.textContent=steps[index].title;
    paragraphs.replaceChildren(...steps[index].paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
    back.disabled=index===0;next.textContent=index===steps.length-1?'Done':'Next';replay.hidden=index!==steps.length-1;
    if(focus)title.focus();
  };
  back.addEventListener('click',()=>{if(index>0){index--;render(true);}});
  next.addEventListener('click',()=>{
    if(index===steps.length-1){details.open=false;summary.focus();}
    else{index++;render(true);}
  });
  replay.addEventListener('click',()=>{index=0;render(true);});
  controls.append(back,next,replay);content.append(progress,title,paragraphs,controls);details.append(summary,content);container.append(details);render();
  return {element:details,reset(){index=0;render();},destroy(){details.remove();}};
}

