# lilgotchi widget polish and accessibility

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

The widget should feel like a small finished game. Use a dark outer shell that fits Taylor's site while keeping the original game presentation intact inside Default mode.

## Launcher and drawer

Use a small pixel character launcher, initially a slice on Taylor's site. Other installs can use the selected family icon. Give it an accessible name such as "Open lilgotchi" and a clear focus ring. Do not animate it constantly or play sound before interaction.

The drawer slides in from the selected bottom corner. Its header contains lilgotchi, a labeled character selector and a close button. Use the public labels Default, Slice and Cypunk. Keep save status and help available without covering the game screen.

Use a near black shell, slightly lighter controls, readable light text and one restrained accent. Do not spread host page styles into the original game. The original game controls belong inside the frame and keep their original arrangement. Avoid a second set of competing care buttons in the shell.

## Layout

Start with a 360 CSS pixel drawer, capped to the viewport minus 24 pixels. Respect phone safe areas. Fit the original game at a supported integer screen scale. On short screens, allow the drawer content to scroll while its close control remains reachable. The host page must never acquire horizontal overflow.

Support 320 pixel and 390 pixel phone viewports, desktop, landscape phones and 200 percent browser zoom. Test on an actual rendered page rather than relying on width measurements.

## Interaction

Opening moves focus to the drawer. A modal drawer makes the host page inert and keeps focus inside. Closing returns focus to the launcher. Escape closes the innermost game overlay first, then the drawer. Inline mode is not modal and does not trap focus.

Changing characters saves the current family before displaying the next. Show the selected family's real save or its own starting form. Do not briefly display the previous character. Closing during an animation or game round must follow one documented save rule and must not award a result twice.

Keep touch targets at least 44 CSS pixels where the shell controls allow. Give every game action an accessible name and keyboard activation. Provide a text status for stage, hunger, happiness, sickness and attention without announcing every animation frame.

Respect reduced motion by removing the drawer slide and decorative movement. Preserve visible state changes and game timing. Sound remains muted until enabled by the player. Distinguish sound state with text or an accessible label, not color alone.

## Empty and failure states

Loading shows a quiet progress state inside the drawer. A missing asset or failed load shows a retry action. Unavailable storage shows "Progress lasts for this visit". Invalid saved data offers recovery or a fresh start without silently deleting the original data.

Confirm reset and identify the family that will restart. A failed import leaves the current pet intact. Save errors never masquerade as a successful save.

## Acceptance

Inspect the launcher, open drawer, selector, each original overlay, loading, save failure and death at desktop and phone sizes. Run keyboard only navigation through opening, actions, switching and closing. Verify focus across the iframe boundary, readable contrast, reduced motion and screen reader status. Include screenshots of the actual changed areas in each visual PR.
