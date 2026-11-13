export function model(state, step, input, onResume = () => {}) {
  let remainder = 0;
  const active = () => !state.result && !state.paused;
  return {
    input(action) {
      if (active()) input(action);
    },
    advance(ms) {
      if (!Number.isFinite(ms) || ms < 0)
        throw new RangeError("Elapsed time must be finite and positive");
      if (!active()) return;
      remainder += ms;
      while (remainder >= 10 && active()) {
        remainder -= 10;
        step(10);
      }
    },
    snapshot() {
      return structuredClone(state);
    },
    pause() {
      if (!state.result) state.paused = true;
    },
    resume() {
      if (state.paused && !state.result) {
        state.paused = false;
        onResume();
      }
    },
    quit() {
      if (!state.result) {
        state.result = "quit";
        state.phase = "done";
      }
    },
  };
}
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const randomIndex = (random, length) =>
  clamp(Math.floor(random() * length), 0, length - 1);
