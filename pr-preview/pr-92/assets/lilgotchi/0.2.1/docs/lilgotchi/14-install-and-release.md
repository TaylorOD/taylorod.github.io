# Landing setup and release

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

The landing page is the install experience. Keep playable gallery and a compact configurator together. Detailed deployment instructions remain linked for advanced hosts.

## Configurator

Offer all characters or an explicit checkbox list, starting character, bottom corner or inline placement, and dark or light outer shell. Generate a complete escaped copyable snippet. Empty lists show a useful validation message and disable copying. Explain that appearance changes the outer widget, while each pet keeps its own game palette. Configuration changes do not erase demo saves.

Use stable relative asset paths in examples. The landing download points to the named built release. A release recipe creates a zip from dist and identifies its version and source commit. Do not invent a published version or stable tag before it exists.

## Acceptance

All and subset snippets validate through the actual catalog. Default choices stay inside the subset. Copy failures leave selectable code and a useful message. Labels, focus, contrast and 320 pixel layout remain usable. Remove redundant standalone install navigation but preserve examples in documentation. No account or service credential is needed.
