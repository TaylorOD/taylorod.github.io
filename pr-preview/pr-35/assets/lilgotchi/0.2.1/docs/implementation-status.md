# Implementation status

## Current release

The public GitHub release includes a built zip and npm installable tarball. The landing configurator generates a versioned one script hosted embed. The source, package and release include MIT terms and the upstream notice. An npm registry listing still needs an authorized login.

The game update is deployed on the personal site using its 0.1.0 asset copy. The standalone demo and hosted loader include the newer packaging changes. See [installation](install.md) for the current download and snippet.

The standalone widget, all original starting characters, complete Slice and Cypunk lifecycles, local saves, curated installs and personal site integration are implemented. Original sprites remain intact. This is an adapted pixel game, not verified hardware emulation.

The landing page features Original egg, Slice and Cypunk with a dropdown for the other originals. Eggs hatch in 90 seconds. Newly hatched pets need food and play. Later evolution preserves existing needs. New illnesses can require one through three doses.

Clock, time icon, scenery, stage, care grade and four numeric meters are implemented. Information and growth notices sit outside the pet canvas. Three primary controls retain secondary actions in More care. Lighting and sleep are separate. Integer sway, breathing, bounce, tilt and landing respect reduced motion, E ink, busy scenes and Vacation.

Vacation freezes care and growth until resumed, including across reloads. When the page was absent, catch up is limited to eight hours. After a pet is opened, closing its drawer keeps its live simulation active while this page remains open, with rendering and sound suppressed. The launcher distinguishes live care from last saved care. Browsers may throttle inactive tabs.

The care walkthrough explains food, play, medicine, discipline, growth, sleep, energy, advisory health and care grades. Memorials retain twelve past lifetimes per starting character locally. Import supports files or pasted save text, validates before confirmation, preserves a recovery copy and remembers an overwritten dead pet. Exports remain portable active pet saves; history stays on the original website.

AI dialogue has been removed entirely from the runtime, public API, settings and examples. The immutable archived upstream source remains a development reference only and is excluded from releases.

## Validation

The automated suite covers gameplay, source references, all family frames, no clipping, lifecycle callbacks, modal focus, vacation migration and clocks, import validation, ownership, history and storage failures. Browser evidence is in pr-screenshots. See [release review](release-review.md) for the current count, visual checks and explicit limits.

## Evidence and differences

See [hardware review](lilgotchi/16-hardware-review.md), [parity register](parity-status.md), and design documents 16 through 25. Earlier design documents describe original milestones and are superseded where these current documents differ. The earlier source PRs and personal site integration have merged. The first named built release replaces the moving demo download.

## External verification

Physical iPhone and Android testing, a human screen reader session and human audio listening remain unverified unless explicitly recorded in the release review. Browser emulation and automated tests do not establish these results. Exact undocumented hardware timing and evolution thresholds remain unknown rather than guessed.
