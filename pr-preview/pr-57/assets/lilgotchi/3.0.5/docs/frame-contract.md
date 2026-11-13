# Making sprites

The screen is 32 by 16 pixels. Keep the whole pet on it, including toppings, antennae and effects.

## Frames

Sprites are rectangular arrays of palette numbers. Zero is transparent. Freeze the finished arrays and rows.

Custom pets need an egg and all 11 character identities. Eggs use `idle1` and `idle2`. Hatched pets also need `happy`, `sad`, `eat`, `sleep`, `lookLeft`, `lookRight` and `lookUp`.

Use a consistent canvas and foot position across expressions. Custom frames can vary by character. Slice uses up to 12 by 14 pixels, Cypunk up to 14 by 15, and Lilgotchi up to 14 by 14. Custom eggs are 12 by 10. Keep shared care effects visible too. Quail Egg stays intentionally small at eight visible pixels tall.

The Gen 1 and Gen 2 source bodies may use up to 16 by 16 pixels. Keep their original pixels intact. Their full care scenes are covered by the same collision and clipping checks. The custom families have their own proportions rather than matching every original character in height.

Never crop a row or column to make movement fit.

## Placement

`frameInfo()` in `pets/layout.js` finds visible bounds. `placeFrame()` chooses the nearest safe position. `drawScene()` places the body and effects without overlaps.

Keep positions on whole pixels. The hatch bar uses rows 12 through 14, so eggs stay above it. Clock, meters and labels belong outside the pet canvas.

## Check it

Run `npm test`. The bounds tests check every pet, expression and reaction, including a screen full of waste, sickness and attention marks.

Then open `/qa/` and `/design/evolution/` in the browser. Look at the animation on desktop and mobile. Passing bounds tests doesn’t replace looking at the artwork.

## Guessing game poses

Every hatched character provides `lookLeft` and `lookRight`. Directions use the viewer's point of view. The face turns without flipping markings or moving the whole sprite. The character frames fit within 16 by 16 pixels and work with reduced motion.

## Game fields

Games draw the full current pet and its expression frames. The compact 8 by 6 drawings in `pets/arcade-sprites.js` remain fallback art, not the normal game characters.

All fields are 32 pixels wide. Get and Heading use 40 rows so even tall pets leave room for falling objects. Sprint uses 34 rows, with two 16 pixel lanes and a gap. Other games use 24 rows.

Heading uses `headingPose()` for both drawing and head contact. Get places the catch point at the visible top of the pet and accounts for the falling object's height. Keep these calculations together when changing art.

The guessing game centers full poses in a 32 by 24 field at eight screen pixels per sprite pixel. Other previews use a default scale of four. Canvas proportions follow the field dimensions.
