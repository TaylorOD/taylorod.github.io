// P1 and P2 share care timing. Their identities and growth paths stay separate.
export const p1Stages = Object.freeze({
  egg:['egg'], baby:['babytchi'], child:['marutchi'],
  teen:['tamatchi','kuchitamatchi'],
  adult:['mametchi','ginjirotchi','maskutchi','kuchipatchi','nyorotchi','tarakotchi','oyajitchi','bill'],
});
export const p2Stages = Object.freeze({
  egg:['egg'], baby:['shirobabytchi'], child:['tonmarutchi'],
  teen:['tongaritchi','hashitamatchi'],
  adult:['mimitchi','pochitchi','nyatchi','zuccitchi','hashizoutchi','kusatchi','takotchi','sekitoritchi','charitchi','zatchi'],
});
export const p2Characters = Object.freeze(Object.values(p2Stages).flat().filter(id=>id!=='egg'));
export const isP2 = state => state.preset?.id==='original2' || p2Characters.includes(state.character);

export function stagesForFamily(family) {
  if(family==='original2')return p2Stages;
  if(family==='default')return p1Stages;
  return {...p1Stages,adult:p1Stages.adult.filter(id=>id!=='bill')};
}

export function evolveP2(state,random=Math.random) {
  const result=(stage,character,weight)=>({stage,character,weight});
  if(state.stage==='egg')return result('baby','shirobabytchi',5);
  if(state.stage==='baby')return result('child','tonmarutchi',10);
  if(state.stage==='child')return result('teen',state.careMistakes<=1?'tongaritchi':'hashitamatchi',20);
  if(state.stage!=='teen')return null;
  const d=state.discipline,cm=state.careMistakes;
  if(state.character==='tongaritchi') {
    if(cm<=2&&d>=100)return result('adult','mimitchi',25);
    if(cm<=2&&d>=75)return result('adult',random()<.5?'pochitchi':'nyatchi',30);
    if(cm<=4&&d>=50)return result('adult','zuccitchi',30);
  }
  if(d>=75 || (state.character==='tongaritchi'&&d>=50))return result('adult','hashizoutchi',35);
  if(d>=50 || (state.character==='tongaritchi'&&d>=25))return result('adult','kusatchi',30);
  return result('adult','takotchi',35);
}

export function elderFor(state,random=Math.random) {
  if(state.discipline<100 || state.age<10)return null;
  if(isP2(state)) {
    if(state.character!=='zuccitchi')return null;
    return ['sekitoritchi','charitchi','zatchi'][Math.min(2,Math.floor(random()*3))];
  }
  if(state.character!=='maskutchi')return null;
  return state.preset?.id==='default' && random()<.5?'bill':'oyajitchi';
}
