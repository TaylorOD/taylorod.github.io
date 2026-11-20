# Memory

Included in 2.0. Follow the [shared game rules](README.md).

Watch arrows and repeat their order. The [Connection manual](https://tamagotchi-official.com/manual/toy/connection/connection_web_manual_IS_EN.pdf) uses left, up and right.

## Our version

Show a sequence, then let the player repeat it with Left, Up and Right. Match those directions on the keyboard. Start with two arrows and add one each round. Complete five rounds to win. One wrong answer ends the run. No timer during the player's response.

Show each cue for 600 ms with a 200 ms gap. Identical consecutive arrows still get a clear gap. Slower playback uses one second cues and 350 ms gaps. Select it before Start. The sequence stays fixed for the run.

## Screen and art

The pet watches during playback and reacts to the player's answer. Put one large arrow at a time in a cue area above the display, with Watch or Your turn beside it. Do not cover the pet with the whole sequence. Put progress below the display.

Directional labels and short tones are paired with the arrows. Announce each playback cue, then announce when input opens. Reduced motion uses static arrows with no flashing or bouncing.

## Check it

Ignore guesses during playback and ignore held key repeats. Test repeated directions, wrong answers, the fifth round and pause in both phases. Resuming interrupted playback restarts that sequence without changing it. Exiting cancels every queued cue.
