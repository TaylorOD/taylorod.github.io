# Heading

Included in 2.0. Follow the [shared game rules](README.md).

Move under the ball and jump to head it back up. This follows the [Connection manual](https://www.bandai.com/amfile/file/download/file/242/product/1304058/).

## Our version

Use Left, Jump and Right below the display. Left and Right arrow keys move. Up or Space jumps. The pet can move while a jump is in progress, but cannot jump again until it lands.

A successful header adds one point and sends the ball upward. Ten headers win. Three missed balls end the run. After a miss, give a one second countdown before the next ball. Slightly increase speed after every third header. Cap the run at 45 seconds.

## Screen and art

Show a small ball, the pet and a ground line. Score and misses sit below the display. Contact follows the occupied pixels in the upper half of the current pet. A rising head can meet a falling ball between frames.

Use the full current pet in a 32 by 24 game field, with room for the ball and jump. Keep a bounded arc so the ball never clips at the top. New serves must be reachable from the pet's current position.

## Check it

Test edge headers, misses, movement during jumps, repeat input and pause midair. One contact gives one point. Collision results must match at slow and fast frame rates. Review jump timing on touch without requiring simultaneous tiny button presses.

Slower pace runs movement at 60% speed and allows 75 seconds. The countdown and jump slow down with the ball. Scoring stays the same.
