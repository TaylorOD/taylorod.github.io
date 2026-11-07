# Pocket pets

The pizza button on the home and projects pages opens a small virtual pet panel. Choose classic, pizza slice or cyberpunk. Each pet has its own progress in localStorage. Clearing browser data clears the pets too.

The game now uses the P1 clone implementation from plateaukao/tamagochi. Eggs hatch after 90 seconds, babies become children after an hour, and the child and teen stages each last a day. Care mistakes and discipline determine the evolution branch and adult character. The six adult branches and secret Oyajitchi check are retained.

Meals, snacks, weight, hunger, happiness, discipline, waste, sickness, medicine, attention calls, local clock sleep schedules, lights, aging and death are included. Play is the clone's five round guessing game. Sound starts muted and can be enabled with the sound button. Reset and New Egg restart only the selected pet.

All three pets use the same rules with separate saves. Pizza and cyberpunk replace the character artwork, including variations across evolutions. Classic keeps the original sprites. This is the open source clone's game, not official firmware or a claim of exact hardware parity. Optional AI chat is not included.

Time away is processed in minute steps, capped at 25 days per catch up. Sleep uses local time. Catch up advances hatching, age and care, and preserves timer fractions across repeated opens. Random events during catch up are approximate. The clone's limits remain, including sickness blocking evolution and adult mortality rules.

Full game saves use `taylor-pocket-pets-p1-v1-{type}`. The earlier simplified save at `taylor-pocket-pets-v1` is left untouched. The new rules start with new eggs rather than inventing a history of care and discipline for old pets.

The game loads on the first click. Closing the panel removes its iframe and stops its timers and sound. There are no dependencies, accounts or API calls. Blocked browser storage falls back to the current page visit and shows a note.

Files separate the panel, game controller, state and evolution, storage, clock, sound, renderer, font and skins. Source credits and license are in [NOTICE.md](NOTICE.md).

Run the gameplay checks with `node --test pets/game.test.mjs`. Serve the repository over HTTP to test the module scripts in a browser.
