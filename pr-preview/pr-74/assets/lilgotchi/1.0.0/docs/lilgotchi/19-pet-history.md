# Pet history

> Implemented design record. Requirements below describe the shipped implementation, not pending work. Hardware fidelity and external verification remain limited as recorded in the release review. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Keep a small local memorial in Save and help, outside the game display. It records a pet that passed away before a restart replaces its active save. It is not a score board or a second playable save.

## Data and ownership

`PetHistory` receives the existing `SaveStore`. It shares the store instance, storage fallback and persistence reporting. Each character choice has its own history key, so the existing per pet writer ownership also protects history updates. `recordDeath(family, state)` requires ownership of that family. Call it before replacing a dead save with a new lifetime, and when a validated dead state is saved.

An entry contains family, original character identity, birth timestamp, age in game days and the time the memorial was recorded. The recorded time is not claimed as an exact death time. No dialogue, player text, provider data or HTML is stored. Identity is the selected family plus birth timestamp. Repeat death saves and reimporting a remembered lifetime do not add another entry.

Keep the most recent 12 lifetimes per selectable pet, at most 168 entries for the current 14 choices. Deduplication applies to retained history. An older lifetime imported after it has aged out may be remembered again. Do not keep an unbounded tombstone list. Saves with identical family and birth timestamp are treated as the same lifetime.

## Failure and recovery

Malformed or oversized history is reported and kept unchanged. Failed browser writes use the existing session fallback. History failures must be caught by the host and must not prevent normal care or discard the active save. A session only history is labeled as lasting for this visit. No history upload, account or automatic sync is introduced.

## Interface

`list(family?)` returns cloned newest first entries. A family argument limits reads to one pet. `recordDeath` returns true when appended and false for a live pet or an already remembered lifetime. `describe(entry)` returns plain text for `textContent`; never insert it as HTML. Show only entries from the site's allowed character list. Keep full history off the LCD and do not automatically open a memorial while playing.

## Verification

Tests cover duplicate periodic death saves, reset lifetime separation, ownership, family and instance isolation, bounded pruning, invalid input, corrupt storage preservation, deterministic ordering and session fallback. Real browser restart and death screen interaction are integration checks owned by the host.
