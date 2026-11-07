# File import and recovery

> Updated after 0.2.1. The pasted save fallback has been removed at the user’s request. The earlier paste interface and its documentation are no longer the current design. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Settings offers Import save, which opens the browser file picker. Choose a previously exported JSON backup. The file is read locally and is not uploaded.

## Validation and replacement

Check the file size, schema, family allowlist and game state before showing the pet, stage and age for confirmation. No active pet is unloaded while previewing. Invalid input clears an older pending confirmation, reports the problem and preserves play.

Replace this pet uses the existing confirmed import path and writer ownership. It keeps the prior raw save as a recovery copy. Cancel changes no save. An asynchronously read older file cannot replace a newer file preview or reopen a canceled confirmation.

## Accessibility and verification

Import save is a normal button. Confirmation moves focus to its action and cancellation restores the import trigger or character picker. No backup contents are injected as HTML or written to logs.

Automated checks cover valid file preview, malformed data after a valid preview, disallowed families, oversized files and stale file reads. Earlier Chrome testing of the removed paste interface found and verified a fix for a Web Lock release race. Native file picker verification remains separate and unverified.
