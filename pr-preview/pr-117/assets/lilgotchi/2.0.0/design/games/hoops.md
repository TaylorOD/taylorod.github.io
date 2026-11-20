# Hoops

Included in 2.0. Follow the [shared game rules](README.md).

Time a shot into a basketball hoop, as described in the [Connection manual](https://tamagotchi-official.com/manual/toy/connection/connection_web_manual_IS_EN.pdf).

## Our version

Shoot or Space stops an aim meter. Make the basket when the marker lands in its visible target. Play five shots and score three to win. Narrow the target slightly after each successful shot. Each shot waits for Ready before starting the meter. The meter travels out and back in 2.4 seconds, or four seconds in slower mode. The ball takes 900 ms to land. Target edges count as a hit.

## Screen and art

Pet on the left, hoop on the right, ball between them. Put the meter and shot count below the display. Show holding, shooting and celebration poses. Use a compact pet pose if needed to leave a visible ball arc. Keep misses inside the canvas too.

## Check it

The ball animation must agree with the meter result. Test target boundaries, repeated inputs, pause during aiming and pause during the ball arc. Do not award a basket twice when resuming. Reduced motion can show the release and landing poses without a full arc.
