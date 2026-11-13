# Get

Included in 2.0. Follow the [shared game rules](README.md).

Catch falling notes. Avoid poop. This is the objective in the [Connection manual](https://www.bandai.com/amfile/file/download/file/242/product/1304058/).

## Our version

Left and Right move the pet between three lanes. Use the arrow keys on a keyboard. Holding a direction moves with a capped repeat rate, never faster on a faster device.

Run for 30 seconds. A note gives one point. Missing a note costs no life. Catching poop costs one of three lives. Finish with at least 12 notes and a life left to win. Drops take about 1.67 seconds in the first ten seconds, 1.43 in the next ten and 1.25 in the last ten. These values need playtesting.

## Screen and art

Keep the pet at the bottom and the falling objects above it. Music notes have a filled head, stem and flag so they are distinct from poop. A hit triggers a brief happy or startled pose. The score, lives and remaining time go below the display.

Use a 32 by 40 field for every pet. The visible head sets the catch height. Leave enough vertical warning for the tallest sprite. Spawn only one object at a time in the first version. Never make a hazard unavoidable.

## Check it

Test lane boundaries, notes versus poop, missed notes, last life, timeout and pause during a fall. A single collision can score only once. Compare touch and keyboard play, and inspect the largest pets at full scale.
