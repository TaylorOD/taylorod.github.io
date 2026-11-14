let simulationTime = null;
export const now = () => simulationTime ?? Date.now();
export const setSimulationTime = value => { simulationTime = value; };
