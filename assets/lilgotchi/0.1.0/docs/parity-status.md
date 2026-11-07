# Parity status

Default now uses the complete pinned original stylesheet, original sprite matrices, pixel font, control order, palette, E ink setting and sound cues. Its raster colors also match the original with the lights off. The dark outer widget remains separate.

Controlled tests compare care actions and refusals, snack sickness, attention mistakes, random misbehavior, hatching, evolution, adult mortality, secret evolution and all five rounds of winning and losing games. The screen comparison covers all 12 character identities, 12 reactions and six frame positions. Raster tests check exact paint colors and rectangles in both themes and light states. Sound tests compare frequency, duration and volume arguments for all 13 cues.

These checks use a fixed clock and random sequence. They do not prove hardware parity or erase the intentional differences below.

## Intentional differences

| Area | Original | lilgotchi | Reason and evidence |
| --- | --- | --- | --- |
| Widget lifecycle | Full page game keeps running | Closing removes the game frame after saving | Reusable embed and inactive resource cleanup. Widget tests and browser review |
| Storage | One `tama_save` key in the game origin | Host owned validated saves per instance and family | Independent pets, separate origin embeds and recovery. Storage tests |
| Sound default | Sound enabled initially | Sound begins muted, with the player's host preference restored | Avoid unsolicited embed audio. Cue values remain unchanged |
| Offline processing | Bulk deductions, at most three added care mistakes, no egg catch up, timestamps reset on every resume | Minute replay capped at 25 days, including egg and sleep processing | Preserve progress and partial intervals across frequent drawer opens. Explicit comparison and game tests |
| Offline randomness | No tick based random sickness or secret evolution replay | Approximate minute sickness probability and sparse random checks | Replay is approximate, not an identical simulation of every second |
| Age clock | Advances only in awake ticks and resets its timestamp to now | Advances before the sleep return and retains day remainders | Sleep should not stop age. Existing overnight tests |
| Wake clocks | Hunger, happiness and waste can immediately decay after waking because their timestamps include sleep | Their timestamps restart on waking | Prevent sleep time draining needs. Sleep tests |
| Save timing | Periodic and visibility saves | Additional saves after actions and before closing | Prevent lost progress between short visits |
| Game cancellation | Delayed callbacks can affect another game | Callbacks check the active game identity | Avoid stale game results after closing or restarting. Regression test |
| Accessibility | Some controls are divs and disabled state is only a CSS class | Native buttons, disabled attributes, keyboard support and a text status | Accessible interaction with the same action outcomes |
| Motion | Always advances animation | Honors reduced motion and hidden pages | Accessible and inactive rendering behavior |
| Frame layout | Full viewport centering and a device up to 380 pixels wide | Embedded mode top aligns the device and fits the frame width | Fits the drawer. `embed.css` contains these overrides, while `game.css` stays identical to the source |

| Screen HUD | EGG text begins at y 14, hunger hearts extend below the screen and hearts overlap the body | EGG countdown and labeled needs appear below the LCD | Explicit clipping exception. Screen comparisons omit only the old EGG and heart draw operations, while body and effect buffers stay exact |
| Display scale | Canvas stretches to the frame width | Whole device pixel cells fit inside the frame without stretching | Crisp rendering at phone sizes and browser zoom. Logical resolution and original raster colors stay unchanged |

| Dialogue configuration | Raw local provider key | Host callback and saved player opt in | Credentials stay on the host server. Validated minimal context and cancellation tests |
| Dialogue presentation | Fixed bubble with silent failures | Flowing bubble, thinking and retry states, reduced motion | Fits the frame and exposes retryable failures without blocking care |

## Remaining differences

| Area | Work remaining |
| --- | --- |
| Original clipping | Corrected. EGG and needs are readable below the LCD. Complete bodies and effects remain on the 32 by 16 display |
| Custom families | Slice and Cyberpunk provide all 12 identities and complete reaction frames. Original identity keys, evolution rules and shared effects remain unchanged |
| Dialogue | Optional host callback and original triggers are implemented. Browser review passed. A separately configured live provider check remains |

## Review surface

Open `/qa/` locally to compare the pinned source with the fork at the same character, reaction, frame and theme. It covers every original identity and the main overlays. The original file remains untouched. The QA view freezes the clock, disables interval processing and saves, and disables provider calls. QA files are excluded from the widget distribution.

Parent browser review confirmed idle, lights off and stats layouts against the source and inspected the actual drawer in both themes. Desktop and phone screenshots are included under `pr-screenshots/default-*`.

Do not change the reference file or weaken pixel checks to hide an unexpected difference. For a justified bounds fix, retain source comparisons and add a narrow documented exception with a zero clipping test.

