# missoula review

reviewed november 20, 2026

## the requests so far

| request | current result | checked with |
| --- | --- | --- |
| recognizable downtown with taller Wilma and more buildings | Wilma, university approach, connected storefront block and arcade annex | browser |
| Last Best Arcade, Runner's Edge, Basal, Shakespeare and SBG | signs and place dialogs are present, shop dialogs include websites | browser and source |
| paths on both banks, grass buffer, bridge and carousel access | connected paths with a paved approach to the carousel | walked from the house to the carousel and back toward the arcade, route tests |
| remove town map and old 8 bit branding | no town map control, dedicated 8 bit missoula page | browser and source |
| unique bald player without a hat | bald player with beard, different neighbor appearances | browser |
| neighbor hair and poses | rear hair coverage fixed, pinball hands at controls, poker player behind table | browser |
| people can pass through the player | player does not block neighbor routes | automated test |
| keep the existing tree style and fading | painted woodland tree masks and existing river trees retained | browser and depth tests |
| Scout and squirrel chase | faster movement, changing squirrel direction, six chase trees, squirrel climbs, Scout jumps and sometimes woofs | browser and chase tests |
| Scout has a nub tail | short tail in the sprite | source and browser |
| elk sometimes flee without crossing buildings | intermittent flight, tree ordering and building masks | browser and full route tests |
| joggers and varied dogs with walkers | visitors on both banks with gaps between runners and sniffing pauses | browser and route tests |
| fly fishing, Brennan's Wave, surfer and raft | casting and drifting line, fixed wave and downstream raft | browser and river tests |
| day and night | six minute outdoor cycle, lamps and stars, neighbors go home and return | timed browser passes and daylight tests |
| cozy music and woofs | optional sound toggle, scheduled music and nearby woofs | source and scheduling tests, not an audio listening check |
| house desk and mountain | five screens, gaming pc, L in the window and behind the house | browser |
| arcade games and poker table | project names retained, three pinballs, poker plaque built into the table | browser |
| roof access inside | spiral stairs use the pizza unlock and return to their downstairs landing | completed delivery and walked both ways in browser |
| find the lilgotchi | four discoveries, hints and saved collection | pizza and bookshelf discoveries in browser, all discovery rules tested |
| old portfolio repository | earlier deletion completed, repository lookup no longer resolves | current GitHub lookup |

## issues found in this pass

1. night lights had stacked rectangular halos. replaced them with small pixel falloffs.
2. nearby labels covered storefronts and the poker table. kept the bottom action button and show object labels only on hover.
3. the daytime overlay had a hard horizontal edge. removed that overlay.
4. a raft crossed the surfer's silhouette. reduced its size and moved it into a separate downstream lane.
5. shorter desktop windows cropped room tops. interior scaling now fits the available height.
6. the sky blend briefly showed both the painted and moving sun near the end of a day. the animated sky now fully covers the painted sky.
7. a resting neighbor sat too high above the bench. lowered the resting pose to match the seated neighbor.

## scope of the review

the first timed pass covered sunset, blue hour, night, dawn, daytime and the return to sunset at normal speed. observations were periodic screenshots across the full cycle, not a frame by frame video review. the second pass repeats the cycle after the fixes.

this is a checked result, not a promise that every possible screen size and animation frame is perfect. phone checks use a 390 by 844 browser viewport, not a physical phone.

the carousel dialog gives its opening date, ring catching and speed with source links. it does not repeat the unverified oldest carousel claim.

the latest arcade followup is separate work: align the new pinball with the row, extend the stairs through the ceiling and replace the pizza table with a coin counter.
