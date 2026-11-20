# Sprint

Included in 2.0. Follow the [shared game rules](README.md).

The [Connection manual](https://tamagotchi-official.com/manual/toy/connection/connection_web_manual_IS_EN.pdf) describes repeated button presses to race toward the finish.

## Our version

Race a computer opponent over a short course. Tap Run or press Space to advance. Cap accepted taps so rapid hardware repeats do not create an advantage. Offer Hold to run as an equally effective option selected before Start.

Start with a three second countdown. The course has 30 steps. Accept at most two steps per second in either mode. The opponent finishes 18 seconds after the countdown, or 20 seconds in slower mode. Reach the finish before the opponent to win. Show a countdown and ignore early input. Use a fixed opponent pace for the selected difficulty.

## Screen and art

Draw compact running poses on two lanes. Put race progress below the display. Keep the screen still and move the runners, with a finish marker entering near the end. Reduced motion uses fewer pose changes and no scrolling scenery.

## Check it

Test touch, keyboard and hold mode against the same finish threshold. Pause must stop both runners. Check ties explicitly and award a tied finish as a win. Never require uncomfortable tapping speed to finish.

An early tap can queue one step at the next half second boundary. Extra taps cannot stack or beat steady running.
