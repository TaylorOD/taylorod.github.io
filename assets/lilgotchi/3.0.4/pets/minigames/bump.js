import { model } from "./model.js";
export function createBump({ slow = false } = {}) {
  const period = slow ? 3200 : 1600;
  const s = {
    id: "bump",
    phase: "countdown",
    result: null,
    paused: false,
    bout: 1,
    wins: 0,
    meter: 0,
    target: [60, 85],
    phaseTime: 0,
    boutWon: null,
  };
  const settle = (win) => {
    s.boutWon = win;
    if (win) s.wins++;
    s.phase = "reveal";
    s.phaseTime = 0;
  };
  return model(
    s,
    (dt) => {
      s.phaseTime += dt;
      if (s.phase === "countdown" && s.phaseTime >= 1500) {
        s.phase = "meter";
        s.phaseTime = 0;
      } else if (s.phase === "meter") {
        const t = s.phaseTime % period;
        s.meter = t <= period / 2 ? (t / period) * 200 : ((period - t) / period) * 200;
        if (s.phaseTime >= 6000) settle(false);
      } else if (s.phase === "reveal" && s.phaseTime >= 1200) {
        if (s.bout === 3) {
          s.result = s.wins >= 2 ? "win" : "loss";
          s.phase = "done";
        } else {
          s.bout++;
          s.target = [60 + (s.bout - 1) * 3, 85 - (s.bout - 1) * 3];
          s.phase = "countdown";
          s.phaseTime = 0;
          s.meter = 0;
          s.boutWon = null;
        }
      }
    },
    (action) => {
      if (action === "bump" && s.phase === "meter")
        settle(s.meter >= s.target[0] && s.meter <= s.target[1]);
    },
  );
}
