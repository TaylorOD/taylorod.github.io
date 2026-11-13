import { drawArcade } from "./arcade-renderer.js";
import { games } from "./arcade-catalog.js";
import { arcadeSprite } from "./arcade-sprites.js";
import { petType } from "./storage.js";
import { SP, palette } from "./skins.js";
import { applyWellbeingAction } from "./wellbeing.js";
import { now } from "./clock.js";
export class Arcade {
  constructor(app) {
    this.app = app;
    this.model = null;
    this.selection = null;
    this.settled = false;
    this.last = 0;
    this.held = null;
    this.repeatAt = 0;
    this.root = document.createElement("div");
    this.root.className = "overlay";
    this.root.id = "arcade-overlay";
    this.root.tabIndex = -1;
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-modal", "true");
    this.root.setAttribute("aria-labelledby", "arcade-title");
    this.root.innerHTML =
      '<h2 class="overlay-title" id="arcade-title">Play</h2><div class="arcade-picker"></div><p class="arcade-instruction"></p><label class="arcade-options"><input type="checkbox"><span> Slower cues</span></label><button class="overlay-btn arcade-start">Start</button><canvas class="arcade-pet" aria-label="Your pet"></canvas><div class="arcade-cue" aria-live="polite"></div><canvas class="arcade-field" width="32" height="16" aria-label="Game field"></canvas><div class="arcade-meter"><span></span><i></i></div><p class="arcade-score" aria-live="off"></p><span class="arcade-announcement" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)" role="status" aria-atomic="true"></span><div class="arcade-actions"></div><button class="overlay-btn arcade-pause">Pause</button><button class="overlay-close arcade-exit">Back to games</button>';
    document.body.append(this.root);
    this.q = (selector) => this.root.querySelector(selector);
    this.q(".arcade-start").onclick = () => this.start();
    this.q(".arcade-pause").onclick = () => this.togglePause();
    this.q(".arcade-exit").onclick = () => {
      if (this.selection) this.open();
      else app.closeOverlay("arcade-overlay");
    };
    document.addEventListener("keydown", (event) => {
      if (
        !this.root.classList.contains("show") ||
        event.repeat ||
        !this.model ||
        ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) ||
        (event.target.tagName === "BUTTON" &&
          [" ", "Enter"].includes(event.key))
      )
        return;
      const action = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: this.selection === "heading" ? "jump" : "up",
        " ":
          games[this.selection].actions.length === 1
            ? games[this.selection].actions[0]
            : this.selection === "flag"
              ? "both"
              : "jump",
      }[event.key];
      if (action) {
        event.preventDefault();
        if (
          ["get", "heading"].includes(this.selection) &&
          ["left", "right"].includes(action)
        ) {
          this.held = action;
          this.repeatAt = 0;
        }
        this.input(action);
      }
    });
    document.addEventListener("keyup", (event) => {
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) this.held = null;
    });
    window.addEventListener("blur", () => {
      this.held = null;
      this.pause();
    });
    const loop = (time) => {
      if (this.model) {
        if (app.state.isDead || app.state.vacationAt > 0) {
          this.cancel();
          this.last = time;
          requestAnimationFrame(loop);
          return;
        }
        if (document.hidden || app.panelVisible === false) this.pause();
        else if (!this.model.snapshot().paused) {
          if (this.last) this.model.advance(time - this.last);
          if (this.held && time >= this.repeatAt) {
            this.input(this.held);
            this.repeatAt = time + 150;
          }
          this.paint();
        }
      }
      this.last = time;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  open() {
    this.cancel();
    this.q(".arcade-announcement").textContent = "";
    this.announcementKey=null;
    this.selection = null;
    this.app.openOverlay("arcade-overlay");
    this.q(".overlay-title").textContent = "Choose a game";
    this.q(".arcade-picker").replaceChildren();
    for (const [id, name] of [
      ["guess", "Left and right"],
      ...Object.entries(games).map(([id, g]) => [id, g.name]),
    ]) {
      const b = document.createElement("button");
      b.className = "overlay-btn";
      b.textContent = name;
      b.onclick = () => {
        if (id === "guess") {
          const reason=this.unavailable();
          if(reason){this.q(".arcade-instruction").textContent=reason;this.q(".arcade-announcement").textContent=reason;return;}
          this.app.closeOverlay("arcade-overlay");
          this.app.startGame();
        } else this.select(id);
      };
      this.q(".arcade-picker").append(b);
    }
    this.showRun(false);
    this.q(".arcade-instruction").textContent = this.unavailable() || "Pick something to play.";
    this.q(".arcade-exit").textContent = "Close";
    this.q(".arcade-picker button")?.focus();
  }
  showRun(selected) {
    for (const selector of [
      ".arcade-options",
      ".arcade-start",
      ".arcade-pet",
      ".arcade-cue",
      ".arcade-field",
      ".arcade-score",
      ".arcade-meter",
      ".arcade-actions",
      ".arcade-pause",
    ])
      this.q(selector).hidden = !selected;
    this.q(".arcade-picker").hidden = selected;
  }
  select(id) {
    this.selection = id;
    this.q(".arcade-announcement").textContent = "";
    this.announcementKey=null;
    this.q(".arcade-options span").textContent =
      id === "sprint" ? " Steady running" : ["bump","heading"].includes(id) ? " Slower pace" : " Slower cues";
    this.showRun(true);
    this.q(".overlay-title").textContent = games[id].name;
    this.q(".arcade-instruction").textContent = games[id].instruction + (id === "sprint" ? " You: upper lane. Opponent: lower lane." : "");
    this.q(".arcade-start").disabled = !!this.unavailable();
    this.q(".arcade-start").hidden = false;
    this.q(".arcade-options").hidden = ![
      "memory",
      "bump",
      "heading",
      "flag",
      "sprint",
      "hoops",
    ].includes(id);
    this.q(".arcade-field").hidden = true;
    this.q(".arcade-meter").hidden = true;
    this.q(".arcade-pause").hidden = true;
    this.q(".arcade-cue").textContent = "";
    this.q(".arcade-score").textContent = "";
    this.q(".arcade-actions").replaceChildren();
    this.q(".arcade-exit").textContent = "Back to games";
    this.drawPet();
    if (this.unavailable()) this.q(".arcade-instruction").textContent = this.unavailable();
    this.q(this.unavailable()?".arcade-exit":".arcade-start").focus();
  }
  unavailable() {
    const st=this.app.state;
    if(st.isDead)return "Start a new pet before playing.";
    if(st.vacationAt>0)return "Turn Vacation off before playing.";
    if(st.stage==="egg")return "Your pet can play after hatching.";
    if(st.isSleeping)return "Wake your pet before playing.";
    if(st.isSick)return "Your pet needs medicine before playing.";
    if(st.hunger===0)return "Feed your pet before playing.";
    return "";
  }
  start() {
    const st = this.app.state;
    if ((this.model && !this.model.snapshot().result) || !this.selection) return;
    const reason=this.unavailable();
    if(reason){
      this.q(".arcade-instruction").textContent=reason;
      this.q(".arcade-announcement").textContent=reason;
      return;
    }
    this.cueSoundKey=null;
    this.announcementKey=null;
    this.model = games[this.selection].create({
      slow: this.q("input").checked,
      hold: this.q("input").checked,
    });
    this.settled = false;
    this.last = 0;
    applyWellbeingAction(st, "play", now());
    st.save();
    this.q(".arcade-start").hidden = true;
    this.q(".arcade-options").hidden = true;
    this.q(".arcade-field").hidden = false;
    this.q(".arcade-pet").hidden = true;
    this.q(".arcade-pause").hidden = false;
    this.q(".arcade-actions").replaceChildren();
    for (const action of games[this.selection].actions) {
      const b = document.createElement("button");
      b.className = "overlay-btn";
      b.textContent =
        action === "run" && this.q("input").checked
          ? "Run steadily"
          : action[0].toUpperCase() + action.slice(1);
      b.onclick = () => this.input(action);
      if (
        ["get", "heading"].includes(this.selection) &&
        ["left", "right"].includes(action)
      ) {
        b.onpointerdown = () => {
          this.held = action;
          this.repeatAt = 0;
        };
        for (const type of ["pointerup", "pointercancel", "pointerleave"])
          b.addEventListener(type, () => (this.held = null));
      }
      this.q(".arcade-actions").append(b);
    }
    this.paint();
    this.root.focus();
  }
  input(action) {
    if (this.app.state.isDead || this.app.state.vacationAt > 0) {
      this.cancel();
      return;
    }
    if (!this.model) return;
    if(document.hidden || this.app.panelVisible===false){this.pause();return;}
    const s = this.model.snapshot();
    if(s.paused || s.result)return;
    if (this.selection === "sprint" && s.hold && action === "run")
      action = "hold";
    this.model.input(action);
    this.paint();
  }
  pause() {
    this.held = null;
    this.cueSoundKey=null;
    if (this.model && !this.model.snapshot().result) {
      this.model.pause();
      this.q(".arcade-pause").textContent = "Resume";
      this.q(".arcade-cue").textContent = "Paused";
    }
  }
  togglePause() {
    if (!this.model) return;
    if(this.app.state.isDead || this.app.state.vacationAt>0){this.cancel();return;}
    if(document.hidden || this.app.panelVisible===false)return;
    if (this.model.snapshot().paused) {
      this.model.resume();
      this.last = 0;
      this.q(".arcade-pause").textContent = "Pause";
      this.paint();
    } else this.pause();
  }
  cancel() {
    this.held = null;
    this.model?.quit();
    this.model = null;
    this.last = 0;
  }
  drawPet() {
    const sp = SP[this.app.state.character];
    if (sp) this.app.renderer.renderToCanvas(this.q(".arcade-pet"), sp.idle1);
  }
  paint() {
    const s = this.model.snapshot();
    if(s.id === "sprint" && s.hold){
      const run=this.q(".arcade-actions").children[0];
      if(run){run.textContent=s.holding?"Stop running":"Run steadily";run.setAttribute("aria-pressed",String(s.holding));}
    }
    this.drawPet();
    this.q(".arcade-pause").textContent = s.paused ? "Resume" : "Pause";
    const score = s.result
      ? s.result === "win"
        ? "You won! +1 Happy"
        : "Round finished. Try again."
      : s.id === "get"
        ? `${s.score}/12 notes · ${s.lives} lives · ${Math.ceil(s.remaining / 1000)}s`
        : s.id === "bump"
          ? `Bout ${s.bout}/3 · ${s.wins} wins · Target ${s.target.join(" to ")}`
          : s.id === "heading"
            ? `${s.score}/10 headers · ${s.misses}/3 misses · ${Math.ceil(s.remaining / 1000)}s`
            : s.id === "memory"
              ? `Round ${s.round}/5 · ${s.entered}/${s.length}`
              : s.id === "flag"
                ? `Round ${s.round}/15 · ${s.score} correct`
                : s.id === "sprint"
                  ? `Race to ${s.finish} steps`
                  : `Shot ${s.shot}/5 · ${s.score} baskets`;
    if (this.q(".arcade-score").textContent !== score)
      this.q(".arcade-score").textContent = score;
    const cue = arcadeCue(s);
    if (this.q(".arcade-cue").textContent !== cue)
      this.q(".arcade-cue").textContent = cue;
    // Announce outcomes and care changes, not the clock on every second.
    const announcementKey=JSON.stringify([s.result,s.score,s.lives,s.misses,s.round,s.bout,s.shot]);
    if(announcementKey!==this.announcementKey){
      this.announcementKey=announcementKey;
      this.q(".arcade-announcement").textContent=s.id==="get"&&!s.result
        ? `${s.score} notes. ${s.lives} lives.`
        : s.id==="heading"&&!s.result
          ? `${s.score} headers. ${s.misses} misses.` : score;
    }
    if(s.id==="memory" && s.phase==="watch" && s.cue && !s.paused){
      const key=`${s.round}:${s.cueIndex}`;
      if(this.cueSoundKey!==key){
        this.cueSoundKey=key;
        this.app.sound.beep?.({left:440,up:660,right:880}[s.cue],100);
      }
    }
    drawArcade(
      this.q,
      s,
      arcadeSprite(petType, this.app.state.character),
      palette,
      {reducedMotion:!!this.app.motionDisabled?.()},
    );
    if (
      s.result &&
      !this.settled &&
      !this.app.state.isDead &&
      !(this.app.state.vacationAt > 0)
    ) {
      this.settled = true;
      if (s.result === "win") {
        this.app.state.happiness = Math.min(4, this.app.state.happiness + 1);
        this.app.sound.gameWin();
      } else this.app.sound.gameLose();
      this.app.state.save();
      this.app.updateButtons();
      this.q(".arcade-pause").hidden = true;
      this.q(".arcade-exit").focus();
      for (const b of this.q(".arcade-actions").children) b.disabled = true;
    }
  }
}

export function arcadeCue(s) {
  if(s.paused)return "Paused";
  if(s.result)return s.result==="win"?"Nice work!":"Try another round";
  if(s.id==="memory")return s.cue?`Watch: ${{left:"← Left",up:"↑ Up",right:"→ Right"}[s.cue]}`:s.phase==="answer"?"Your turn":"Watch";
  if(s.id==="flag"){
    if(s.phase==="rest")return s.correct?"Correct!":"Missed that one";
    return `Round ${s.round}: ${s.cue==="fake"?"Fake! Wait":s.cue?.toUpperCase()||"Wait"}`;
  }
  if(s.phase==="countdown")return "Ready…";
  if(s.id==="bump")return s.phase==="meter"?"Stop in the target":s.boutWon?"You won the bout!":"Opponent wins this bout";
  if(s.id==="hoops")return s.phase==="ready"?"Press Shoot when ready":s.phase==="aim"?"Stop in the target":s.made?"Basket!":"Missed the basket";
  if(s.id==="get")return "Catch notes. Dodge poop.";
  if(s.id==="heading")return "Jump to meet the ball";
  if(s.id==="sprint")return s.hold?(s.holding?"Running steadily":"Press Run steadily to go"):"Keep running!";
  return "";
}
