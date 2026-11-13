import { model, clamp } from "./model.js";
import { headingPose, FIELD_HEIGHT, FIELD_WIDTH } from "../arcade-geometry.js";

const defaultSprite = Array.from({ length: 12 }, () => Array(12).fill(1));

// Compare ball and head movement together so a rising jump cannot skip contact.
export function touchesHead(beforeBall, ball, beforeHead, head) {
  return head.some((pixel, index) => {
    const previous = beforeHead[index];
    return (
      ball.x + 2 > pixel.x && ball.x < pixel.x + 1 &&
      beforeBall.y + 2 <= previous.y && ball.y + 2 >= pixel.y
    );
  });
}
export function createHeading({
  random = Math.random,
  slow = false,
  sprite = defaultSprite,
} = {}) {
  const halfWidth = Math.max(...sprite.map(row => row.length)) / 2;
  const duration = slow ? 75000 : 45000;
  const speed = slow ? 0.6 : 1;
  const s = {
    id: "heading",
    phase: "countdown",
    result: null,
    paused: false,
    elapsed: 0,
    remaining: duration,
    score: 0,
    misses: 0,
    x: 16,
    jump: 0,
    ball: { x: 16, y: 1 },
    phaseTime: 0,
  };
  let jumpTime = -1,
    velocity = 0,
    moveTime = -100,
    vx = 0.003;
  const serve = () => {
    s.ball = { x: clamp(s.x + (random() < 0.5 ? -3 : 3), 2, 29), y: 1 };
    vx = random() < 0.5 ? -0.003 : 0.003;
    velocity = 0.006 + Math.floor(s.score / 3) * 0.001;
    s.phase = "playing";
  };
  return model(
    s,
    (dt) => {
      const previousHead = headingPose(sprite, s.x, s.jump).head;
      s.elapsed += dt;
      s.remaining = Math.max(0, duration - s.elapsed);
      dt *= speed;
      s.phaseTime += dt;
      if (jumpTime >= 0) {
        jumpTime += dt;
        s.jump = 3 * Math.sin(Math.PI * Math.min(1, jumpTime / 700));
        if (jumpTime >= 700) {
          jumpTime = -1;
          s.jump = 0;
        }
      }
      if (s.phase === "countdown" && s.phaseTime >= 1000) serve();
      if (s.phase === "playing") {
        const previous = { ...s.ball };
        s.ball.y += velocity * dt;
        s.ball.x += vx * dt;
        if (s.ball.x < 1 || s.ball.x > 29) {
          s.ball.x = clamp(s.ball.x, 1, 29);
          vx = -vx;
        }
        velocity += dt * 0.000012;
        if (s.ball.y < 1) {
          s.ball.y = 1;
          velocity = Math.abs(velocity);
        }
        const head = headingPose(sprite, s.x, s.jump).head;
        if (
          velocity > 0 && jumpTime >= 0 &&
          touchesHead(previous, s.ball, previousHead, head)
        ) {
          s.score++;
          const contact = head.filter(pixel =>
            s.ball.x + 2 > pixel.x && s.ball.x < pixel.x + 1);
          s.ball.y = Math.min(...contact.map(pixel => pixel.y)) - 2;
          velocity = -0.016 - Math.floor(s.score / 3) * 0.001;
          if (s.score >= 10) {
            s.result = "win";
            s.phase = "done";
          }
        } else if (s.ball.y >= FIELD_HEIGHT - 2) {
          s.misses++;
          s.phase = "countdown";
          s.phaseTime = 0;
          s.ball.y = FIELD_HEIGHT - 2;
        }
      }
      if (!s.result && (s.misses >= 3 || !s.remaining)) {
        s.result = "loss";
        s.phase = "done";
      }
    },
    (action) => {
      if (["left", "right"].includes(action) && s.elapsed - moveTime >= 100) {
        s.x = clamp(
          s.x + (action === "left" ? -2 : 2),
          halfWidth,
          FIELD_WIDTH - halfWidth,
        );
        moveTime = s.elapsed;
      }
      if (action === "jump" && s.phase === "playing" && jumpTime < 0)
        jumpTime = 0;
    },
  );
}
