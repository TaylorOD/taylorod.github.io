export const API = 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard';
export const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
export function dayInZone(date, zone) {
  const parts = new Intl.DateTimeFormat('en-US', {timeZone:zone, year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function addDays(day, n) {
  const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10);
}
export function rangeFor(period='schedule', {now=new Date(),zone=localZone(),days=180,from}={}) {
  let start = from || dayInZone(now, zone);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !Number.isFinite(Date.parse(start)) || new Date(start).toISOString().slice(0,10)!==start) throw new Error('Use a valid date: YYYY-MM-DD.');
  if (!Number.isInteger(days) || days<1 || days>366) throw new Error('--days must be between 1 and 366.');
  if (period === 'this weekend' || period === 'next weekend') {
    const weekday = new Date(`${start}T12:00:00Z`).getUTCDay();
    const mondayIndex = (weekday+6)%7;
    start = addDays(start,4-mondayIndex+(period==='next weekend'?7:0));
    return {start,end:addDays(start,3),zone};
  }
  return {start,end:addDays(start,days),zone};
}
export function normalize(e) {
  const bouts=e.competitions||[];
  const venue=bouts.find(b=>b.venue)?.venue||{};
  return {id:String(e.id),name:e.name||'UFC event',date:e.date,completed:!!e.status?.type?.completed,
    venue:venue.fullName||'Venue TBA',location:[venue.address?.city,venue.address?.state,venue.address?.country].filter(Boolean).join(', '),
    fights:bouts.map(b=>({fighters:(b.competitors||[]).map(c=>c.athlete?.displayName||'TBA'),division:b.type?.abbreviation||'TBA',status:b.status?.type?.description||'Scheduled'}))};
}
export function filterEvents(raw,range,search='') {
  return raw.map(normalize).filter(e=>{
    if(!e.date || !Number.isFinite(Date.parse(e.date)) || e.completed)return false;
    const day=dayInZone(new Date(e.date),range.zone);
    return day>=range.start && day<range.end && `${e.name} ${e.fights.flatMap(f=>f.fighters).join(' ')}`.toLowerCase().includes(search.toLowerCase());
  }).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
}
export async function getEvents(range,search='',fetcher=fetch) {
  // Expand the UTC request so events near midnight in any timezone are included.
  const dates=`${addDays(range.start,-1).replaceAll('-','')}-${range.end.replaceAll('-','')}`;
  const response=await fetcher(`${API}?${new URLSearchParams({dates,limit:'1000'})}`,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`Schedule provider returned HTTP ${response.status}. Try again shortly.`);
  const data=await response.json();
  if(!Array.isArray(data.events))throw new Error('Unexpected response from the schedule provider.');
  return filterEvents(data.events,range,search);
}
