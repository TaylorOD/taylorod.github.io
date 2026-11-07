# Away care and vacation

> Implemented design record. Requirements below describe the shipped implementation, not pending work. Hardware fidelity and external verification remain limited as recorded in the release review. See the [current status](../implementation-status.md) and [release review](../release-review.md).

## Implemented policy

lilgotchi simulates at most eight hours when returning after the page was absent. A closed drawer on an open page remains live. Time beyond eight hours is paused rather than counted as neglect. This is a deliberate casual companion policy, not original hardware behavior. Existing pets keep their saved identity, age, needs, and care history. No save key changes.

Vacation is an explicit per pet switch in Settings. It freezes care, growth, age, energy, health, care grade, attention clocks, and minigame activity until the player resumes it. Sleep remains separate and continues the normal simulation. There is no Pause when closed preference in this release.

## UI

Settings describes both the eight hour limit and Vacation. The switch exposes its state to assistive technology. While paused, the pet presentation shows a pause hint, care controls are unavailable, and their explanation directs the player to Settings. Stats, settings, sound preference, and save export remain available. Wall clock and scenery can reflect actual time while simulation and sprite motion remain frozen.

## Implementation

The optional saved `vacationAt` field uses zero for active and a positive timestamp for paused. Old saves lacking it remain active. Imports reject negative, nonfinite, and implausibly future pause timestamps. Opening a paused save skips catchup. Live ticks, random misbehavior, care actions, feeding, and minigame mutations return without changing the pet. Starting Vacation invalidates delayed minigame callbacks and clears transient reactions.

The `pets/away.js` helpers shift all relative simulation anchors together: stageStartTime, lastProcessed, lastHungerDecay, lastHappyDecay, lastPoopTime, lastAgeInc, snackWindowStart, attentionCallTime when nonnull, wellbeingUpdatedAt, and an active sleepOverrideUntil. Historical bornAt, numeric age, needs, identity, illness, doses, and care history remain unchanged.

On resume, shift anchors by the elapsed pause duration, clear vacationAt, save normally, and restart normal ticks. Repeated resume is a no op. If the system clock moved backward during Vacation, all relative anchors are rebased by the same signed offset. This preserves timer phases and immediately valid saves. Imports reject a vacation timestamp before the last processed time.

For a long active absence, shift these same anchors by the excess above eight hours before minute replay. This retains partial intervals while bounding work to 480 minute steps. The pet experiences only the most recent eight local clock hours. A return toast explains the cap when applied. Existing ownership, revision, and quota protections remain authoritative.

## Verification

Tests cover anchor preservation, birthday preservation, timer fractions, eight hour limit, freeze across every care action, no misbehavior or minigame mutation, long vacation resume, paused save reload, and old saves loading active. Chrome verification covered Vacation on, reload, paused hints and controls, and resume with preserved needs. Pasted import passed separately. Native file picker and physical device verification remain open in the release review.
