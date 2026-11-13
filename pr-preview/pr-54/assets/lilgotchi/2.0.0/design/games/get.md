# Get

Included in 2.0. Follow the [shared game rules](README.md).

Catch falling notes. Avoid poop. This is the objective in the [Connection manual](https://tamagotchi-official.com/manual/toy/connection/connection_web_manual_IS_EN.pdf).

## Our version

Left and Right move the pet between three lanes. Use the arrow keys on a keyboard. Holding a direction moves with a capped repeat rate, never faster on a faster device.

Run for 30 seconds. A note gives one point. Missing a note costs no life. Catching poop costs one of three lives. Finish with at least 12 notes and a life left to win. Falling speed increases in three gentle steps. These values need playtesting.

## Screen and art

Keep the pet at the bottom and the falling objects above it. Use small, distinct note and poop shapes. A hit triggers a brief happy or startled pose. The score, lives and remaining time go below the display.

Use the actual pet's bounds for lanes and spawn timing. Leave enough vertical warning for the tallest sprite. Spawn only one object at a time in the first version. Never make a hazard unavoidable. If 32 by 16 is too cramped, revise this layout before implementation rather than hiding part of the pet.

## Check it

Test lane boundaries, notes versus poop, missed notes, last life, timeout and pause during a fall. A single collision can score only once. Compare touch and keyboard play, and inspect the largest pets at full scale.
