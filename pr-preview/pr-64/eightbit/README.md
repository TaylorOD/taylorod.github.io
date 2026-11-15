# 8 bit mode

Open `/?mode=8bit` for the pixel town. The normal site and `?mode=work` still work the same way. `projects.html?mode=8bit` opens the arcade directly.

Click a building or a section button to explore. Focus the town and use the arrow keys or A and D to walk, then Enter to open the nearest stop. The buttons below the town work with touch too. Reduced motion skips the automatic walk between stops.

`boot.js` checks the query before loading the alternate stylesheet and modules. `portfolio.js` handles content and navigation. `world.js` draws the original pixel scenery and handles movement. `style.css` keeps the layout scoped to this mode.

Keep the project list and work history in `portfolio.js` in sync with the normal home and projects pages.

## Checking changes

Serve the repository with a static server and look at the actual pages in a browser. Check the home, work, projects and contact sections at desktop and phone widths. Check keyboard walking, touch controls, browser back, direct section links and the return to the normal site. Run `node --check` on the three JavaScript files and `git diff --check` before pushing.

The original experiment is at https://github.com/TaylorOD/8_bit_portfolio.
