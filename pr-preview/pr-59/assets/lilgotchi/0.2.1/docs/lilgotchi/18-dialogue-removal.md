# Remove AI dialogue

> Implemented design record. Requirements below describe the shipped implementation, not pending work. Hardware fidelity and external verification remain limited as recorded in the release review. See the [current status](../implementation-status.md) and [release review](../release-review.md).

The current product scope removes AI personality dialogue entirely. This is an intentional difference from the archived source, not a missing integration or a release blocker.

Remove the host callback API, private request and reply messages, saved enablement preference handling, game event hooks, idle request timer, speech bubble, settings controls, adapter modules, fake reply example and server route example. No provider configuration, credential setup or live provider verification remains part of installing or releasing lilgotchi.

Existing pet saves and all care fields remain compatible. An old unused preference key may remain in browser storage, but the widget never reads or acts on it. It does not delete unrelated storage. Ordinary care hints, action feedback, sound, evolution, clock and save status remain local and deterministic.

The immutable upstream reference and inventory retain their historical contents. Tests still compare original care outcomes, sprites, timing boundaries, sound and raster data. The stylesheet comparison excludes only removed speech bubble selectors and their theme variables. Remove tests specific to the deleted feature and add a regression checking that runtime entry points and built examples do not expose it.

Validation requires the full test suite and a clean build. Review Settings and care actions in the browser to confirm that no unavailable personality option, blank bubble space or focus target remains. No network service is needed.
