# side quest arcade

Open `/?mode=8bit` for the alternate portfolio. `projects.html?mode=8bit` opens the arcade directly. The normal site and work mode remain separate.

Click a building or machine to walk over. Use WASD or arrow keys to move and E or Enter to interact. Phone visitors have direction buttons. The projects and map menus provide direct access without walking.

Explore the town, arcade, workshop and cabin. Choose a companion, collect eight project stamps and download a postcard. Deliver the arcade pizza to the neighbor on the town bench to unlock the rooftop. Progress stays in local storage, with a fallback when storage is unavailable. Sound starts only when enabled. Reduced motion disables decorative animation and camera easing.

## files

`boot.js` loads this mode only when requested. `content.js` owns project descriptions, work history and saved progress. Keep its content aligned with the normal site.

`scenes.js` defines rooms, collision areas and routes. `art.js` draws the original pixel scenery and illustrations. `world.js` handles movement, the camera and rendering. `portfolio.js` handles dialogs, navigation and quests. `sound.js` synthesizes optional effects. `style.css` contains the alternate layout.

Project dialogs show actual browser screenshots. Lilgotchi, Snowcrust and Relay also have small interactive demos. The companions use the actual Lilgotchi 3.0.7 sprite families, with Slice selected by default. The original 2020 portfolio runs inside the workshop computer using local archive assets.

The cabin art uses the supplied house photos as reference. The photos themselves are private and are not published. Workshop keepsakes tell specific career stories from Taylor's 2024 resume. Resume contact details are not included.

## review checklist

| request | implementation |
| --- | --- |
| a composed arcade | background cabinet banks, a featured row, coffee lounge, card table, exercise station and photo booth |
| distinct main machines | glass pet habitat, brick pizza oven, server rack and exercise bike |
| real project previews | eight browser screenshots and three playable demos |
| connected interaction | object centered dialog entry, cabinet proximity cues and focus return |
| expressive companions | real sprites, directional looks, greetings, curiosity and idle sleep |
| player movement | directional poses, walking cycle and pizza carrying |
| personal rooms | photo inspired cabin and office with three career keepsakes |
| opening | immediate controls, sign bulbs lighting up and companion greeting |
| lighting and depth | room palettes, cabinet glow and depth sorting, river canopies fade around people |
| discovery | explicit click targets, labels, cursor feedback and reachable approaches |
| pizza quest | seated recipient, pizza carrying, visible key exchange and changed rooftop lock |
| keepsakes | drawn project stamps, collection animation, three postcard poses and PNG download |
| original computer | working local archive with navigation and gallery filters |
| meaningful copy | project details, factual career examples and direct contact access |
| phone layout | 44 pixel direction buttons, wrapping labels, direct project menu and phone camera framing |
| populated town | varied residents visit public buildings, no house visits, kayaker, fly fisher and Brennan's Wave |

The implementation covers the functional review list. Some earlier cinematic ideas remain simpler: the pet greets beside the player instead of emerging from a doorway, room ambience is not positional audio, and the return from a dialog uses focus and proximity cues rather than a reverse cabinet animation. These are visual refinements, not claims of completed effects. A real iPhone long press check is still needed beyond the Chrome phone viewport check.

## checking changes

Serve the repository with a static server. Run `node --test eightbit/tests/*.test.mjs` and `git diff --check`.

Look at the actual town, interiors and dialogs in a browser at desktop and phone widths. Check walking into a machine, keyboard controls, pet persistence, pizza delivery, stamp collection, the postcard download, browser back and the return to the normal site. Check that all project links still match their destinations.

The original experiment is at https://github.com/TaylorOD/8_bit_portfolio.
