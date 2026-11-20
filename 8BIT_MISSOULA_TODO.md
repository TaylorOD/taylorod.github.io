# 8 bit missoula todos

Updated November 20, 2026. This is the full remaining work list, including work interrupted by the newer requests.

## Finished

| Work | Status |
| --- | --- |
| Give the fisher a different appearance so only Taylor uses the player sprite | Merged in PR 105 |
| Speed up Scout and the squirrel | Merged in PR 105. The fuller chase below is still pending |
| Add six dog varieties | Merged in PR 105 |
| Straighten the main street rooflines | Merged in PR 106 |
| Add Runner’s Edge, Basil and Shakespeare Books signs | Merged in PR 106. Correct Basil to Basal and add links below |
| Rename the arcade Last Best Arcade | Merged in PR 106 |
| Restore tree fading | Merged in PR 106, but the replacement tree art was rejected. Restore the original style below |
| Fix the carousel return route at the path junction | Merged in PR 106. Browser round trip passed and route tests cover both directions |
| Remove the town map, map menu and M shortcut | Merged in PR 107 |
| Check desktop and phone layouts before pushing | Done for PRs 105, 106 and 107, with screenshots in each PR |
| Run the existing tests | 36 passed after map removal, including the added carousel round trip test |
| Generate arcade and house previews | Done. Layouts liked, but both still need the existing town art style |

## Finish the interrupted work

1. Verify the final deployed site after PR 107. The local checks and merges finished, but the final live browser check was interrupted.
2. Replace the rejected blocky river trees with the original type and detail. Keep the ability to fade behind the player and companions. Do not treat the current tree art as accepted.
3. Keep the carousel route fix and repeat the browser round trip after the new town art and movement changes.
4. Finish the new interior art before implementing it. The generated previews are concepts, not installed game assets.

## One consistent art style

1. Use the existing outdoor town as the reference for pixel size, palette, shading, perspective and detail.
2. Rework the arcade preview to that style while keeping its approved layout and furniture.
3. Rework the house preview to that style while keeping the teal chair, fireplace, furnishings and Scout details from the photos.
4. Improve all people, including Taylor, residents, students, joggers, cyclists, fishers and interior patrons. Make them match the buildings and interiors. Taylor must remain visually unique.
5. Keep trees in the original town style, with matching layered sprites rather than visibly different replacement shapes.
6. Reduce duplicate benches and fix uneven bench geometry. Use consistent proportions and symmetrical construction without forcing every scene placement to be mirrored.
7. Check the whole town and both interiors together on desktop and phone before publishing.

## Town places and popups

1. Replace the vague “by the river” interaction on the bridge. It currently only displays a throwaway river toast. Give the interaction a useful Brennan’s Wave label and popup near the wave.
2. Expand the carousel popup with verified history, ring catching and speed. It opened May 27, 1995. Its outer horses travel at nearly 8 mph. Do not claim it is America’s oldest ring carousel without evidence.
3. Add website popups for Runner’s Edge, Basal and Shakespeare Books.
4. Correct the restaurant sign from Basil to Basal to match the real business.
5. Make the last storefront SBG Missoula, with an appropriate website popup.
6. Make each storefront interaction reachable without walking through a building or blocking the main sidewalk.

## River life

1. Restore Brennan’s Wave in the active town renderer, with visible moving whitewater and surfers. An older river module exists, but that alone does not mean it is visible in the current painted town.
2. Add rafters moving naturally along the river and beneath the bridge.
3. Make the fishers actually fly cast. Draw a believable rod, reel, bent rod tip, backcast, forward cast, traveling line loop and drifting fly.
4. Keep fishing lines and river activity clear of the bridge and walking routes.

## Movement

1. Remove the side to side wiggle on narrow paths. Smooth route following and facing changes while preserving collision checks.
2. Test the home road, university path, both river walks, bridge and carousel connector in both directions.
3. Check that companions follow those turns smoothly and do not cut through scenery.
4. Keep the road back to the house clear and preserve the grass between the upper river path and sidewalk.

## Arcade and house

1. Make Poker Seater an actual poker table with cards, chips, seats and a reachable interaction.
2. Improve the pinball tables with recognizable sloping playfields, flippers, bumpers and backboxes.
3. Keep project names on the arcade cabinets. Remove invented filler names such as Space War.
4. Implement the matching arcade art with usable aisles, exits and project interactions.
5. Implement the matching house art with reachable books, desk, Scout and companion interactions.
6. Keep characters and any discoverable lilgotchi separate from background art so they can move or be found properly.

## Scout and wildlife

1. Replace the short repeating chase with a longer continuous chase along several possible routes.
2. Let the squirrel choose from suitable trees around the accessible scene rather than repeating the same pair.
3. End each chase with the squirrel visibly climbing the tree and remaining safely above Scout.
4. Have Scout stop below, jump up and bark, then settle or return home. No catches, kills or disappearing squirrel that suggests a kill.
5. Occasionally have the elk flee when Scout runs out, with visible departure and a natural return. Do not trigger it every time.
6. Keep Scout, squirrel and elk routes continuous and avoid teleporting between phases.
7. Preserve reduced motion behavior. Barking can be shown through animation. Do not add audio yet.

## 8 bit missoula and finding lilgotchi

1. Make this its own project called “8 bit missoula” instead of presenting it as the portfolio’s “mode 8 bit”.
2. Give it a dedicated entry page and URL, with the portfolio linking to the project.
3. Preserve existing old links with a sensible transition to the dedicated project.
4. Make finding lilgotchi the main game, similar to a hidden character hunt.
5. Hide different lilgotchi around the outdoor map and interiors. Some should be discovered through talking to people or completing small interactions.
6. Give each lilgotchi a distinct discovery condition, useful hints and saved found state.
7. Unlock found lilgotchi as selectable walking companions. Define how existing companion saves carry forward without losing discoveries.
8. Replace or adapt the current stamp progress display to make the hunt understandable, with clear progress and a completion reward.
9. Keep the project arcade usable alongside the hunt.

## Checks and delivery

1. Split the work into small related branches and PRs. Merge each separately.
2. Test behavior that can regress, especially path following, discoveries, saved progress and wildlife phases.
3. Look at the actual changed areas in a browser before pushing and attach screenshots to every PR.
4. Confirm the final deployment and live interactions after merging.
5. Keep existing sound behavior unchanged and do not add new sound yet.

## References

Arcade preview: C:\Users\dorse\.codex\generated_images\01a1dd08-c7e4-7f11-a6ca-dbb66c0a3daf\exec-110d3a0b-774f-4e65-ac0c-b278fc56aa08.png

House preview: C:\Users\dorse\.codex\generated_images\01a1dd08-c7e4-7f11-a6ca-dbb66c0a3daf\exec-e504ac3b-fa53-41b2-8ebc-12204baca37d.png

The preview layouts are accepted. Their style still needs matching. Neither preview is installed in the game.

Carousel history: https://www.missoulacarousel.org/building-a-community-dream-a-carousel-for-missoula/

Carousel speed: https://koa.com/campgrounds/missoula/local-area/attractions/

Brennan’s Wave: https://www.missouladowntown.com/caras-park/brennans-wave/

Runner’s Edge: https://runnersedgemt.com/

Basal: https://www.basalhospitality.com/

Shakespeare & Co.: https://www.shakespeareandco.com/

SBG: https://sbgmontana.com/

## November 20 delivery

1. PR 108 merged: approved arcade, house and rooftop backgrounds, matching collision areas, real poker table, pinball and named cabinets. Characters stay separate. Desktop and phone views checked.
2. Smooth walking: route smoothing preserves scenery clearance, clamps steps at turns and applies to residents and companions. Added full town return route coverage.
3. All other unfinished sections above remain open.
