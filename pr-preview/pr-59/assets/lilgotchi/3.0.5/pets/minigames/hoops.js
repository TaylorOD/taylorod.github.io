export function createHoops({ slow = false, random = Math.random } = {}) {
  const period = slow ? 4000 : 2400;
  let phase = "ready",
    result = null,
    paused = false,
    shot = 1,
    score = 0;
  let elapsed = 0,
    arcElapsed = 0,
    made = null,
    marker = 0,
    targetCenter = 0.5,
    missedShort = false;
  const target = () => ({
    min: targetCenter - Math.max(0.08, 0.18 - score * 0.02),
    max: targetCenter + Math.max(0.08, 0.18 - score * 0.02),
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
      missedShort = marker < bounds.min;
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
            // Change sides between shots, then hold still while the player aims.
            targetCenter = (targetCenter >= 0.5 ? 0.24 : 0.64) + random() * 0.12;
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
      const t = ["arc", "done"].includes(phase) ? arcElapsed / 900 : 0;
      // A made shot reaches the rim on its way down, then drops through the net.
      const rimTime = 0.72;
      const flight = Math.min(1, t / rimTime);
      const endX = made ? 26 : missedShort ? 21 : 29;
      const ball = t <= rimTime
        ? {
            x: 10 + (endX - 10) * flight,
            y: 16 - 8 * flight - 9 * Math.sin(Math.PI * flight),
          }
        : { x: endX, y: 8 + 7 * ((t - rimTime) / (1 - rimTime)) };
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
        hoop: { centerX: 27, rimY: 9, left: 24, right: 30 },
        ball: { x: Math.round(ball.x), y: Math.round(ball.y) },
      };
    },
  };
}
