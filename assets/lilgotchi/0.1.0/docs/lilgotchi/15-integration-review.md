# Integration and release review

## Scope

This pass adds the requested clock, scenery, stage and care labels, four meters, contextual controls, motion and screen texture. It also completes the actionable polish review. The newer design supersedes exact upstream presentation while retaining the sprite matrices and documented core care rules.

## Space budget

The 32 by 16 game display belongs to the pet and its effects. No clock, grade, numeric meters or control labels may cover it. Put time and identity above the display, meters below it and three primary controls below those. Secondary actions belong in an accessible disclosure or dialog. The host handles scrolling on short screens. Never shrink text to make everything fit.

## Agent handoffs

1. Care model: additive saved wellbeing, migration, manual sleep and care scoring. See 10-care-model.md.
2. Game interface: clock, identity, controls and explanations. See 11-screen-layout.md.
3. Presentation: scenery, safe motion and optional scanlines. See 12-motion-and-scenery.md.
4. Host: current pet launcher, attention, storage feedback and recovery. See 13-widget-polish.md.
5. Landing and delivery: embed builder, focused installation and release instructions. See 14-install-and-release.md.
6. Integration owner: review all changes, run combined checks, inspect actual browser views and publish the built preview. Keep source changes in focused stacked PRs with screenshots.

## Acceptance

Validate old saves without resetting their age, identity or care history. Validate new values on import. Check manual sleep and automatic schedules together, including offline catch up. Food and happiness percentages must derive from the existing four heart values rather than create a second source of truth.

Check all three families at desktop, 390 and 320 pixel widths, short landscape and enlarged text. Open each secondary view, exercise keyboard focus, test reduced motion, mute, E ink, save reload, export and import, and restricted character configuration. Inspect busy scenes with waste and sickness so corners and animation cannot hide sprites.

Do not weaken original behavior tests to accept an accidental regression. Record deliberate differences in parity-status.md and test the replacement behavior. A passing test count does not prove hardware fidelity or usability.

## External checks

Actual iPhone and Android devices, human listening, and a real screen reader cannot be replaced by desktop emulation or mocks. Record these as unverified when unavailable. Existing merge approval still applies to production PRs.

## Reference research

Three Pet puts badges and meters over a 3D scene, uses local time buckets, contextual clean/sleep/wake, sampled care averages, and continuous model animation. lilgotchi adapts the ideas to a smaller pixel display without copying its code or importing its framework.

Sources: [interface](https://github.com/ocinpp/three-pet/blob/master/src/App.vue), [care rules](https://github.com/ocinpp/three-pet/blob/master/src/stores/petStore.ts), [scene](https://github.com/ocinpp/three-pet/blob/master/src/components/PetScene.vue). The reviewed repository has no license grant in its tree, README or package metadata.
