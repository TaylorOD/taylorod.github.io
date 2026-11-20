# Character frame contract

Frames are complete rectangular arrays of palette indices. Zero is transparent. Default keeps its original matrices. Custom families must supply their own egg and every character identity, with `idle1`, `idle2`, `happy`, `sad` and `eat` for each body. The egg uses both idle keys. Composed reactions reuse a complete body with the shared effects.

## Size and anchor

Keep each body's frames on the same padded canvas, at most 16 columns by 12 rows. Its shared foot anchor is the bottom row at `floor(width / 2)`. Use the same padding and anchor for every reaction so changing expression does not move the feet. Author movement inside that full canvas. Never shift by slicing off an edge column.

Eggs may use at most 16 columns by 10 rows. Their preferred position is horizontally centered at y 2. The hatch bar reserves x 6 through 25 and y 12 through 14. The EGG label and countdown live below the screen.

The 16 by 12 body allocation has a dedicated test with four waste piles, sickness and attention visible together. If new artwork exceeds it, redesign the artwork instead of weakening the check. Antennae, hats, cables, toppings and feet are all part of the body allocation.

## Layout interface

`frameInfo(pixels)` in `pets/layout.js` derives width, height, opaque bounds, pixel count and anchor. It validates shape and palette index values and caches metadata by matrix identity. Treat finished matrices as immutable. Create a new matrix when changing art.

`placeFrame(pixels, x, y, occupied, area)` keeps the preferred integer placement when it fits. Otherwise it finds the nearest placement whose opaque rectangle fits the screen and avoids occupied rectangles. It never changes the frame data. An impossible composition throws instead of silently cropping.

`drawScene(renderer, items, occupied)` places complete bodies first, then effects. Each item contains `name`, `pixels`, `x` and `y`. An optional `area` narrows its allowed rectangle. Blank evolution flashes use an empty item list, never an all zero frame.

`renderer.lastComposition` records the final rectangles and matrices. `renderer.rejectedPixels` records any rejected opaque writes with family, frame name and coordinates. Set `strictBounds` in tests to fail on the first rejected pixel. The final drawing guard remains active in production.

Authored idle frames combine with bounded whole pixel sway, breathing, bounce and landing. Pixel tilt preserves the sprite cells rather than rotating a smooth image. Placement still contains the complete composition. Motion respects reduced motion, E ink, busy scenes and Vacation. Any future wandering path must use the union of all frame bounds and pass the full position sweep tests.

## Pixel display

The logical display remains 32 by 16. `pixelSize` chooses whole device pixels that fit the available width and caps the scale at the original native size. Canvas backing dimensions and displayed dimensions account for device pixel ratio, including fractional browser zoom. The screen stays centered instead of stretching to a fractional pixel scale.

The guessing game canvas uses the complete frame's dimensions at its original scale of four. It validates the matrix before drawing.

## Review and checks

`npm test` checks all families through every identity, 90 animation frame positions and 15 reactions. The combined fixture includes maximum waste, sickness and attention. Tests compare every intended opaque body pixel with the rendered buffer and reject overlapping composition rectangles.

Open `/qa/`, choose a family, identity and reaction, and select Animate fork for a live animation loop at frozen game time. The original reference stays frozen. No QA view saves or makes network requests. Use the combined reaction and egg to inspect the tightest layouts on desktop and phone.
