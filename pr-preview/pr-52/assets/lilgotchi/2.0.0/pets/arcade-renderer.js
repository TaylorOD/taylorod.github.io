export function drawArcade(q, s, sprite, palette = [], options = {}) {
  const reducedMotion =
    options.reducedMotion ??
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
    false;
  const ctx = q(".arcade-field").getContext("2d");
  ctx.fillStyle = "#263d45";
  ctx.fillRect(0, 0, 32, 16);
  ctx.fillStyle = "#f4d991";
  const rect = (x, y, w, h) => ctx.fillRect(Math.round(x), Math.round(y), w, h);
  // Quarter turns preserve the authored pixels and their spacing.
  const opponent = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 2, 2, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
  ];
  const pet = (x, y, { rival = false, fallen = false, facing = 0 } = {}) => {
    const drawing = rival ? opponent : sprite;
    for (let row = 0; row < drawing.length; row++)
      for (let col = 0; col < drawing[row].length; col++) {
        const pixel = drawing[row][col];
        if (!pixel) continue;
        ctx.fillStyle = rival
          ? pixel === 2
            ? "#263d45"
            : "#a8c8f3"
          : palette[pixel] || "#f4d991";
        rect(
          x + (fallen ? drawing.length - 1 - row : col),
          y + (fallen ? col : row),
          1,
          1,
        );
      }
    if (facing && !fallen) {
      ctx.fillStyle = rival ? "#a8c8f3" : "#f4d991";
      rect(x + (facing > 0 ? 8 : -1), y + 3, 1, 1);
    }
  };
  const reaction = (x, y, good) => {
    ctx.fillStyle = good ? "#a1f1dc" : "#ed997d";
    if (good) {
      rect(x + 1, y, 1, 1);
      rect(x, y + 1, 3, 1);
      rect(x + 1, y + 2, 1, 1);
    } else {
      rect(x + 1, y, 1, 2);
      rect(x + 1, y + 3, 1, 1);
    }
  };
  if (s.id === "get") {
    pet(s.lane * 10 + 1, 10);
    if (s.reaction) reaction(s.lane * 10 + 4, 5, s.reaction === "happy");
    if (s.object) {
      ctx.fillStyle = s.object.kind === "note" ? "#a1f1dc" : "#ed997d";
      const x = s.object.lane * 10 + 4,
        y = Math.round(s.object.y);
      if (s.object.kind === "note") {
        rect(x + 2, y, 1, 3);
        rect(x, y + 2, 3, 1);
      } else {
        rect(x + 1, y, 1, 1);
        rect(x, y + 1, 3, 2);
      }
    }
  }
  if (s.id === "heading") {
    pet(s.x - 4, 10 - s.jump);
    ctx.fillStyle = "#f4d991";
    rect(s.ball.x, s.ball.y, 2, 2);
  }
  if (s.id === "bump") {
    const reveal = s.phase === "reveal",
      time = s.phaseTime || 0;
    const bump = reveal && time >= 250 && time < 1000;
    const fallen = bump && !reducedMotion && time >= 400;
    const playerLoses = s.boutWon === false;
    pet(bump && !playerLoses ? 6 : 3, fallen && playerLoses ? 8 : 9, {
      fallen: fallen && playerLoses,
      facing: 1,
    });
    pet(bump && playerLoses ? 19 : 23, fallen && !playerLoses ? 8 : 9, {
      rival: true,
      fallen: fallen && !playerLoses,
      facing: -1,
    });
    if (reveal) reaction(playerLoses ? 5 : 25, 3, false);
  }
  if (["memory", "flag"].includes(s.id)) {
    pet(12, 9);
    if (s.result) reaction(14, 4, s.result === "win");
  }
  if (s.id === "flag") {
    const flag = (left, raised) => {
      const x = left ? 7 : 23,
        y = raised ? 5 : 11;
      ctx.fillStyle = "#e5e9df";
      rect(x, y, 1, 5);
      ctx.fillStyle = left ? "#a1f1dc" : "#ed997d";
      rect(left ? x - 3 : x + 1, y, 3, 2);
    };
    flag(true, s.response === "left" || s.response === "both");
    flag(false, s.response === "right" || s.response === "both");
    if (s.cue === "fake" && s.phase === "cue") {
      ctx.fillStyle = "#ed997d";
      rect(14, 2, 1, 1);
      rect(15, 3, 1, 1);
      rect(16, 2, 1, 1);
      rect(14, 4, 1, 1);
      rect(16, 4, 1, 1);
    }
    if (s.phase === "rest") reaction(14, 4, s.correct);
  }
  q(".arcade-meter").hidden = !["bump", "hoops"].includes(s.id);
  if (s.id === "bump" || s.id === "hoops") {
    const target =
      s.id === "bump" ? s.target : [s.target.min * 100, s.target.max * 100];
    q(".arcade-meter span").style.cssText =
      `left:${target[0]}%;width:${target[1] - target[0]}%`;
    q(".arcade-meter i").style.left =
      `${s.id === "bump" ? s.meter : s.marker * 100}%`;
  }
  if (s.id === "sprint") {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = y % 2 ? "#263d45" : "#e5e9df";
      rect(30, y, 2, 1);
    }
    pet(Math.min(22, (s.progress / s.finish) * 22), 1);
    ctx.fillStyle = "#a8c8f3";
    pet(Math.min(22, (s.opponent / s.finish) * 22), 9, { rival: true });
  }
  if (s.id === "hoops") {
    pet(1, 10);
    ctx.fillStyle = "#f4d991";
    rect(27, 5, 5, 1);
    rect(31, 6, 1, 10);
    if (s.ball) rect(s.ball.x, s.ball.y, 2, 2);
  }
}
