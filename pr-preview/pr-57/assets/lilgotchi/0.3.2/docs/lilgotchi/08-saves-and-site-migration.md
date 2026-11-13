# lilgotchi saves and site migration

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Each website keeps its own pets in that browser. Default, Slice and Cypunk have separate progress. Closing the drawer or switching families must never reset them.

## Storage ownership

The host shell owns storage on the website's origin. This keeps hosted frame storage restrictions from determining whether the pet can save. The game frame requests load and save through the private channel described in the [widget design](01-embeddable-widget.md).

Use a versioned envelope containing schema version, instance key, family, revision, saved time and validated game state. The key is `lilgotchi:v1:{instance}:{family}`. Keep selected family and sound preference separate from lifecycle state.

Persist after meaningful actions and during normal play, not only on unload. A close operation waits for the latest state acknowledgement before destroying the frame. A missed final unload event must not lose an entire visit.

If storage is blocked or full, keep a session copy and display the limited save status. Do not claim cross device sync. Clearing site data removes browser saves. Provide export and import so players can back up progress or move it manually.

## Concurrent tabs and widgets

Use one active writer per instance and family. Use a browser lock when available and a revision checked lease fallback otherwise. Another tab can show the pet read only and offer to take over after releasing or expiring the old lease. Account for suspended tabs. Before saving, reject stale revisions instead of overwriting newer state.

Different instance keys remain independent. Reusing a key is intentional shared identity within the same origin, not a way to share saves across websites.

## Resume behavior

Store the last processed time and preserve partial intervals. Reopening must not repeatedly gain or lose time. Sleep uses the player's local clock as in the current game. Handle future timestamps and clock changes without negative aging or runaway processing.

The existing fork replays minutes up to 25 days and approximates random events. Compare this against the pinned original before choosing the release behavior. Document the final cap, random event policy and time zone behavior as intentional differences when they diverge. Closed drawers consume no animation or audio resources.

## Personal site migration

Map current identifiers to the public family names:

| Current family | lilgotchi family |
| --- | --- |
| `classic` | `default` |
| `pizza` | `slice` |
| `cyberpunk` | `cyberpunk` |

Read existing full game saves from `taylor-pocket-pets-p1-v1-{type}` only with the explicit `migrate-legacy` attribute and when no lilgotchi destination data exists for that family. Damaged destination data requires recovery and is never overwritten. Validate and copy the state, retaining original gameplay identities. Record migration completion only after the new save succeeds. Keep the old data as a recovery copy.

Leave the earlier simplified `taylor-pocket-pets-v1` data untouched. It lacks the full care and discipline history. Do not invent that history or overwrite a full game save with it.

Replace the home and projects page integration with the same public widget API and one stable storage key. Preserve existing launcher placement unless needed for the bounds and responsive requirements. Both pages must resume the same pets.

## Import and export

Export a versioned JSON file with the selected family's state. Validate size, schema, supported family, numbers, timestamps and identity before import. Preview the family and age, then confirm replacement. Preserve the previous save until the imported state is written successfully. Never execute imported text or accept it as markup.

## Acceptance

Verify fresh starts, reloads, page navigation, character switches, close during play, blocked storage, quota failure, corrupt data, repeated migration, import failure and recovery. Test two tabs and two widgets competing for the same identity. A failed migration must leave the old save usable. A valid new save always wins over an old migration source.
