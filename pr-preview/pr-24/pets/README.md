# Pocket pets

The pizza button on the home and projects pages opens a small virtual pet panel. Choose classic, pizza slice or cyberpunk. Each pet has its own progress in localStorage. Clearing browser data clears the pets too.

Feed, clean and win a left or right guess to care for a pet. Six care actions make it grow and twenty make it a grown up. Sleep restores energy over time. Care needs change while away, capped at eight hours per visit. Pets do not die. This is a lightweight adaptation, not the full P1 simulation.

The game loads on the first click and stops its animation timer when closed. There are no dependencies, accounts or API calls. Blocked browser storage falls back to the current visit and shows a note.

Files are split between the launcher, panel, state and art. Classic sprite credits and license are in [NOTICE.md](NOTICE.md).

Run the state checks with `node --test pets/state.test.mjs`. Serve the repository over HTTP to test the module scripts in a browser.
