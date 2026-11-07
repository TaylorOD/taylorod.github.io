# Time, scenery and motion

Three Pet uses the local hour to choose morning from 06:00, afternoon from 11:00, evening from 16:00, and night from 19:00. lilgotchi independently implements these boundaries with a local clock and an accessible time label. No location permission is needed. The clock is informational and does not change character sleep schedules.

The display bezel uses restrained scenery gradients and the LCD background follows the time period. Family ink stays readable. Sleep darkens the scene. E ink retains a static high contrast display. An optional Scanlines switch adds a very faint decorative layer over the bezel and screen without consuming logical pixels. It starts off and persists as a host owned preference alongside sound and E ink.

Motion remains pixel art. A time based walking sway and one pixel breathing or reaction bounce use integer coordinates passed through the existing collision aware placement function. Frames remain complete, with no rotated or fractionally scaled raster pixels. Motion is disabled by reduced motion and E ink. Existing frame animations remain the reference mode for deterministic source comparisons. Falling and large rotations from Three Pet are intentionally not copied because a 32 by 16 LCD cannot support them without destroying silhouettes or hiding care indicators.

Source references: https://github.com/ocinpp/three-pet/blob/master/src/App.vue and https://github.com/ocinpp/three-pet/blob/master/src/components/PetScene.vue. This is an independent implementation, with no copied code or assets.
