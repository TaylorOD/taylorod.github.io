import {getEvents,rangeFor,localZone,addDays} from './schedule.js';
let period='schedule',events=[],request=0;
const zone=localZone(),$=id=>document.getElementById(id);
$('timezone').textContent=`Times in ${zone.replaceAll('_',' ')}`;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
  const query=$('search').value.toLowerCase();
  const shown=events.filter(e=>`${e.name} ${e.fights.flatMap(f=>f.fighters).join(' ')}`.toLowerCase().includes(query));
  if(!shown.length){$('events').innerHTML='<p class="state">No matching upcoming events announced for this window.<br>Try Upcoming or a different search.</p>';return;}
  $('events').innerHTML=shown.map(e=>{
    const d=new Date(e.date), month=new Intl.DateTimeFormat('en',{timeZone:zone,month:'short'}).format(d),day=new Intl.DateTimeFormat('en',{timeZone:zone,day:'2-digit'}).format(d);
    const when=new Intl.DateTimeFormat('en',{timeZone:zone,weekday:'short',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d);
    return `<details class="event"><summary><div class="date-tile"><small>${escape(month.toUpperCase())}</small><b>${escape(day)}</b></div><div><h3>${escape(e.name)}</h3><div class="subtitle">${escape(when)} &nbsp;·&nbsp; ${escape(e.venue)}<br>${escape(e.location)}</div></div><span class="card-link">Fight card &nbsp; ↗</span></summary><ul class="fights">${e.fights.length?e.fights.map(f=>`<li><span>${escape(f.fighters.join(' vs. '))}</span><span>${escape(f.division)} · ${escape(f.status)}</span></li>`).join(''):'<li>Fight card not announced yet.</li>'}</ul></details>`;
  }).join('');
}
async function load(){
  const token=++request,range=rangeFor(period,{zone});
  $('range').textContent=`${range.start} → ${addDays(range.end,-1)}`;
  $('events').innerHTML='<p class="state">Loading the lineup…</p>';
  try{const result=await getEvents(range);if(token!==request)return;events=result;render();}
  catch(e){if(token!==request)return;events=[];$('events').innerHTML=`<p class="state">Couldn’t load the schedule. ${escape(e.message)}<br>Use Refresh to try again.</p>`;}
}
document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{period=b.dataset.period;document.querySelectorAll('[data-period]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});load();}));
$('search').addEventListener('input',render);$('refresh').addEventListener('click',load);
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('example').textContent=b.dataset.example;$('copy-command').dataset.copy=b.dataset.example;}));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copied!';}catch{b.textContent='Select to copy';}setTimeout(()=>b.textContent='Copy',1800);}));
load();
