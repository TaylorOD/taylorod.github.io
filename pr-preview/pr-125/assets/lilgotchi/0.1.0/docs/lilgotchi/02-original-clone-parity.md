# lilgotchi original clone parity

This is the historical baseline specification. The requested care and presentation update intentionally replaces the exact visual contract with the compact layout in documents 10 through 15. AI dialogue is intentionally removed by the current product scope. The reference is a regression baseline, not proof of original hardware behavior.

Use [plateaukao/tamagochi at commit 74c7a45](https://github.com/plateaukao/tamagochi/tree/74c7a45c8ef03ac43a500db18d19b8fa7cd4ec62) as the source of truth. Preserve the complete commit ID in the source manifest and keep an untouched copy for comparison. Do not compare against a moving upstream branch.

The current game already adapts this source, but it changes the styles, storage, elapsed time handling and settings. It is not yet an exact visual replacement.

## Gameplay contract

Retain the clone's state transitions, timing constants, weight changes, hunger, happiness, discipline, waste, sickness, medicine doses, attention calls, scolding, sleep schedule, light behavior, aging, death, reset and five round guessing game. Preserve refusals and disabled actions as well as successful actions.

Retain the egg, baby, child, two teen paths, six adult outcomes and secret adult check. Preserve the order of evolution conditions. Skin selection never changes outcomes, timing or difficulty.

Run the untouched source and the fork with the same initial state, local time, elapsed time and random sequence. Compare state and visible results after each action. Use a controlled clock for long lifecycles. Do not alter production timers to make tests pass.

## Visual contract

The logical display is 32 by 16 pixels. The existing renderer uses an 8 pixel cell with a 7 pixel filled area. Capture the actual original renderer before treating these values as a complete visual specification.

Compare Default at the same viewport, browser scale, device scale, clock, random seed and animation frame. Cover the original palette, alternate E ink theme, pixel font, control order, labels, icons, overlays, stats, toast messages, sounds and frame cadence. Restore original inner game styling where the current dark overrides changed it. The outer drawer remains dark.

Use exact pixel comparison for the logical screen buffer and original sprite matrices. Compare browser captures separately for the inner screen and surrounding game UI. Any tolerance for browser text rendering must be explicit and cannot hide differences in sprite pixels.

## Differences to resolve

| Current difference | Target decision |
| --- | --- |
| Dark styles override the original game | Restore the original inner game appearance in Default. Keep the new dark outer shell |
| E ink setting was removed | Restore it for Default and verify against the original |
| Custom families share the original egg | Supply complete family specific artwork |
| Sound begins muted | Keep as an embed default. Preserve original sounds after enabling |
| Saves use new keys per family | Keep separate saves through the portable storage adapter |
| Closing removes the iframe | Keep this lifecycle change. Test save and resume equivalence |
| Offline time uses minute steps with a 25 day cap | Compare with the original and document exact differences before release. Do not call this identical behavior |
| Random events during offline replay are approximate | Use controlled random input for parity checks. Publish the chosen resume rules |
| Accessibility and keyboard handling were added | Keep them without changing action outcomes or visible default pixels |
| Some artwork can crop during motion | Fix placement and frame data. Record affected original frames as intentional visual differences |

