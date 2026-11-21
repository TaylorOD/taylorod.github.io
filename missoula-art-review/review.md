# missoula art review

The style has drifted. The scenery reads as a detailed painted game world. The people read as simpler block sprites. The arcade makes that split especially obvious.

This branch is a review pack. It contains five scene drafts, one player model draft, the current character sheets, and a pose list for the full cast. It does not replace the live artwork or claim the interaction fixes are finished.

## what is covered

The baseline is `ac1533b`, which matched the remote master branch when checked on November 21, 2026. The live town and arcade were inspected in Chrome. The current house and roof images were inspected directly. All 34 approach points were also inspected in a local browser sheet using the current background images and player renderer.

There are 44 model entries in the proposed catalog. That includes shared appearances, six trail dog variants, four companion families, the six arcade roles, a grouped carousel horse model and a dormant deer model. It is not a count of 44 unique people on screen. The deer renderer exists but is not called by the current town renderer.

The pose list has 752 proposed model, direction and action combinations. Every row needs final frame artwork. Some actions describe the physical pose that should accompany an existing panel, such as reading or using a cabinet. They are not all current gameplay animations.

There are 14 town points, 13 arcade points, four house points and three roof points. The review page can show 272 player arrival cases across four facings and both pizza states. Those are available cases, not 272 animation passes.

The game currently opens directly into town. The main image is a proposed title or presentation image. The separate portfolio homepage is outside this artwork replacement.

## the visual problems

| Finding | Evidence | Change needed |
| --- | --- | --- |
| Backgrounds and actors have different detail levels | Live town and arcade, plus all four background PNGs | Use the same visible pixel grid and palette rules for scenery, people and props |
| The arcade is glossy and much brighter than the requested dark coin op room | Live arcade and `eightbit/assets/arcade.png` | Keep recognizable cabinets, but reduce highlights, surface detail and floor brightness |
| Residents turn their heads while much of the torso and legs stay facing forward | Browser direction sheets and `drawResident` | Author distinct front, back and side silhouettes |
| Sitting mostly reuses a standing body | Browser sit sheet and `drawResident` | Add seated hips, thighs, lower legs and seat anchors |
| Regulars do not consistently reach the cabinet or pinball controls | Live arcade screenshot and `drawArcadeRegular` | Place hands on explicit joystick, button and flipper anchors for each machine |
| Bar and poker poses depend on rectangular body clipping | `drawArcadeRegular` | Separate upper body, hands, tabletop, seat and legs. Clip against the prop silhouette |
| House and roof actors look small beside the furniture | Browser house and roof contact sheets | Approve a human to chair and desk scale before authoring the final scenes |
| The house pet approach places the player over the dog bed image | House contact sheet at `pets` | Move the approach or give the bed a collision and foreground mask |
| Carried pizza overlaps nearby furniture in the arcade crops | Arcade carrying sheet at poker and stairs | Include the held item in clearance checks and use the right prop foreground layer |
| The player stands at interaction points instead of acting | `World.draw`, `person` and the browser contact sheets | Add cabinet, reading, typing, delivery, seated and greeting poses |
| Several animal motions change position without a full body cycle | Scout, elk and visitor renderers | Author discrete run, graze, sniff, climb and landing frames |
| Pets reuse look frames while moving | `drawCompanion` | Add directional walk cycles where needed. Preserve the actual lilgotchi identities |
| Continuous scale and rotation can change pixel shape | Campus distance scaling, arcade scale of 1.85, grazing rotation and curved leashes | Use approved size tiers and rasterized frames on a fixed grid |

The imported `foreground` rectangles in `world.js` are not used in the current interior draw path. Backgrounds are drawn first and actors afterward. That is why a clean path alone cannot guarantee correct furniture overlap.

## the proposed style

Use a 384 by 256 logical scene for the art direction draft, with whole pixel enlargement. Keep a small shared palette, aiming for 24 scene colors and eight colors per character. Use flat color groups and one clear shadow color. Final dimensions can change if readability testing calls for it, but the pixel grid must remain consistent.

Keep the Wilma, campus tower, mountains, arcade, cabin, river and bridge recognizable. Keep the existing room layouts as the starting point. Simplify the texture rather than losing the place.

Each model needs a frame name, direction, duration and ground anchor. Interaction frames also need hand, seat, held item or leash anchors. Fixed furniture actions can constrain facing, but that constraint must be explicit. An unsupported direction must not silently fall back to a front sprite.

The draw order should be background, back of prop, actor, contact details, front of prop, foreground. A desk example has the chair back behind the person, hands over the keyboard, knees behind the desktop and feet below it.

## draft notes

| Draft | What it helps decide | Still needs cleanup |
| --- | --- | --- |
| Main | Title treatment, landmarks and a simpler shared palette | Companion identity and exact pixel grid |
| Town | How much scenery detail to remove while keeping Missoula recognizable | BASIL must become BASAL. Add the SBG sign. Match character detail to scenery |
| Arcade | Chunkier machines, clear aisles and visible interaction poses | Still too bright for the darkest arcade direction. Hands need exact anchors. Restore player clothing and the real companion |
| House | Simpler beams and furniture, reading and desk interaction examples | Character detail remains finer than scenery. Restore exact player clothing. Build separate desk and chair layers |
| Roof | Simplified skyline, bench and pizza table seating | Player shoes and shorts drifted. Companion was redesigned. Seat and tabletop layers need production work |
| Player model | True side views, rear view, carry, reach and sitting silhouettes | One walk pose is not a walk cycle. Back carry needs an intentional visible grip. Convert the approved design into exact grid frames |

All drafts came from the built in image generation tool. The prompt set is saved in `prompts.json`. They are visual proposals, not exact palette compliant or ready to slice sprite atlases. The house draft was edited once to remove an unwanted generated review card.

## checks

The existing 51 tests pass. The inventory script found a route to all 34 interaction points. The browser review covered the current direction sheet, seated examples, all interaction point locations, selected pizza carrying states, and the new scene comparison page.

The contact sheet uses frozen background images. It does not include the live town tree masks, patched shop labels, every moving character, every companion position or every time of day. The screenshots therefore support arrival pose and scale findings. They do not certify the full game against clipping.

The review page was checked at desktop and a phone viewport. Full game checks still need approach, act, turn and exit sequences for each allowed actor and prop pairing, every animation frame, companion spacing, carried items, day and night, reduced motion and phone controls. Those checks belong with the final art implementation.

## separate changes after review

1. Approve the pixel grid, palette, player silhouette and scene direction.
2. Add the shared model and frame definitions, including explicit unsupported states.
3. Finish the town artwork and its interaction layers.
4. Finish the arcade artwork and cabinet, pinball, poker and bar contact poses.
5. Finish the house artwork and desk, shelf, chair and dog bed interactions.
6. Finish the roof artwork, stairs, seating and postcard poses.
7. Finish the remaining animal and companion frames and run the full interaction review.

Each implementation change should have its own branch, PR, browser check and screenshots. This review branch stays a draft until the direction is accepted.

## open the review locally

From the repository root, run `python -m http.server 8871 --bind 127.0.0.1` and open `http://127.0.0.1:8871/missoula-art-review/`.

Run `node missoula-art-review/audit.mjs` to rebuild the catalog and pose list from the baseline source. The script only writes files in the review folder.
