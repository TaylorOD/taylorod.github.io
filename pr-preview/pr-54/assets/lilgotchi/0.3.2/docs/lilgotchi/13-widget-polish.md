# Widget polish

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

The launcher should show the selected pet as it was last saved. It must not imply that a closed frame is simulating live needs.

The last saved only launcher described below was replaced by [live care](23-live-care.md). The shipped widget updates care after its first opening while the page remains open. Before first opening it still reports the last saved state.

## Historical behavior

Use saved character identity with its family palette. A small dot means that the last saved state needed care. Its accessible name and tooltip say last saved, and opening runs normal offline catch up. Death and eggs have distinct labels. Never mutate or advance a save just to draw the launcher.

Save success gets a brief visual pulse, with reduced motion honored. Keep the persistent plain text storage status. Explain local browser storage and export in Save and help. First visits get a dismissible short introduction outside the LCD. Dismissal persists per widget instance.

Import previews name the selected pet and describe replacement and recovery. Invalid files never unload a working pet. Existing lease, validation, migration and recovery semantics remain intact.

## Acceptance

Launcher identity changes after evolution saves, switching, import and closing. A save error cannot produce a success pulse. Keyboard focus and the narrow drawer remain usable. No browser permission prompt is added.

## Reference

Three Pet uses success feedback and unread notifications. These ideas are implemented independently. Its notification list is not copied, and a last saved care dot is not a background notification service.
