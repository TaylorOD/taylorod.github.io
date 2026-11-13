# Games release checklist

## Release order

1. 1.2.1 fixes looking left and right in the guessing game. Keep its rules and rewards.
2. 2.0 adds Get, Bump, Heading, Memory, Flag, Sprint and Hoops, alongside the guessing game.

Taylor approved both releases on November 9, 2026. Merge the patch first, then release 2.0.

## Review each game

Check the instructions, controls, score, win, loss, quit and replay. Test the same timing with different frame sizes. Repeated input cannot score twice. A finished or abandoned run cannot change a later run.

Look at all five families, from baby through elder. Direction changes must be visible. Keep the whole pet, ball, opponent and effects inside the display. Use the full current pet, with enough room for the game around it.

Check touch and keyboard controls on mobile and desktop. Keep buttons large. Show sound cues visually. Check reduced motion, focus, spoken instructions and paused playback.

## Shared behavior

A new run charges energy once. A win gives at most one happiness heart. A loss or quit gives none. Keep the guessing game's existing rules in its patch.

Closing the drawer or hiding the page pauses a new game. Returning offers Resume or Quit. Changing family, death or Vacation cancels it. Reloading does not restore unfinished games. No hidden timers, surprise losses or rewards after leaving.

Eggs, sleeping, sick, dead, hungry and vacation pets follow the existing play restrictions. The picker explains why play is unavailable.

## Evidence

Each implementation PR needs passing tests and screenshots of its actual changed screens. Timing games also need a short browser recording. Run the full suite and build after integration. Check the built package includes every game module.

Record remaining gaps honestly before calling 2.0 ready. The wider device catalog stays in the research backlog.

## 2.0 review

The integrated suite passes 233 tests. The build checks local imports and assets in the package. All 44 compact identities are tested across game scenes and both motion modes.

Mobile browser checks exercised all seven games through start, controls, pause and return. Desktop review covered the picker, Bump, Memory and Sprint. The final Sprint screenshot includes lane labels and steady running feedback.

Unverified checks: physical phone playtesting, human screen reader and sound checks, longer balance sessions and short timing recordings. Browser control checks do not prove every game feels balanced on a real phone. Taylor approved release with these gaps recorded.

## Followup checks

Ran 3,000 seeded model sessions with delayed observations and limited input rates. These are simulated players, not human playtests. Uneven Sprint taps exposed a dropped input problem. One buffered tap fixes it without beating the steady running speed cap. Bump and Heading now offer a slower pace.

Keyboard checks covered Tab, Shift Tab, arrow input, Escape, closing and reopening a paused round. Starting a game exposed a focus trap gap, now fixed and tested. Audio tests cover cue frequencies, duration, gain, mute, suspension, delayed notes and unavailable audio hardware.

No physical phone was connected. Audio listening and a human screen reader session remain unverified. The browser tools do not expose video recording. The timing simulations and screenshots are not substitutes for those checks.

## Current game polish

Check full pet art in each game field: 32 by 40 for Get and Heading, 32 by 34 for Sprint and 32 by 24 for the others, clear Flag waiting cues, Memory answer feedback and Hoops shots through the rim. Heading must contact the visible head rather than a generic box. Replay must start a fresh run and reward it only once.

The model checks cover every current pet sprite in Heading, moving head collisions, Flag timing, paused Memory answers and Hoops rim crossings. Desktop browser review covered the larger sprites in all eight rendered layouts, the corrected Sprint lanes inside the widget, the taller falling game fields, music notes and shifting Hoops targets. A full human playthrough with every species is still unverified. Do not treat model tests as a playtest.
