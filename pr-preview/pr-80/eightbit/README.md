# side quest arcade

Open `/?mode=8bit` for the alternate portfolio. `projects.html?mode=8bit` opens the arcade directly. The normal site and work mode remain separate.

Click a building or machine to walk over. Use WASD or arrow keys to move and E or Enter to interact. Phone visitors have direction buttons. The projects and map menus provide direct access without walking.

Explore the town, arcade and cabin. Choose a companion, collect eight project stamps and download a postcard. Deliver the arcade pizza to the neighbor on the town bench to unlock the rooftop. Progress stays in local storage, with a fallback when storage is unavailable. Sound starts only when enabled. Reduced motion disables decorative animation and camera easing.

## files

`boot.js` loads this mode only when requested. `content.js` owns project descriptions, work history and saved progress. Keep its content aligned with the normal site.

`scenes.js` defines rooms, collision areas and routes. `art.js` draws the original pixel scenery and illustrations. `arcade-art.js` owns the coin op interior and attract screens. `world.js` handles movement, the camera and rendering. `portfolio.js` handles dialogs, navigation and quests. `sound.js` synthesizes optional effects. `style.css` contains the alternate layout.

Project dialogs show actual browser screenshots. Lilgotchi, Snowcrust and Relay also have small interactive demos. The companions use the actual Lilgotchi 3.0.7 sprite families, with Slice selected by default. The original 2020 portfolio runs inside the arcade repair desk using local archive assets.

The cabin art uses the supplied house photos as reference. The photos themselves are private and are not published.

## review checklist

| request | implementation |
| --- | --- |
| a composed arcade | 23 coin op machines, dark patterned carpet, neon, pinball, a cocktail cabinet, change counter and photo booth |
| distinct main machines | eight labeled project cabinets with CRT previews, joysticks, buttons and coin doors |
| real project previews | eight browser screenshots and three playable demos |
| connected interaction | object centered dialog entry, cabinet proximity cues and focus return |
| expressive companions | real sprites, directional looks, greetings, curiosity and idle sleep |
| player movement | directional poses, walking cycle and pizza carrying |
| personal rooms | photo inspired cabin with a wooded approach |
| opening | immediate controls, sign bulbs lighting up and companion greeting |
| lighting and depth | room palettes, cabinet glow and depth sorting, river canopies fade around people |
| discovery | explicit click targets, labels, cursor feedback and reachable approaches |
| pizza quest | seated recipient, pizza carrying, visible key exchange and changed rooftop lock |
| keepsakes | drawn project stamps, collection animation, three postcard poses and PNG download |
| original computer | working local archive with navigation and gallery filters |
| meaningful copy | project details, work history and direct contact access |
| phone layout | 44 pixel direction buttons, wrapping labels, direct project menu and phone camera framing |
| populated town | varied residents visit public buildings, no house visits, kayaker, fly fisher and Brennan's Wave |

Eight arcade regulars play decorative machines while visitors come and go. The project machines remain available to the player.

First visits include a companion approaching from the arcade door and silhouettes moving behind the windows. River ambience gets louder near the water. Dialogs return toward their source with a short closing animation. Reduced motion skips these movements. A real iPhone long press check is still needed beyond the Chrome phone viewport check.

## checking changes

Serve the repository with a static server. Run `node --test eightbit/tests/*.test.mjs` and `git diff --check`.

Look at the actual town, interiors and dialogs in a browser at desktop and phone widths. Check walking into a machine, keyboard controls, pet persistence, pizza delivery, stamp collection, the postcard download, browser back and the return to the normal site. Check that all project links still match their destinations.

The original experiment is at https://github.com/TaylorOD/8_bit_portfolio.
