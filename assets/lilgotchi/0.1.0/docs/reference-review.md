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

The source fills needs at hatching and later evolution. The official instructions describe a newly hatched pet needing attention. Exact initial levels, timing, character schedules and evolution thresholds need separate evidence before claiming authentic hardware behavior. Do not treat another clone agreeing as proof, and do not silently change existing pets while reviewing these rules.
