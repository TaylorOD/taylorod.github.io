export function createHoops({ slow = false } = {}) {
  const period = slow ? 4000 : 2400;
  let phase = "ready",
    result = null,
    paused = false,
    shot = 1,
    score = 0;
  let elapsed = 0,
    arcElapsed = 0,
    made = null,
    marker = 0;
  const target = () => ({
    min: 0.5 - Math.max(0.08, 0.18 - score * 0.02),
    max: 0.5 + Math.max(0.08, 0.18 - score * 0.02),
  });
  return {
    input(action) {
      if (paused || result) return false;
      if (phase === "ready" && ["ready", "shoot"].includes(action)) {
        phase = "aim";
        elapsed = 0;
        marker = 0;
        return true;
      }
      if (phase !== "aim" || action !== "shoot") return false;
      const bounds = target();
      made =
        marker + Number.EPSILON >= bounds.min &&
        marker - Number.EPSILON <= bounds.max;
      phase = "arc";
      arcElapsed = 0;
      return true;
    },
    advance(ms) {
      if (!Number.isFinite(ms) || ms <= 0 || result || paused) return;
      if (phase === "aim") {
        elapsed += ms;
        const cycle = (elapsed % period) / period;
        marker = cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2;
      } else if (phase === "arc") {
        arcElapsed = Math.min(900, arcElapsed + ms);
        if (arcElapsed === 900) {
          if (made) score++;
          if (shot === 5) {
            phase = "done";
            result = score >= 3 ? "win" : "loss";
          } else {
            shot++;
            phase = "ready";
          }
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
      const t = arcElapsed / 900;
      return {
        id: "hoops",
        phase,
        result,
        paused,
        shot,
        shots: 5,
        score,
        targetScore: 3,
        marker,
        target: target(),
        made,
        arcProgress: t,
        ball: {
          x: Math.round(8 + 18 * t),
          y: Math.round(11 - 8 * Math.sin(Math.PI * t) - (made ? 5 * t : 0)),
        },
      };
    },
  };
}
