# Implementation status

## Compact care update

Design documents 10 through 15 cover the additive care model, compact screen, scenery and motion, host polish, installation and integration. Clock and time icon sit above the pet display. Current identity, stage, four percentage meters, grade and actionable care hint sit below the egg. Three primary controls retain all secondary actions in More care. Family artwork stays complete inside a square canvas with a padded rounded bezel. Optional scanlines persist; E ink and reduced motion suppress decorative movement.

The host uses current saved artwork, an explicitly last saved care indicator, onboarding, return information and save confirmation. The landing page provides the install configurator and preview download without redundant install navigation. A clean source archive script produces a revision named distribution.

Browser integration checked original, Slice and Cyberpunk, desktop and narrow phone layouts, busy care scenes, food percentages, manual sleep across reload, Stats, secondary care, E ink and exported saves. The actual import file picker remains blocked by the Chrome extension's disabled file URL access. Validation and replacement remain covered by automated tests. Real phone hardware, human audio listening, a screen reader and a live dialogue provider remain external verification tasks. These limits are not implied complete by the automated suite.

Production PRs remain separate and await merge approval. The public demo is a built preview, not a merged production release. Historical stage counts below are retained as evidence of their original milestones.

Each stage gets its own branch and PR. Later branches may build on earlier work, but each PR must remain focused and be merged separately after approval.

| Stage | Status | Evidence and handoff |
| --- | --- | --- |
| 1. Standalone foundation | Implemented and browser checked | [PR 1](https://github.com/TaylorOD/lilgotchi/pull/1). Desktop and phone screenshots included |
| 2. Widget and storage | Implemented and initial browser checks passed | [PR 2](https://github.com/TaylorOD/lilgotchi/pull/2). Custom element, private channel, host saves, static build and three install examples |
| 3. Default parity | Implemented and browser checked | Original presentation and E ink restored. Controlled actions, screen buffers, raster colors and sound cues compared |
| 4. Bounds and animation | Implemented and browser checked | Complete frame placement, separate needs row, crisp sizing and exhaustive composition checks |
| 5. Slice family | Implemented and browser checked | Complete dough through secret adult artwork and labeled frame review |
| 6. Cyberpunk family | Implemented and browser checked | Complete binary seed through secret adult artwork and labeled frame review |
| 7. Shell polish | Implemented and browser checked | PR 7. Responsive, keyboard and accessibility checks with screenshots |
| 8. Dialogue adapter | Implemented and browser checked | Optional callback, original triggers, retry and cancellation checks with desktop and phone screenshots |
| 9. Integration and site migration | Implemented and browser checked | Opt in legacy migration, clean release build, copied install example and local personal site migration verified. Production rollout is separate |

## Foundation evidence

`npm test` passes 15 existing game tests and 5 new source baseline tests. The baseline compares all original constants, sprite matrices and font data, 126 adult branch input combinations, and all original sprite buffers at deterministic positions.

`npm run inventory` records 21 sprite entries from the pinned original. The source integrity test checks the preserved file against its recorded SHA256.

Foundation browser review passed and screenshots are included in PR 1. Test counts in the sections below describe each stage at its completion.

## Remaining release limits

Documented offline and embedding differences remain. Shell and dialogue browser reviews are complete. A configured live provider check remains pending. No live AI provider or personal site deployment is configured by this stage.

## Widget evidence

The parent browser review verified opening, character switching, persisted selection after reload, two independent inline games under hostile CSS, separate origin loading and saving, and a duplicate key showing a read only notice. Export downloaded a valid save envelope. Progress survived navigation and reload. The 320 pixel drawer is usable, with nested scrolling subsequently completed in shell polish. Browser file upload remains unverified because the Chrome extension disallows local file URLs.

Storage tests cover family isolation, writer ownership, stale revision rejection, expired leases, quota failure followed by further saves and reopen, blocked storage, preserved corrupt data and invalid imports. The build copies the static runtime and install examples without package dependencies.

## Default evidence

The Default task adds exact source CSS and restored settings, palette and lights off colors. Tests compare the original and fork under controlled time and randomness, including 864 logical screen compositions, both raster themes and all sound cues. The local `/qa/` page provides frozen source and fork views. Parent browser review confirmed idle, lights off and stats layouts against the source, inspected the phone layout, and checked E ink in the actual drawer. Screenshots are included. See `parity-status.md` for intentional behavior differences and completed bounds corrections.

## Bounds evidence

47 tests pass. The bounds suite covers every family and identity across 90 frame positions and 15 reactions, including combined maximum care indicators. Source sprite and raster comparisons remain strict. Only the clipped source HUD is intentionally relocated below the screen. See frame-contract.md for the art handoff. Parent inspected the animated combined scene at desktop and 320 pixel phone sizes, verified readable needs text and saved bounds screenshots.

## Slice evidence

48 tests pass and the static build succeeds. Slice supplies 68 frozen complete frames across all 12 original identities. The art contract checks unique silhouettes, both idle poses, palette validity and stable anchors. Existing full composition sweeps and source comparisons pass without changed expectations. All lifecycle IDs, evolution conditions and saves are preserved. The contact sheet at /qa/slice.html shows every matrix at native and six times scale. Parent browser review inspected all 12 identities and every contact sheet frame, animated dough, and Pizza Chef with combined care indicators at desktop and 390 pixel phone sizes. All passed visual review. Screenshots are saved under pr-screenshots/slice*.jpg.

## Cyberpunk evidence

51 tests pass and the static build succeeds. Cyberpunk supplies 68 frozen complete frames across all 12 original identities. Coverage checks distinct silhouettes and expressions, readable binary glyphs in both boot frames, unchanged reaction feet and complete palette entries. Existing full composition sweeps and Default source comparisons pass without changed expectations. The contact sheet at /qa/cyberpunk.html shows every frame at native and six times scale. Parent browser review inspected every identity and frame, readable Binary Seed, and Wire and Mainframe with combined care indicators at desktop and 390 pixel phone sizes. Five screenshots are saved under pr-screenshots/cyberpunk*.jpg. The final display labels were included in the completed shell polish review.



## Shell polish

The launcher uses actual family pixel art. A sticky drawer header, content sized frame and expandable save tools reduce clutter. Only the outer shell announces save status. Reset names the selected family. The demo introduces the playable pet and static install. 56 tests pass and the static build succeeds. Parent browser review checked Default, Slice, stats, Escape ordering, phone fit, reduced motion and landscape scrolling. It found and fixed page scroll locking and closed disclosure focus wrapping. Final keyboard review passed in both directions across the frame and collapsed save disclosure, and closing restores launcher focus. Desktop, launcher, phone and landscape screenshots are included. Import validation is tested, but browser upload remains unverified because local file access is blocked.

## Dialogue evidence

63 tests pass and the static build succeeds. Parent browser review checked the Default reply bubble, saved opt in after reload, failure and malformed reply states, successful retry and cancellation when a delayed Default reply was followed by a switch to Slice. The new egg stayed clear of the old reply. Phone review checked the Slice adult error panel. Screenshots are saved as `pr-screenshots/dialogue-desktop.jpg` and `pr-screenshots/dialogue-mobile.jpg`. No live provider or paid call was used.

## Integration evidence

72 tests pass and the static build succeeds. Migration tests cover absent sources, all family mappings, repeated copies, existing and damaged destinations, invalid identities, future clocks, quota retry, failed receipts and competing owners. The release check plants stale files, rebuilds, verifies their removal and checks local module and asset references. Source comparisons still pass with the documented timing, accessibility and HUD exceptions. The plain install page uses the built distribution. Parent browser review inspected Slice dough at desktop size and Cyberpunk Binary Seed at phone size on `/dist/examples/install.html`. Screenshots are `pr-screenshots/install-desktop.jpg` and `pr-screenshots/install-mobile.jpg`.

The personal site integration was also checked locally on home and projects at desktop and 390 pixel phone widths. A synthetic legacy pizza child with hunger 2 migrated successfully. Feeding raised hunger to 3, which survived navigation and reload. The original save remained at hunger 2 and the migration receipt existed. Screenshots are saved as `pr-screenshots/site-home-desktop.jpg`, `site-home-mobile.jpg`, `site-projects-desktop.jpg` and `site-projects-mobile.jpg`. This verifies the copied package and migration locally, not a production deployment. Browser file upload remains unverified because the Chrome extension disallows local file URLs.
