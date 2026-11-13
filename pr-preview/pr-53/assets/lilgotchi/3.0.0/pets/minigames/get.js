import { model, randomIndex, clamp } from "./model.js";
export function createGet({ random = Math.random } = {}) {
  const s = {
    id: "get",
    phase: "playing",
    result: null,
    paused: false,
    elapsed: 0,
    remaining: 30000,
    score: 0,
    lives: 3,
    lane: 1,
    object: null,
    reaction: null,
  };
  let wait = 300,
    moveTime = -150;
  return model(
    s,
    (dt) => {
      s.elapsed += dt;
      s.remaining = Math.max(0, 30000 - s.elapsed);
      if (s.object) {
        s.object.y +=
          dt * (s.elapsed < 10000 ? 0.009 : s.elapsed < 20000 ? 0.011 : 0.013);
        if (s.object.y >= 10) {
          if (s.object.lane === s.lane) {
            if (s.object.kind === "note") {
              s.score++;
              s.reaction = "happy";
            } else {
              s.lives--;
              s.reaction = "startled";
            }
          }
          s.object = null;
          wait = 200;
        }
      } else if ((wait -= dt) <= 0) {
        s.object = {
          lane: randomIndex(random, 3),
          kind: random() < 0.8 ? "note" : "poop",
          y: 0,
        };
        s.reaction = null;
      }
      if (!s.lives || !s.remaining) {
        s.result = s.lives > 0 && s.score >= 12 ? "win" : "loss";
        s.phase = "done";
      }
    },
    (action) => {
      if (["left", "right"].includes(action) && s.elapsed - moveTime >= 150) {
        s.lane = clamp(s.lane + (action === "left" ? -1 : 1), 0, 2);
        moveTime = s.elapsed;
      }
    },
  );
}
