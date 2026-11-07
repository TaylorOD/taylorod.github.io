# Release review

Pasted save import was removed at the user's request after 0.2.1. Historical pasted import checks below describe the earlier releases, not an available feature. File import, validation, confirmation and recovery remain.

## 0.3.3 adult lineup

The landing page shows adult representatives for all four pet types, with matching visual scale. The original pet type is labeled Tamagotchi. New games still begin as eggs and existing saves keep their identities. The README features adult Slice. The landing footer keeps only Credits and Code on GitHub.

## 0.3.2 care guide placement

How to care for your pet is now the first item in Settings, above preferences and backup tools. Guide wording points to Settings for exporting a backup. The newly proposed alternate evolution lineups are not part of this release.

## 0.3.1 special elders

144 automated tests pass. Spoiled Slice replaces Pizza Chef and Glitch Elder replaces Mainframe at the existing special elder identity. Existing saves and evolution rules stay compatible. Both use the same Maskutchi, age 10, 100% discipline eligibility and 5% per tick trigger as the cracked Lilgotchi egg.

Chrome review checked all three elder appearances in real game frames at desktop and mobile sizes using local test pets. Tests cover eligibility boundaries, every expression and full screen bounds. README wording now explains pet types and the launcher button separately.

## 0.3.0 egg family and widget layout

142 automated tests pass. Lilgotchi adds a complete logo egg family, including a cracked elder form, with screen bounds checks for every stage and reaction. The landing page has four featured pets and the personal site allows Original egg, Slice, Cypunk and Lilgotchi.

Pet identity sits beside the picker. Care status sits below the egg. Settings combines preferences, backups, help and memories at the bottom, with a Close settings button. Pasted saves are removed. Launchers match family shell colors and support an optional icon and text style. The personal site's launcher moves left on mobile only.

Chrome checks cover the changed desktop and mobile layouts, Vacation and sound preference updates, the four pet gallery, launcher variants, and the installed personal site. Physical device and human audio checks remain separate below.

## 0.2.1 mobile fixes

132 automated tests pass. Settings has a visible top Close button and accurate natural overlay height, including flex gaps. The scanline explanation describes its decorative effect. Save status shares the Save and help row. Pet switching keeps a dark, stable frame area until the next game is painted and ready. Cypunk replaces the displayed Cyberpunk name while internal IDs preserve existing saves.

Chrome checks covered Settings close and focus return, desktop and 320/390 pixel widths, inline save status, and delayed network pet switching. These are browser checks, not a claim of physical iPhone verification. The personal site roster is restricted to Original egg, Slice and Cypunk.

## 0.2.0 hosted install

127 automated tests pass. The added loader checks cover loading before the body is ready, captured script configuration, inline placement, head placement and failed module imports. Chrome review checked separate host and asset origins, two independent widgets, the restricted character picker, drawer and inline rendering, and the updated copy button at desktop and 390 pixel widths. Screenshots are named hosted-install and hosted-snippet under pr-screenshots.

The npm tarball was installed into a fresh temporary folder without lifecycle scripts. It includes the full static runtime, root MIT license and upstream notice. The package is distributed through GitHub releases; publishing a registry listing requires an authorized npm login. The hosted loader is pinned under releases/0.2.0. Earlier verification limits below still apply.

## 0.1.0 baseline review

Reviewed November 6, 2026 for the first named 0.1.0 built release. The 124 test count below is historical; 0.2.0 has 127 passing tests.

### Completed in 0.1.0

124 automated tests pass. Coverage includes original source integrity, preserved sprite matrices, every family and reaction placement, care and evolution exceptions, vacation migration and clock correction, invalid imports, delayed callbacks after death, modal isolation, static care indicators, ownership, history and storage failures.

Actual Chrome review checked the built package at desktop, 390 by 844, 320 by 700 and 844 by 390. A 640 by 450 effective viewport at device scale 2 was inspected as an enlarged layout simulation. This is not a claim of a complete native browser zoom matrix.

Observed flows: original, Slice and Cypunk; 90 second countdown; newborn empty needs; growth notice; scenery; busy E ink scene with all care indicators visible; reduced motion; Settings keyboard wrapping in both directions; Escape focus return; vacation on, reload and resume; four step care guide; pasted save validation, replacement and restored picker focus; memorial surviving restart; light outer shell.

Closing the drawer retained the frame, stopped its frame counter and suppressed sound while lastProcessed continued advancing and the launcher exposed Live care. Before first open it remains labeled last saved.

The real pasted import found a Web Lock release race missed by the original mocks. The corrected path was repeated successfully in Chrome and has immediate reacquisition and same family replacement regressions.

Readability inspection found and corrected low contrast settings text and stale meters visible on eggs. Measured contrast for the checked pairs: settings explanation 11.39:1, host body 15.97:1, guide muted text 10.54:1, growth notice 11.93:1, light host text 8.91:1. These measurements are selected text pairs, not certification of every state or a complete accessibility audit.

Sound tests check suspended audio context recovery, original cue arguments, default mute and silent closed drawers without changing player preference. No AI runtime, callback or provider example remains.

Screenshots are under pr-screenshots, including release-slice-mobile, release-cyberpunk-320, release-growth-320, release-vacation-mobile, care-guide-mobile, release-landscape-memorial, release-eink-busy and release-light-shell.

## Still requires external verification

1. Physical iPhone and Android checks.
2. A human screen reader session and human audio listening.
3. Complete native zoom and accessibility matrix beyond the recorded browser checks.
4. File chooser import automation. The Chrome extension denied local file access. The former pasted JSON flow was exercised successfully; it has since been removed. File parsing and asynchronous preview races are covered by tests.
5. Exact hardware constants not established by the official manual, including decay schedules and evolution thresholds. They remain identified clone assumptions. See the hardware review rather than interpreting test counts as firmware fidelity.

## Release contents

The named built zip includes the runtime, install examples, metadata and notices. Local saves retain schema 1. Memorial history remains local to the original website and is not bundled into active pet exports. Published release downloads stay unchanged. The personal site, standalone demo and hosted loader use 0.3.3; see the current installation guide for their version.
