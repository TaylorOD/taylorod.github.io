import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { C } from './constants.js';
import { GameState, Evo } from './engine.js';
import { TamagotchiApp } from './game.js';
import { setSimulationTime } from './clock.js';
import { validState, saveKey } from './storage.js';

const noon = new Date(2026, 0, 5, 12).getTime();
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, { textContent:'', innerHTML:'', classList:{add(){},remove(){},toggle(){}}, focus(){}, querySelector(){return this;} });
  return elements.get(id);
};
globalThis.document = { getElementById:element, querySelectorAll:()=>[], activeElement:element('focus') };
let saves = new Map();
globalThis.localStorage = {setItem:(key,value)=>saves.set(key,value), getItem:key=>saves.get(key)??null,removeItem:key=>saves.delete(key)};
function appAt(time = noon) {
  setSimulationTime(time);
  const app = Object.create(TamagotchiApp.prototype);
  app.state = new GameState();
  app.sound = new Proxy({}, { get:()=>()=>{} });
  app.renderer = { renderToCanvas(){} };
  app.toast = ()=>{};
  app.updateButtons = ()=>{};
  app.showDeath = ()=>{};
  app.openOverlay = ()=>{};
  app.closeOverlay = ()=>{};
  return app;
}
function baby(app) {
  Object.assign(app.state, {stage:'baby',character:'babytchi',hunger:3,happiness:2});
  return app;
}
afterEach(() => { setSimulationTime(null); mock.restoreAll(); saves = new Map(); });

test('egg hatches after five minutes, then becomes a child after an hour', () => {
  const app = appAt();
  setSimulationTime(noon+C.EGG_MS-1); app.tick();
  assert.equal(app.state.stage,'egg');
  setSimulationTime(noon+C.EGG_MS); app.tick();
  assert.equal(app.state.character,'babytchi');
  assert.equal(app.state.hunger,4);
  setSimulationTime(noon+C.EGG_MS+C.BABY_MS); app.tick();
  assert.equal(app.state.character,'marutchi');
});

test('care mistakes choose the teen branch and discipline selects all adult forms', () => {
  assert.equal(Evo.evolve({stage:'child',careMistakes:0}).character,'tamatchi');
  assert.equal(Evo.evolve({stage:'child',careMistakes:2}).character,'kuchitamatchi');
  for(const [discipline,careMistakes,expected] of [[100,0,'mametchi'],[75,0,'ginjirotchi'],[50,3,'maskutchi'],[50,5,'kuchipatchi'],[25,5,'nyorotchi'],[0,5,'tarakotchi']]) {
    assert.equal(Evo.toAdult({character:'tamatchi',discipline,careMistakes}).character,expected);
  }
  assert.equal(Evo.checkOyajitchi({character:'maskutchi',discipline:100,age:10}),true);
});

test('meals and snacks affect different needs and excessive snacks cause sickness', () => {
  const app = baby(appAt());
  app.doFeed('meal');
  assert.equal(app.state.hunger,4);
  assert.equal(app.state.happiness,2);
  assert.equal(app.state.weight,6);
  for(let i=0;i<C.SNACK_SICK;i++) { app.state.happiness=0; app.doFeed('snack'); }
  assert.equal(app.state.isSick,true);
  assert.equal(app.state.happiness,1);
  assert.equal(app.state.weight,26);
});

test('medicine needs the prescribed doses, cleaning removes waste, scolding adds discipline', () => {
  const app = baby(appAt());
  Object.assign(app.state,{isSick:true,medDoses:2,poopCount:3,isMisbehaving:true});
  app.handleAction('medicine'); assert.equal(app.state.isSick,true);
  app.handleAction('medicine'); assert.equal(app.state.isSick,false);
  app.handleAction('clean'); assert.equal(app.state.poopCount,0);
  app.handleAction('discipline'); assert.equal(app.state.discipline,25);
  assert.equal(app.state.isMisbehaving,false);
});

test('sleep follows the local clock and feeding is blocked while asleep', () => {
  const app = baby(appAt());
  setSimulationTime(new Date(2026,0,5,21).getTime()); app.checkSleep();
  assert.equal(app.state.isSleeping,true);
  app.doFeed('meal'); assert.equal(app.state.hunger,3);
  app.handleAction('light'); assert.equal(app.state.lightOn,false);
  setSimulationTime(new Date(2026,0,6,9).getTime()); app.checkSleep();
  assert.equal(app.state.isSleeping,false);
  assert.equal(app.state.lightOn,true);
});

test('unanswered care calls count as mistakes and adults die at the limit', () => {
  const app = baby(appAt());
  app.state.hunger=0;
  app.checkAttention();
  setSimulationTime(noon+C.CARE_WINDOW); app.tick();
  assert.equal(app.state.careMistakes,1);
  Object.assign(app.state,{stage:'adult',character:'mametchi',careMistakes:C.ADULT_MAX_MISTAKES});
  app.tick(); assert.equal(app.state.isDead,true);
  assert.equal(app.state.stage,'dead');
});

test('adults also die of age', () => {
  const app = baby(appAt());
  Object.assign(app.state,{stage:'adult',character:'mametchi',age:C.MAX_AGE});
  app.tick(); assert.equal(app.state.isDead,true);
});

test('offline catch up hatches eggs and preserves elapsed fractions across repeated opens', () => {
  const app = appAt();
  mock.method(Date,'now',()=>noon+C.EGG_MS+10000);
  setSimulationTime(null); app.processMissedTime();
  assert.equal(app.state.stage,'baby');
  const hungerClock = app.state.lastHungerDecay;
  app.processMissedTime();
  assert.equal(app.state.lastHungerDecay,hungerClock);
  assert.equal(app.state.hunger,4);
});

test('offline sleep does not drain food and advances age', () => {
  const start=new Date(2026,0,5,20).getTime();
  const app=baby(appAt(start));
  app.state.isSleeping=true;
  app.state.lastAgeInc=start-23*3600000;
  mock.method(Date,'now',()=>start+2*3600000);
  setSimulationTime(null); app.processMissedTime();
  assert.equal(app.state.hunger,3);
  assert.equal(app.state.age,1);
});

test('five round game awards happiness for at least three wins', context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const app=baby(appAt());
  app.startGame();
  for(let round=0;round<5;round++) {
    app.gameGuess(round<3 ? app.gameDir : 1-app.gameDir);
    context.mock.timers.tick(1200);
  }
  assert.equal(app.gameWins,3);
  assert.equal(app.state.happiness,3);
  assert.equal(app.gameActive,false);
  context.mock.timers.reset();
});

test('save reload preserves the full state and rejects malformed saves', () => {
  const app=baby(appAt());
  app.state.discipline=75;
  assert.equal(app.state.save(),true);
  const loaded=new GameState();
  assert.equal(loaded.load(),true);
  assert.deepEqual(loaded,app.state);
  assert.equal(validState({...loaded,hunger:99}),false);
  localStorage.setItem(saveKey,'{"stage":"adult"}');
  assert.equal(new GameState().load(),false);
});

test('storage failure does not stop care or reset', () => {
  const app=baby(appAt());
  mock.method(localStorage,'setItem',()=>{throw Error('blocked');});
  assert.equal(app.state.save(),false);
  app.doFeed('meal');
  assert.equal(app.state.hunger,4);
  app.state.reset();
  assert.equal(app.state.stage,'egg');
});

test('a previous game callback cannot advance a newly started game', context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const app=baby(appAt());
  app.startGame();
  app.gameGuess(app.gameDir);
  app.gameActive=false;
  app.startGame();
  context.mock.timers.tick(1200);
  assert.equal(app.gameRound,0);
  assert.equal(app.gameWins,0);
  assert.equal(app.gamePhase,'waiting');
  context.mock.timers.reset();
});

test('losing the guessing game does not award happiness', context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const app=baby(appAt());
  app.startGame();
  for(let round=0;round<5;round++) {
    app.gameGuess(1-app.gameDir);
    context.mock.timers.tick(1200);
  }
  assert.equal(app.state.happiness,2);
  assert.equal(app.gameActive,false);
  context.mock.timers.reset();
});

test('all character skins supply a renderable idle frame at each evolution', async () => {
  const { SP } = await import('./skins.js');
  for(const character of ['egg','babytchi','marutchi','tamatchi','kuchitamatchi','mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi']) {
    assert.ok(SP[character].idle1.length > 0,character);
    assert.ok(SP[character].idle1.every(row=>row.length===SP[character].idle1[0].length),character);
  }
});
