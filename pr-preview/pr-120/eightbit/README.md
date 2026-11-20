# 8 bit missoula

A small explorable Missoula at `/8-bit-missoula/`. The portfolio links to it as its own project. Old `?mode=8bit` bookmarks redirect here.

Find four lilgotchi around town and inside the house and arcade. Some are hiding in the scenery. One needs a pizza delivered to a neighbor. Tap the found counter for hints. Found friends become walking companions, and finding everyone unlocks a Missoula postcard.

Click a place to walk there, or use WASD and the arrow keys. E or Enter interacts. Phone visitors have direction buttons. The project menu opens the portfolio projects without walking.

The arcade has seven project cabinets, pinball and a Poker Seater table. The house has books, a desk and Scout. Deliver the pizza from the arcade to unlock the rooftop. Existing optional sound stays off until enabled. No new audio was added.

## main files

| File | Responsibility |
| --- | --- |
| `boot.js` | Old bookmark redirects |
| `portfolio.js` | Dialogs, navigation, collection and quests |
| `content.js` | Project content and validated saved progress |
| `hunt.js` | Discovery rules and old save migration |
| `hunt-art.js` | Hidden friends drawn separately from backgrounds |
| `world.js` | Movement, camera and scene rendering |
| `scenes.js` | Rooms, collision areas and reachable interactions |
| `town-view.js` | Painted town, depth and outdoor activity |
| `interior-view.js` | Approved interior images and rooftop sky |
| `residents.js` | Shared people art and resident schedules |
| `scout.js` | Long squirrel chases, safe tree endings and occasional elk flight |
| `river-life.js` | Fly casting, surfing and rafting |
| `daylight.js` | Six minute outdoor clock |
| `companions.js` | Real lilgotchi sprites and recorded footstep following |

The clock moves through sunset, blue hour, night, dawn and daytime. It continues between rooms and pauses with dialogs or hidden tabs. Reduced motion holds a warm sunset and still wildlife poses.

Progress stays in local storage with a fallback when storage is unavailable. Old adopted companions and completed pizza deliveries become discoveries. Project visit stamps remain saved separately from the hunt.

The source photos used for the house and Scout are private and are not published. The original 2020 portfolio is available through the arcade computer using local archive assets.

## checking changes

Serve the repository with a static server. Run `node --test eightbit/tests/*.test.mjs` and `git diff --check`.

Look at the changed areas in a browser at desktop and phone widths before pushing. Check walking routes, interactions, collection hints, saved progress, the pizza delivery, rooftop lock, postcard and links. Keep screenshots in each PR.

Phone checks use a Chrome viewport. A physical iPhone touch check remains separate.

The original experiment is at https://github.com/TaylorOD/8_bit_portfolio.
