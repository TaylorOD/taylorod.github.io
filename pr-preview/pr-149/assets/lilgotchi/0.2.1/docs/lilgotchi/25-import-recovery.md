# Import and recovery

> Implemented design record. Requirements below describe the shipped implementation, not pending work. Hardware fidelity and external verification remain limited as recorded in the release review. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Save and help offers both a file picker and a paste fallback. The paste path exists for browsers where file selection is unavailable, including restricted review environments. It is not an upload.

## Flow

Open an exported JSON backup as text, paste its contents, and choose Preview pasted save. Use the same size limit, schema, family allowlist and game state validation as file imports. Show the named pet, stage and age before replacement. No active pet is unloaded while previewing. Invalid input clears an older pending confirmation, reports the problem and preserves play.

Replace this pet uses the existing confirmed import path and writer ownership. It keeps the prior raw save as a recovery copy. Clear pasted text after successful replacement. Cancel changes no save. An asynchronously read older file must not replace a newer paste preview or reopen a canceled confirmation.

## Accessibility and privacy

Use a labeled multiline field with keyboard focus, a clear explanation and a normal button. Include it in the drawer focus loop. Keep the content local and never inject its text as HTML. Do not write pasted backup contents to logs or status messages.

## Evidence

Automated checks cover valid pasted preview, malformed input after a valid preview, disallowed families, oversized data and stale file reads. Chrome verification exercised invalid text, valid pasted preview, confirmation, same family replacement, restored focus and saved progress. That check found a Web Lock release race, which was fixed and retested. Native file picker verification remains separate and unverified.
