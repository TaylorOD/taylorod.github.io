import { model, randomIndex } from "./model.js";
export function createMemory({ random = Math.random, slow = false } = {}) {
  const sequence = Array.from(
    { length: 6 },
    () => ["left", "up", "right"][randomIndex(random, 3)],
  );
  const s = {
    id: "memory",
    phase: "watch",
    result: null,
    paused: false,
    round: 1,
    length: 2,
    cue: sequence[0],
    cueIndex: 0,
    entered: 0,
    lastInput: null,
    inputRemaining: 0,
    phaseTime: 0,
  };
  const duration = slow ? 1000 : 600,
    gap = slow ? 350 : 200;
  const restart = () => {
    s.phase = "watch";
    s.phaseTime = 0;
    s.cueIndex = 0;
    s.cue = sequence[0];
    s.entered = 0;
  };
  return model(
    s,
    (dt) => {
      s.inputRemaining = Math.max(0, s.inputRemaining - dt);
      if (!s.inputRemaining) s.lastInput = null;
      if (s.phase === "answer") return;
      s.phaseTime += dt;
      if (s.phase === "between" && s.phaseTime >= 450) {
        restart();
        return;
      }
      if (s.phase === "watch" && s.phaseTime >= duration) {
        s.cue = null;
        s.phase = "gap";
        s.phaseTime = 0;
      } else if (s.phase === "gap" && s.phaseTime >= gap) {
        s.phaseTime = 0;
        s.cueIndex++;
        if (s.cueIndex >= s.length) s.phase = "answer";
        else {
          s.phase = "watch";
          s.cue = sequence[s.cueIndex];
        }
      }
    },
    (action) => {
      if (s.phase !== "answer" || !["left", "up", "right"].includes(action))
        return;
      s.lastInput = action;
      s.inputRemaining = 450;
      if (action !== sequence[s.entered]) {
        s.result = "loss";
        s.phase = "done";
        return;
      }
      if (++s.entered === s.length) {
        if (s.round === 5) {
          s.result = "win";
          s.phase = "done";
        } else {
          s.round++;
          s.length++;
          s.phase = "between";
          s.phaseTime = 0;
        }
      }
    },
    () => {
      if (s.phase === "watch" || s.phase === "gap") restart();
    },
  );
}
