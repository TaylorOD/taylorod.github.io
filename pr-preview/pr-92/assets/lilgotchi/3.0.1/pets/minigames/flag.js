// Flag cues are settled once, including fake cues where waiting is the answer.
export function createFlag({ random = Math.random, slow = false } = {}) {
  const types = ["left", "right", "both", "fake"];
  const duration = slow ? 4000 : 2400;
  let phase = "prepare",
    result = null,
    paused = false,
    remaining = 900;
  let round = 1,
    score = 0,
    response = null,
    correct = null;
  let cue = types[Math.min(3, Math.max(0, Math.floor(random() * 4)))];
  function settle() {
    correct = cue === "fake" ? response === null : response === cue;
    if (correct) score++;
    phase = "rest";
    remaining = 900;
  }
  return {
    input(action) {
      if (
        result ||
        paused ||
        phase !== "cue" ||
        response !== null ||
        !["left", "right", "both"].includes(action)
      )
        return false;
      response = action;
      return true;
    },
    advance(ms) {
      if (!Number.isFinite(ms) || ms <= 0 || result || paused) return;
      while (ms > 0 && !result) {
        const step = Math.min(ms, remaining);
        ms -= step;
        remaining -= step;
        if (remaining > 0) break;
        if (phase === "prepare") {
          phase = "cue";
          remaining = duration;
        } else if (phase === "cue") settle();
        else if (round === 15) {
          phase = "done";
          result = score >= 12 ? "win" : "loss";
        } else {
          round++;
          phase = "cue";
          remaining = duration;
          response = null;
          correct = null;
          cue = types[Math.min(3, Math.max(0, Math.floor(random() * 4)))];
        }
      }
    },
    pause() {
      if (!result) paused = true;
    },
    resume() {
      paused = false;
    },
    quit() {
      if (!result) {
        result = "quit";
        phase = "done";
      }
    },
    snapshot() {
      return {
        id: "flag",
        phase,
        result,
        paused,
        cue,
        response,
        correct,
        round,
        rounds: 15,
        score,
        target: 12,
        remaining,
        duration,
      };
    },
  };
}
