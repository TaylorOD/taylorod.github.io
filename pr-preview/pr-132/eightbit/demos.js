// Small, self contained exhibits. These never change the real project or pet save.
export function createDemo(id) {
  return id === 'lilgotchi' ? { id, meals: 0 } : id === 'snowcrust' ? { id, stage: 0 } : { id, stage: 0 };
}

export function advanceDemo(state) {
  if (state.id === 'lilgotchi') return { ...state, meals: (state.meals + 1) % 4 };
  return { ...state, stage: (state.stage + 1) % (state.id === 'relay' ? 4 : 5) };
}

export function demoView(state) {
  if (state.id === 'lilgotchi') return {
    button: state.meals === 3 ? 'start again' : 'feed slice',
    title: ['a hungry little buddy', 'one snack closer', 'looking happier', 'full belly. happy slice.'][state.meals],
    detail: 'a tiny care demo. the full project adds growth, games and a save that stays with your pet.',
    value: state.meals / 3, meter: 'belly',
  };
  if (state.id === 'snowcrust') return {
    button: ['add toppings', 'slide into the oven', 'finish baking', 'send the kourier', 'make another'][state.stage],
    title: ['fresh dough', 'toppings ready', 'in the oven', 'golden crust. ready to go.', 'out for delivery'][state.stage],
    detail: ['start with a fresh base.', 'the crust stays pale until it goes into the oven.', 'heat turns dough into dinner.', 'the order is packed for a RadiKS kourier.', 'the full game has calls, orders and a kitchen you can move around.'][state.stage],
    value: state.stage / 4, meter: 'order',
  };
  return {
    button: ['take east offline', 'try a recovery probe', 'restore east', 'run it again'][state.stage],
    title: ['both regions healthy', 'east circuit open', 'one recovery probe', 'east is back online'][state.stage],
    detail: ['requests can reach either region.', 'new requests go west. the circuit stops repeated calls to east.', 'a single request checks whether east is ready. a failed probe keeps the circuit open.', 'the probe succeeds and traffic returns. try the full lab to compare latency and failures.'][state.stage],
    value: state.stage / 3, meter: 'experiment',
  };
}

export function renderDemo(element, state) {
  const view = demoView(state);
  const art = state.id === 'relay' ? `<div class="demo-network" aria-hidden="true"><span>requests</span><b>→</b><span class="${state.stage === 1 ? 'offline' : ''}">east ${state.stage === 1 ? '×' : state.stage === 2 ? '?' : '●'}</span><span>west ●</span></div>` : state.id === 'snowcrust' ? `<div class="demo-pizza stage-${state.stage}" aria-hidden="true"><span>${state.stage === 4 ? '↗' : state.stage > 0 ? '● · ●' : '·'}</span></div>` : '<canvas class="demo-pet" width="100" height="80" aria-label="Slice in the care demo"></canvas>';
  element.innerHTML = `${art}<div><small>PLAY A LITTLE DEMO</small><h3>${view.title}</h3><p>${view.detail}</p><meter min="0" max="1" value="${view.value}" aria-label="${view.meter}"></meter><button class="secondary" data-demo="${state.id}">${view.button}</button></div>`;
}
