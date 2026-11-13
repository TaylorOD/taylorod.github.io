# Bump

Included in 2.0. Follow the [shared game rules](README.md).

Time a power meter to bump another pet over. The [Connection manual](https://www.bandai.com/amfile/file/download/file/242/product/1304058/) describes timing the press for maximum power.

## Our version

One Bump button stops a meter that moves up and down. Space does the same. Give a 1.5 second countdown before the meter starts. The meter times out after six seconds, losing that bout. Do not reward repeated tapping.

Play three bouts. Each has a clearly marked target region. Stopping inside it wins the bout. Win two bouts to win the run. The inclusive target ranges are 60 to 85, 63 to 82 and 66 to 79 on the 0 to 100 meter. This is a timing challenge with no hidden random loss after a successful stop.

## Screen and art

Show the current pet and a local computer opponent facing each other. Put the meter, target marker and bout score below the display. Stop the meter, hold the result, then animate the bump. The loser lands safely inside the screen and gets back up.

Two full size elders may not fit side by side in 32 pixels. Give this game purpose drawn compact poses, at most 12 pixels wide per pet, with room between them. Keep identity and expression. Do not squash runtime sprites to make them fit. No networking or second saved pet is needed.

## Check it

Test target edges, early presses, repeated taps, timeout and pause while the meter moves. Input timing must be based on elapsed time, not frame count. With reduced motion, use a short pose change instead of a fall. Verify both opponents remain visible.

Slower pace doubles the meter cycle to 3.2 seconds. The target regions and six second timeout stay the same.
