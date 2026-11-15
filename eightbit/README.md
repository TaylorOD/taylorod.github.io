# side quest arcade

Open `/?mode=8bit` for the alternate portfolio. `projects.html?mode=8bit` opens the arcade directly. The normal site and work mode remain separate.

Click a building or machine to walk over. Use WASD or arrow keys to move and E or Enter to interact. Phone visitors have direction buttons. The projects and map menus provide direct access without walking.

Explore the town, arcade, workshop and cabin. Choose a companion, collect eight project stamps and download a postcard. Deliver the arcade pizza to the cabin couch to unlock the rooftop. Progress stays in local storage, with a fallback when storage is unavailable. Sound starts only when enabled. Reduced motion disables decorative animation and camera easing.

## files

`boot.js` loads this mode only when requested. `content.js` owns project descriptions, work history and saved progress. Keep its content aligned with the normal site.

`scenes.js` defines rooms, collision areas and routes. `art.js` draws the original pixel scenery and illustrations. `world.js` handles movement, the camera and rendering. `portfolio.js` handles dialogs, navigation and quests. `sound.js` synthesizes optional effects. `style.css` contains the alternate layout.

Project screens are original pixel illustrations. Their buttons open the real projects. The companions are small town sprites inspired by lilgotchi, not the full pet application.

## checking changes

Serve the repository with a static server. Run `node --test eightbit/tests/*.test.mjs` and `git diff --check`.

Look at the actual town, interiors and dialogs in a browser at desktop and phone widths. Check walking into a machine, keyboard controls, pet persistence, pizza delivery, stamp collection, the postcard download, browser back and the return to the normal site. Check that all project links still match their destinations.

The original experiment is at https://github.com/TaylorOD/8_bit_portfolio.
