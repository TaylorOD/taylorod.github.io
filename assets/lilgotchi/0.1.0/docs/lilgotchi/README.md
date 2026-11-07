# lilgotchi design

lilgotchi is a small virtual pet widget that anyone can add to a website. It keeps the original clone's game and default artwork, adds complete Slice and Cyberpunk families, and fits inside a polished slide out panel.

These are implementation specs. The current pocket pet code does not meet them yet. Character names below are proposed names. The product name, three included families, dough egg, full stage coverage and no clipping are requirements.

## Separate changes

| Doc | What it covers |
| --- | --- |
| [Embeddable widget](01-embeddable-widget.md) | Install, public API, packaging, isolation and multiple instances |
| [Original clone parity](02-original-clone-parity.md) | Exact source baseline, gameplay, default pixels and differences |
| [Default character family](03-default-character-family.md) | Original egg, every evolution and every reaction |
| [Slice character family](04-slice-character-family.md) | Dough egg, growing slice and distinct adult forms |
| [Cyberpunk character family](05-cyberpunk-character-family.md) | Binary egg, boot sequence and distinct adult forms |
| [Animation and screen bounds](06-animation-and-screen-bounds.md) | Complete frames, safe movement and effects that stay visible |
| [Widget polish and accessibility](07-widget-polish-and-accessibility.md) | Dark shell, responsive layout, controls, focus and motion |
| [Saves and site migration](08-saves-and-site-migration.md) | Portable saves, browser storage and replacing the personal site version |
| [Optional dialogue](09-optional-dialogue.md) | Restoring the clone's optional dialogue through a host adapter |

## What pixel for pixel means

Default mode matches the pinned original clone's screen, sprites, font, spacing, frame sequence and game controls at the same viewport and game state. The outer lilgotchi launcher and drawer are new. Slice and Cyberpunk change artwork and palette, while preserving the same rules and interaction sequence.

Fixing visible cropping is an intentional difference. Any other change to original behavior or appearance must be recorded in the parity doc. Matching this clone does not mean matching official Tamagotchi firmware.

## Build order

1. Capture the pinned original and turn its behavior and pixels into repeatable checks.
2. Separate the game from the personal site and implement the reusable widget and save adapter.
3. Restore default parity and fix frame placement without altering gameplay.
4. Build the full Slice family, then the full Cyberpunk family.
5. Finish the shell, accessibility and install examples.
6. Restore optional dialogue through the separate adapter.
7. Replace the personal site's widget using the same public install path other sites will use.

Keep each item on its own branch and PR. Include browser screenshots in every PR. Visual work must be viewed at desktop and phone sizes before pushing. Merge each PR separately after approval.

## Release gate

The widget is ready when a clean website can install the documented build, all three families pass the same gameplay checks, every required frame is complete and visible, and Default passes the original comparison with only documented exceptions. Reloading, closing, switching characters and upgrading must preserve progress. A desktop demo, phone demo and install example must all use the release build.

No implementation or release is implied by these docs.
