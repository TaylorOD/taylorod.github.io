# Reference review

The original source link is credit for an adapted implementation, not a working demo or a guarantee of correct behavior. The archived HTML is kept unchanged for regression comparisons. It is a development reference and is excluded from the public package.

Browser review on November 6, 2026 found that the local original still renders, but its hearts overlap the character and the bottom heart row is clipped. Transparent heart pixels also allow the character underneath to show through. This can make empty hearts look filled. Its open stats page does not refresh as needs change. lilgotchi keeps needs outside the LCD and refreshes open stats from the same state, with explicit numbers beside the hearts.

## Reference order

1. [Bandai original P1 instructions](https://www.bandai.com/amfile/file/download/file/3639/product/1309818/) establish the player facing rules. Filled hearts mean satisfied needs. The health meter is separate from the main pet screen.
2. [Tamagotchi P1 Web](https://github.com/tonypan2/tamagotchi-p1-web) uses TamaLIB to emulate device behavior. Use it as a behavioral comparison, not a source of redistributed ROMs or artwork.
3. [Retro Tamagotchi Clone](https://github.com/oosuhada/retro-tamagotchi-clone) provides a separate readable implementation of care and the five round game. It is another comparison, not an authority.
4. [The original adaptation source](https://github.com/plateaukao/tamagochi) documents where this project began.

No code or assets from the additional references were copied. Matching the first clone alone does not establish hardware accuracy. Existing comparisons remain regression checks for deliberate behavior, with documented exceptions for bugs and usability.

## Sound

The game includes synthesized square wave sound cues for care, play, attention, hatching and death. Sound starts muted. The Sound control enables it and the preference persists. Audio is unlocked during a user interaction and a suspended context is resumed. These are clone sound cues, not verified recordings of original hardware.

## Further discrepancies

The source refilled needs during growth. lilgotchi now begins hatchling care with empty needs and preserves needs on later evolution. Exact firmware timing, character schedules, and evolution thresholds remain unverified. Agreement between clones is not hardware evidence. Existing saved needs remain unchanged.

## Evidence based care updates

The hardware review in [16-hardware-review.md](lilgotchi/16-hardware-review.md) distinguishes documented behavior from unknown firmware details. Newly hatched pets now need food and play and raise attention. Later evolution preserves needs instead of filling them automatically. Newly assigned illnesses can require one, two, or three medicine doses. Existing saves and assigned doses are not rewritten. The 90 second hatch is a deliberate user selected difference from the official approximate five minutes.

Away catchup is now capped at eight hours and Vacation explicitly pauses progression. These are lilgotchi convenience features. See [away care](lilgotchi/17-away-care.md).

