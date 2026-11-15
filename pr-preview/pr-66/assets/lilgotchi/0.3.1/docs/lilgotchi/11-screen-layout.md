# Compact care layout

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

The LCD belongs to the pet. Clock, identity, stage, care grade and numeric needs stay outside its pixels. A small clock sits above the screen inside the egg. The current name and stage sit below the egg on a flat care panel, followed by a two column grid for Food, Happy, Energy and Health. All four compact meters use percentages. Food and Happy retain their original four point scale in Stats.

Three primary buttons are Feed, Play and contextual care. Care chooses Clean when waste is present, otherwise Wake for a sleeping pet or Sleep for an awake pet. Medicine and discipline remain explicit choices in More care, alongside Stats, Light and Sound. A persistent plain language care hint explains illness, hunger, sleep, eggs and discipline. Hidden secondary controls remain reachable by keyboard.

The starting preset is distinct from the current evolved identity. Reset and death actions name the selected preset and say Start again, because not every preset starts as an egg. Grade describes recent cumulative care, not a promise about evolution or original hardware rules. New pets show Getting started until enough care time has been sampled.

Use one monochrome icon language, legible labels, generous touch targets, visible focus, and readable disabled states across families. Preserve the egg silhouette while placing help and secondary details in a separate flat area below it. No data is painted over the pet. Canvas corners remain square within a padded rounded bezel so CSS cannot clip sprite pixels.

Validation includes every family, eggs and adults, illness, sleep, death, secondary controls, keyboard navigation, phone widths, zoom, and safe saved state migration. Hardware parity remains a regression reference, not a claim of firmware accuracy.
