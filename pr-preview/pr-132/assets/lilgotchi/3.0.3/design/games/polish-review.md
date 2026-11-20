# Game polish review

The game screen is now 32 by 24 pixels. It draws the current pet's full sprite and colors. Opponents stay separate.

Finished games show Play again and Back to games. Input controls disappear after the result. Left and right uses the same screen shape and keeps an exit available. Mobile controls fit their columns.

Heading checks the visible upper head pixels and accounts for the head rising during a jump. Hoops crosses the rim from above and falls through a visible net. Memory shows cue and answer poses. Flag gives a preparation beat, a longer response window and an X for waiting. Sprint shows red, yellow and green lights.

254 tests pass. The build passes. Browser review used 390 and 320 pixel widths. It covered the picker, guessing result and replay, arcade replay, Memory cue and answer poses, raised flags, Sprint lights, a successful Heading contact and a made Hoops shot. Frozen review scenes use real game models with fixed time inputs. They are not full human playthroughs.

Physical phone and longer human balance checks still need doing. These changes are in review, not deployed.
