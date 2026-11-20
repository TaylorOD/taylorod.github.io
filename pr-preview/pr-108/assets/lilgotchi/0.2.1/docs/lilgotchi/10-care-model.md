# Care model and contextual sleep

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

## Intent

Add readable energy and health percentages and a persistent care quality grade without rewriting the original evolution tree. These are lilgotchi companion metrics, not claims about original hardware. Food and happiness remain the original 0 to 4 values and can be displayed as percentages.

Three Pet computes a care average from four meters, has independent energy and health, and supports manual sleep. Its implementation was inspected as a reference only. No source was copied. Source: https://github.com/ocinpp/three-pet/blob/master/src/stores/petStore.ts

## Rules

Energy starts at 100, decreases 5 points per awake hour, and recovers 20 per sleeping hour. A successful play costs 5 points, and a successful meal restores 2. Health starts at 100 and decreases 8 per hour while sick or 4 per hour when food or happiness is empty or waste reaches three. Otherwise it recovers 4 per hour. A completed medicine cure adds 10. Both values stay between 0 and 100. Neither introduces an additional death condition or bypasses existing medicine requirements.

Care quality is the time weighted mean of food, happiness, energy, and health. Food and happiness convert to percentages. The grade is Getting started until ten minutes of non egg living time have been observed. Thresholds are Perfect 90, Good 75, Normal 50, and Bad below 50. Care grades do not alter the original evolution thresholds and should be labeled as recent accumulated care since installation of these metrics, not historical hardware care accuracy.

Manual sleep lasts up to two hours or until full energy after a minimum five minute rest. Manual waking suppresses the scheduled bedtime for two hours. At expiry, normal character schedules resume. Waking restarts hunger, happiness, and waste clocks. Eggs and dead pets cannot sleep manually or accrue metrics.

## Integration API

`initializeWellbeing(state, now)` adds missing fields. `advanceWellbeing(state, now)` is called at the beginning of every live or replay tick before overwriting lastProcessed and before changing sleeping state. Call it immediately before any care mutation. `applyWellbeingAction(state, action, now)` handles successful play, meal, or cured actions. Failed actions must not call it. `setManualSleep(state, sleeping, now)` applies explicit sleep or wake. `sleepDecision(state, scheduled, now)` replaces the schedule boolean in checkSleep. `careGrade(state)` returns label and optional rounded score.

State fields: energy, health, wellbeingUpdatedAt, careTotal, careDuration, sleepOverride, sleepOverrideUntil. They are additive to the existing saved schema. Old saves retain all original fields and begin new metrics at the last saved processing time. Elapsed offline care uses the same replay approximation as the existing game, starting from the last saved state. Earlier history is not invented. Existing save readers accept absent new fields and validate any supplied fields. Existing instance and family save keys do not change.

Offline updates use the same elapsed time functions during minute replay. Direct elapsed calls cap at 25 days, matching the existing catch up boundary. The integrator must clamp wellbeingUpdatedAt to the replay starting point for newer saves whose elapsed gap exceeds that cap. Sleep and needs transition boundaries use the existing minute replay resolution, so this is deterministic approximation rather than hardware fidelity.

## UI placement

Keep meters outside the pixel scene in a compact two by two row. Show the care grade with the stage badge outside the canvas. Explain that Health is wellbeing while medicine treats sickness. Put detailed rules and score in Stats or Help. Avoid adding another floating panel over the pet.

## Acceptance

Old saves load without losing progress. Duplicate ticks do not drain meters. Sleep recovers energy and waking preserves existing decay semantics. Failed feeding and play do not improve care. Grade is not instantly improved by repeated clicking. Reduced motion has no bearing on simulation. Test boundaries for eggs, death, manual overrides, and repeated timestamps.


