import { writeFile } from 'node:fs/promises';
import { scenes, findSmoothPath, isWalkable } from '../eightbit/scenes.js';
import { createResidents, arcadeRegulars } from '../eightbit/residents.js';
import { campusWalker } from '../eightbit/campus-life.js';
import { dogLooks } from '../eightbit/trail-visitors.js';

const directions = ['down', 'left', 'right', 'up'];
const models = [];
function model(id, family, appearances, actions, source, current, supportedDirections = directions) {
  models.push({ id, family, appearances, actions, directions: supportedDirections, source, current,
    frameSize: family === 'person' ? [32, 48] : family === 'pet' ? [32, 32] : [64, 48],
    anchor: 'bottom center at ground contact',
    proposedFrames: Object.fromEntries(actions.map(action => [action, /walk|run|pedal|paddle|chase|dance/.test(action) ? 4 : /idle|sleep|wait|watch|sit|view/.test(action) ? 2 : 3])),
    status: 'defined for review, final sprite frames not authored' });
}
model('taylor', 'person', { bald: true, beard: 'brown', hoodie: 'pale blue tie dye with white bison', shorts: 'black', shoes: 'red' },
  ['idle','walk','carry idle','carry walk','talk','receive pizza','give pizza','use cabinet','use pinball','sit','read','type','pet Scout','view','photo hello','photo pizza','photo view','enter door','use stairs'], 'art.js:person',
  'four facings, four walk phases, pizza overlay. Other actions open panels or reuse standing poses. Photo hello does not wave. No physical stairs animation.');
createResidents().slice(0,8).forEach((resident,index) => model(`resident ${index+1}`, 'person', resident.look,
  ['idle','walk','talk','sit','use cabinet','enter door'], 'residents.js:drawResident',
  'four head facings with mostly shared front torso and legs. Continuous stride. Sitting is a partial overlay. Cane and hat need direction specific placement.'));
model('bench neighbor','person',createResidents().at(-1).look,['sit','talk','receive pizza','eat pizza'],'residents.js:createResidents','same look as resident 2. Seated body uses standing legs plus lap overlay.');
arcadeRegulars.forEach((r,i) => model(`arcade regular ${i+1}`, 'person', r.look,
  ['idle', `use ${r.playing}`], 'residents.js:arcadeRegulars', `fixed ${r.direction} pose. Role ${r.playing}. Separate arm overlay, bar and poker use rectangular body clipping.`));
for(let i=0;i<3;i++) model(`campus student ${i+1}`,'person',campusWalker(0,i).look,['idle','walk'],'campus-life.js','up and down walking, continuous distance scale.');
for(let i=0;i<2;i++) {
  model(`cyclist ${i+1}`,'person',{variant:i},['idle','pedal'],'bikes.js','side profile and mirrored side, sinusoidal knee movement.');
  model(`jogger ${i+1}`,'person',{variant:i},['idle','run'],'trail-visitors.js','side profile only, sine based limb movement.');
  model(`dog walker ${i+1}`,'person',{variant:i},['idle','walk','wait','hold leash'],'trail-visitors.js','resident body, leash endpoint independent of animated hand.');
}
model('angler','person',{hat:true},['idle','cast back','cast forward','line drift'],'river-life.js','fixed right facing resident with rod and curved line overlay.');
model('surfer','person',{shirt:'rust'},['balance','surf'],'river-life.js','one procedural stance with oscillation.');
for(let i=0;i<2;i++) model(`rafter ${i+1}`,'person',{vest:'gold',seat:i},['sit','paddle'],'river-life.js','small bodies baked into raft drawing, no separate facing atlas.');
model('Scout','animal',{coat:'black and white',collar:'pink'},['idle','walk','run','chase','watch','jump','sleep','enter door','exit door'],'scout.js','side and vertical variants. Sleeping is a separate large silhouette.');
model('squirrel','animal',{coat:'brown'},['idle','run','climb'],'scout.js','side sprite rotated for climbing.');
dogLooks.forEach((look,i)=>model(`trail dog ${i+1}`,'animal',look,['idle','walk','sniff','wait'],'trail-visitors.js','six coat and body variants, side profiles, sniff lowers head.'));
model('elk','animal',{instances:2,antlers:true},['idle','graze','run','return'],'wildlife.js and town-view.js','two active elk. Running moves static legs and adds body bounce.');
model('deer','animal',{antlers:false},['idle','graze','walk','run'],'wildlife.js','deer renderer exists in legacy drawWildlife, not called by current town renderer. Include as dormant, not visible live.');
for(const id of ['original','slice','lilgotchi','cypunk']) model(id,'pet',{family:id},['idle','walk','look','happy','sleep','hidden','discovered'],'companions.js','real lilgotchi grids. Walking reuses look or idle frames. Sleep and happy ignore facing. Missing pose silently falls back to idle.');
model('carousel horse','prop',{variants:6},['turn','bob'],'carousel.js','six decorative horses. Mirrored side silhouettes with bob and depth sorting.',['left','right']);

const targets = Object.entries(scenes).flatMap(([sceneId,scene])=>scene.points.map(point=>{
  const path=findSmoothPath(scene,scene.spawn,point);
  return { scene:sceneId,...point,walkable:isWalkable(scene,point.x,point.y),reachable:path.length>0, path,
    requiredFacings:directions, carryVariants:[false,true],
    visualStatus:'requires pose and prop contact review',
    contactSpec: point.action.startsWith('project:') ? 'hands on controls or tabletop, feet grounded, body outside machine' : point.id==='bench' ? 'seat and lap anchors, pizza transfer between hands' : point.id==='pets' ? 'hand to dog shoulder, paws on floor or bed' : point.id==='books' ? 'hand to book spine, front shelf layer' : point.id==='about' ? 'hips on chair, hands on keyboard, knees behind desk' : point.id==='roof'||point.id==='exit' ? 'feet on landing, occlude behind door frame or stair rail' : point.id==='view' ? 'face skyline, stand inside parapet' : 'feet grounded, correct facing, nearby prop and foreground occlusion'
  };
}));
const manifest={baseline:'ac1533bc6feed76bf867e00f5a9016cb30d32825',date:'2026-11-21',
  intent:'review definitions and style drafts, no production replacement',
  style:{logicalScene:[384,256],paletteLimit:24,characterPaletteLimit:8,scaling:'integer nearest neighbor',transforms:'discrete frames, no rotating or stretching final sprites',layers:['background','prop back','actor','contact overlay','prop front','foreground'],
    anchors:['feet','left hand','right hand','seat','mouth','held item','leash collar'],
    directions, unsupported:'author every meaningful direction. Mark fixed prop poses as constrained instead of silently reusing a front frame.'},
  summary:{models:models.length,targets:targets.length,playerFacingCases:targets.length*4,playerFacingAndCarryCases:targets.length*8,unreachable:targets.filter(p=>!p.reachable).map(p=>`${p.scene}/${p.id}`)},models,targets};
await writeFile(new URL('./manifest.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
const csv=(value)=>'"'+String(value??'').replaceAll('"','""')+'"';
const rows=[['model','family','direction','action','frames','status']];
for(const m of models) for(const direction of m.directions) for(const action of m.actions) rows.push([m.id,m.family,direction,action,m.proposedFrames[action],m.status]);
await writeFile(new URL('./model-matrix.csv',import.meta.url),rows.map(row=>row.map(csv).join(',')).join('\n')+'\n');
console.log(JSON.stringify({...manifest.summary,modelDirectionActionRows:rows.length-1},null,2));
