# 8 bit missoula todos

Updated November 20, 2026.

## Completed work

| Request | Delivered |
| --- | --- |
| Make the Wilma taller, add a real main street and keep the home road open | Town composition retained, with straightened rooflines in PR 106 |
| Last Best Arcade, real downtown storefront names and no town map | PRs 106, 107 and 110 |
| Keep Taylor unique and improve the people | PRs 105 and 114. Residents, students, runners, fishers and arcade patrons use the shared shaded character style |
| Keep the original type of trees and their fading behavior | PR 111. Detailed layered river trees fade around people and companions |
| Fewer benches with even construction | PR 118. Removed two extras and straightened the carousel bench |
| Smooth walking on tight paths | PR 109. Clear route segments replace small zigzags and movement stops exactly at turns |
| Both river walks, grass beside the upper path and a connected carousel plaza | Preserved. Automated routes cover both banks, the bridge, campus, home and carousel in both directions |
| Make the arcade and house match the town | PR 108. Approved backgrounds installed with matching collision areas and separate moving characters |
| Real poker table, better pinball and real project names | PR 108. Seven named cabinets and the Poker Seater table remain interactive |
| Rooftop preview and implementation | PR 108. Rooftop unlocks after the pizza delivery |
| Shared room palette and rooftop day and night cycle | PR 119. Green and cream interface throughout, with changing rooftop sky |
| Useful river popup | PR 110. Brennan’s Wave popup moved beside the wave |
| Carousel history, rings and speed | PR 110. Volunteer opening in 1995, brass ring reward and nearly 8 mph outer horses. No unsupported oldest claim |
| Runner’s Edge, Basal, Shakespeare Books and SBG Missoula links | PR 110. Reachable storefront popups with official websites |
| Brennan’s Wave with a surfer and passing rafters | PR 112. Animated whitewater and a raft that passes beneath the bridge |
| Actual fly fishing | PR 112. Rod, reel, backcast, forward loop and drifting fly |
| More dogs and occasional joggers | Six dog appearances from PR 105, with existing staggered visitor routes retained |
| Longer Scout chase with safe squirrels | PR 113. Thirty second chase, six tree destinations, visible climbing, jumping and barking animation, then a return home |
| Elk sometimes run away | PR 113. Occasional flight and return, not every chase |
| Safe animation startup | PR 116. First frame clock jitter cannot freeze Scout or the interiors |
| Separate 8 bit missoula project | PR 115. Dedicated /8-bit-missoula/ page and portfolio link, with old mode links redirected |
| Find the lilgotchi game | PR 117. Four distinct discoveries across the town, house, arcade and a neighbor interaction |
| Hints, saved collection and walking companions | PR 117. Found friends unlock as companions, old adopted pets and completed deliveries carry forward |
| Completion reward | PR 117. Missoula postcard with three poses and PNG download, including loading the roof before first use |
| Preserve the project arcade | Project dialogs, previews and demos remain available alongside the hunt |
| Cozy music and occasional Scout woofs | Added after the later sound request. Optional toggle retained. Scheduling tested, audio not listened to in this review |
| Faster Scout and squirrel, nub tail, changing direction and woodland clipping | Implemented with chase and depth tests, visually reviewed through the day cycle |
| Bald player, neighbor hair, passing through the player | PRs 126, 128, 133 and 134 |
| Five monitor desk, gaming pc and L through the window | PR 125 |
| Arcade poses, legs, patio removal and small poker plaque | PRs 127 and 132, with front furniture superseded by the coin counter |
| Arcade roof matches outside, wildlife stays behind buildings, header icon | PRs 129 through 131 |
| Spiral stairs to the roof | PR 135, extended through the ceiling in the latest layout followup |
| Aligned third pinball and coin counter | Latest layout followup, delivery interaction preserved, matching rooftop stair opening |
| Full day visual review | PR 136 fixes lamps, labels, sky, raft clearance, room sizing and bench pose. See the review below |

## Verification

1. 50 automated tests pass, including routes, scenery clearance, saved progress, discovery conditions, wildlife phases and reduced motion.
2. Actual browser checks covered desktop and phone layouts, the arcade, house and rooftop, all four discoveries, hints, companion selection, saved progress after reload and the postcard reward.
3. The carousel round trip was repeated after the town and movement changes. Both arrival and return to main street passed.
4. Each change has its own branch and PR with browser screenshots.
5. Final deployment passed. The live /8-bit-missoula/ page, bookstore link, collection and desktop and phone views were checked after merging.

Phone checks use a Chrome viewport. A physical iPhone touch check has not been performed.

## References

Carousel history: https://www.missoulacarousel.org/building-a-community-dream-a-carousel-for-missoula/

Carousel rings: https://www.missoulacarousel.org/visit/

Carousel speed: https://koa.com/campgrounds/missoula/local-area/attractions/

Brennan’s Wave: https://www.missouladowntown.com/caras-park/brennans-wave/

Runner’s Edge: https://runnersedgemt.com/

Basal: https://www.basalhospitality.com/

Shakespeare & Co.: https://www.shakespeareandco.com/

SBG Missoula: https://sbgmissoula.com/

## latest review

[Full request audit and review limits](docs/missoula-review.md). The latest check repeated the carousel route, house, arcade, stairs in both directions, desktop and phone layouts, and periodic observations across a full day cycle after fixes. Earlier collection and postcard checks above were not all repeated in this pass.

The coin counter is now an L shaped coins and beer bar at the front. The poker table is taller and sits partly behind the staircase. Updated walking areas keep the exit and every cabinet reachable.

Arcade people now share a larger indoor scale so the player, visitors and regulars fit the cabinets, pinball controls and poker seating. Walking clearance is wider, pinball poses and the poker crop were adjusted, and visitor destinations follow the current furniture layout.

Corrected the bar orientation to run up from the entrance and turn left. Lowered and widened the poker table, pushed the three pinballs against the left wall, and moved the regulars and walking areas to match.
