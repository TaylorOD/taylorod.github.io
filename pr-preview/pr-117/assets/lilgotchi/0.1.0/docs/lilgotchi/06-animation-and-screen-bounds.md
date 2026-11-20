# lilgotchi animation and screen bounds

Every visible character pixel must stay on the logical screen. Movement must translate a complete character instead of deleting part of its artwork.

## Current failure paths

In `pets/skins.js`, the second idle frame is built with `[0, ...row.slice(0, -1)]`. This shifts pixels inside a fixed width row and drops its final column. Replace this generated frame with complete authored data or translate the intact sprite during placement.

`pets/renderer.js` ignores writes outside the 32 by 16 buffer. That is a useful final guard, but it hides bad placement. The current controller also uses fixed positions for bodies and effects. A correct fix needs both complete frame data and bounds aware composition.

## Coordinate contract

The display has integer coordinates from x 0 through 31 and y 0 through 15. Each frame declares its width, height, opaque pixel bounds and anchor. Use a shared foot anchor across a character's frames so expressions do not jump vertically.

For a body with local opaque bounds `left`, `right`, `top`, `bottom`, its translation must satisfy:

```text
x >= safeLeft - left
x <= safeRight - right
y >= safeTop - top
y <= safeBottom - bottom
```

Clamp the requested translation before drawing. Evaluate the whole animation's largest bounds when planning a movement path, then verify each rendered frame. Never clamp by cutting rows or columns.

Default first uses the original positions. Where those positions clip, choose the smallest translation that contains the complete composition and record the difference. Custom art should target a one logical pixel outer margin where space allows. The absolute requirement is that all intended pixels remain inside the display.

## Compose before drawing

Calculate bounds for the body and attached effects together. Food, refusal marks, sleep symbols and other reaction effects need their own placement rectangles. Waste and status indicators retain reserved areas consistent with the original presentation.

If a composition cannot fit, try another approved effect position or remove decorative travel. Never hide a gameplay indicator, shrink the logical canvas, crop an accessory or overlap the face to make the bounds check pass. If it still cannot fit, the asset or layout needs redesign.

Apply this to idle, hatch, eating, refusal, sleep, sickness, scolding, evolution, game animations and death. The game overlay's separate canvas needs the same rules.

## Pixel rendering

Use integer logical coordinates and nearest neighbor display scaling. Keep the 32 by 16 logical resolution fixed. Scale the presentation by whole factors that fit the container. Do not use CSS transforms that land sprite pixels on fractional positions. Account for device pixel ratio when configuring canvas backing dimensions.

Keep the renderer's bounds guard in production. In development and tests, report each rejected opaque pixel with its family, stage, frame and requested position. A render that silently drops pixels must fail validation.

## Acceptance

1. Validate rectangular matrices, supported palette values, anchors and frame keys for every family.
2. Sweep every frame through its full motion path, including both extremes and every intermediate integer position.
3. Test compositions with maximum waste, sickness, attention and sleep indicators, plus all temporary reactions.
4. Assert zero rejected intended pixels and that the complete body remains visible.
5. Compare source and destination opaque pixel counts for translations so a truncated source frame cannot pass placement checks.
6. View full animation loops in a desktop drawer, a 320 pixel phone viewport and inline mode. Check browser zoom and common device scale factors.
7. Save contact sheets and screenshots of the tightest placements. Browser inspection is required even when numerical checks pass.
