# Making sprites

The screen is 32 by 16 pixels. Keep the whole pet on it, including toppings, antennae and effects.

## Frames

Sprites are rectangular arrays of palette numbers. Zero is transparent. Freeze the finished arrays and rows.

Custom pets need an egg and all 11 character identities. Eggs use `idle1` and `idle2`. Hatched pets also need `happy`, `sad`, `eat` and `sleep`.

Use a consistent canvas and foot position across expressions. Custom bodies are 12 by 12 pixels. Eggs are 12 by 10. The renderer allows bodies up to 16 by 12, but shared care effects need room too.

Never crop a row or column to make movement fit.

## Placement

`frameInfo()` in `pets/layout.js` finds visible bounds. `placeFrame()` chooses the nearest safe position. `drawScene()` places the body and effects without overlaps.

Keep positions on whole pixels. The hatch bar uses rows 12 through 14, so eggs stay above it. Clock, meters and labels belong outside the pet canvas.

## Check it

Run `npm test`. The bounds tests check every pet, expression and reaction, including a screen full of waste, sickness and attention marks.

Then open `/qa/` and `/design/evolution/` in the browser. Look at the animation on desktop and mobile. Passing bounds tests doesn’t replace looking at the artwork.

## Guessing game poses

Every hatched character provides `lookLeft` and `lookRight`. Directions use the viewer's point of view. The face turns without flipping markings or moving the whole sprite. These frames fit within the 16 by 16 game canvas and work with reduced motion.

## Small game portraits

`pets/arcade-sprites.js` has separate 8 by 6 portraits for every hatched identity. These use each family's existing palette. They are drawn for the playfield, not scaled down at runtime.

Get and Heading place the portrait at `x = center - 4`, `y = 10 - jump`. That leaves the top ten rows for falling objects. Keep collision coordinates aligned with those positions. `/qa/compact.html` shows all 44 portraits.
The guessing game draws its full poses at eight screen pixels per sprite pixel. Other previews keep the default scale of four. The pet gets a 128 by 128 area, with smaller arrow buttons beside it so the layout fits narrow screens.
