# Care while the drawer is closed

> Implemented design record. Requirements below describe the shipped implementation, not pending work. Hardware fidelity and external verification remain limited as recorded in the release review. See the [current status](../implementation-status.md) and [release review](../release-review.md).

After opening a pet, closing its drawer keeps that pet's simulation and save lease active while this page remains open. The launcher updates from real saved state. Rendering and sound stop while the drawer is closed. Opening resumes the same frame. Changing characters, removing the widget or leaving the page releases the frame and lease.

Before a pet has been opened, the launcher identifies its status as last saved. After opening, the label distinguishes live care from stored care. Vacation shows a paused label without a needs dot. There are no operating system notifications and no claim of monitoring after the page closes. Browsers may throttle inactive tabs.

Snapshot before closing, cancel an unfinished guessing game, retain mute preference, and preserve save ownership. Tests must cover close versus unload and paused launcher behavior.
