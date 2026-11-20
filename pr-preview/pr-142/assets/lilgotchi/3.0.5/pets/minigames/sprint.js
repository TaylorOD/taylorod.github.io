// Both input modes advance at most once each half second.
export function createSprint({ hold = false, slow = false } = {}) {
  const finish = 30,
    tapInterval = 500,
    opponentDuration = slow ? 20000 : 18000;
  let phase = "countdown",
    result = null,
    paused = false,
    countdown = 3000;
  let elapsed = 0,
    progress = 0,
    lastTap = -tapInterval,
    holding = false,
    nextHold = 0,
    queuedTap = false;
  function settle() {
    if (progress >= finish) {
      progress = finish;
      phase = "done";
      result = "win";
    } else if (elapsed >= opponentDuration) {
      phase = "done";
      result = "loss";
    }
  }
  return {
    input(action) {
      if (paused || result || phase !== "race") return false;
      if (hold && ["hold", "start-hold", "stop-hold"].includes(action)) {
        holding = action === "hold" ? !holding : action === "start-hold";
        nextHold = Math.max(elapsed, lastTap + tapInterval);
        return true;
      }
      if (!hold && action === "run" && elapsed - lastTap >= tapInterval) {
        lastTap = elapsed;
        queuedTap = false;
        progress++;
        settle();
        return true;
      }
      // Keep one early tap for the next step, never a burst of queued steps.
      if (!hold && action === "run") queuedTap = true;
      return false;
    },
    advance(ms) {
      if (!Number.isFinite(ms) || ms <= 0 || result || paused) return;
      if (phase === "countdown") {
        const step = Math.min(countdown, ms);
        countdown -= step;
        ms -= step;
        if (countdown === 0) phase = "race";
      }
      if (phase !== "race") return;
      const end = Math.min(opponentDuration, elapsed + ms);
      if (!hold && queuedTap && lastTap + tapInterval <= end) {
        elapsed = lastTap + tapInterval;
        lastTap = elapsed;
        queuedTap = false;
        progress++;
        settle();
      }
      while (hold && holding && nextHold <= end && !result) {
        elapsed = nextHold;
        progress++;
        lastTap = elapsed;
        nextHold += tapInterval;
        settle();
      }
      if (!result) {
        elapsed = end;
        settle();
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
        id: "sprint",
        phase,
        result,
        paused,
        countdown,
        elapsed,
        progress,
        finish,
        opponent: Math.min(finish, (elapsed / opponentDuration) * finish),
        holding,
        hold,
        opponentDuration,
      };
    },
  };
}
