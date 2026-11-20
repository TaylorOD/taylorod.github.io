# Hoops

Included in 2.0. Follow the [shared game rules](README.md).

Time a shot into a basketball hoop, as described in the [Connection manual](https://www.bandai.com/amfile/file/download/file/242/product/1304058/).

## Our version

Shoot or Space stops an aim meter. Make the basket when the marker lands in its visible target. Play five shots and score three to win. Narrow the target slightly after each successful shot. Press Shoot once to start the meter, then again to take the shot. The meter travels out and back in 2.4 seconds, or four seconds in slower mode. The ball takes 900 ms to land. Target edges count as a hit.

## Screen and art

Pet on the left, hoop on the right, ball between them. Put the meter and shot count below the display. Keep the full current pet visible. A made shot crosses the rim from above, then drops through the net. Early shots fall short and late shots go past the rim. Keep misses inside the canvas too.

## Check it

The ball animation must agree with the meter result. Test target boundaries, repeated inputs, pause during aiming and pause during the ball arc. Do not award a basket twice when resuming. Reduced motion can show the release and landing poses without a full arc.
