# lilgotchi design records

The widget is released and deployed. These numbered documents preserve design decisions from earlier implementation rounds. Their acceptance criteria are not a current task list. Some original requirements were deliberately replaced by later designs.

Use [implementation status](../implementation-status.md) for shipped behavior, [release review](../release-review.md) for evidence and open checks, and [installation](../install.md) for the public package and hosted snippet.

## Design index and outcome

| Record | Outcome |
| --- | --- |
| [01 Embeddable widget](01-embeddable-widget.md) | Implemented. Public GitHub package and a hosted one script install are also available |
| [02 Original clone parity](02-original-clone-parity.md) | Original regression baseline captured. The compact UI deliberately supersedes exact presentation parity |
| [03 Default family](03-default-character-family.md) | Original egg and all original starting characters implemented |
| [04 Slice family](04-slice-character-family.md) | Dough egg, full lifecycle and reaction art implemented |
| [05 Cypunk family](05-cyberpunk-character-family.md) | Binary egg, full lifecycle and reaction art implemented |
| [06 Screen bounds](06-animation-and-screen-bounds.md) | Complete bodies and effects contained, with regression coverage |
| [07 Widget accessibility](07-widget-polish-and-accessibility.md) | Responsive shell and keyboard behavior implemented. External checks remain open |
| [08 Saves and migration](08-saves-and-site-migration.md) | Host owned saves, migration, recovery and personal site integration implemented |
| [10 Care model](10-care-model.md) | Energy, advisory health, care grades and manual sleep implemented |
| [11 Screen layout](11-screen-layout.md) | Clock, stage, four meters and contextual controls implemented outside the pet canvas |
| [12 Motion and scenery](12-motion-and-scenery.md) | Implemented, then extended by record 20 |
| [13 Widget polish](13-widget-polish.md) | Implemented. Its last saved only behavior is superseded by record 23 |
| [14 Install and release](14-install-and-release.md) | Configurator and versioned downloads implemented. It now generates one hosted script |
| [15 Integration review](15-integration-review.md) | Recorded browser and automated checks passed. External verification remains open |
| [16 Hardware review](16-hardware-review.md) | Needs and medicine corrections implemented. Undocumented device constants remain unknown |
| [17 Away care](17-away-care.md) | Vacation, eight hour catch up cap and return summary implemented |
| [18 Dialogue removal](18-dialogue-removal.md) | AI removed from runtime, public API and distribution |
| [19 Pet history](19-pet-history.md) | Local memorial history implemented. Active pet exports do not include history |
| [20 Motion and celebrations](20-motion-and-celebrations.md) | Family scenery, pixel tilt and landing, and dismissible growth notices implemented |
| [21 Care guide](21-care-guide.md) | Four step walkthrough and care explanations implemented |
| [22 Accessibility review](22-accessibility-review.md) | Recorded desktop browser checks complete. Physical devices, human listening and screen reader checks remain open |
| [23 Live care](23-live-care.md) | After first opening, care updates continue with the drawer closed while the page remains open |
| [24 Stable release](24-stable-release.md) | Tagged releases, built zip and npm installable GitHub package published |
| [25 Import recovery](25-import-recovery.md) | File import retains validation and recovery. The paste fallback was removed; native file picker verification remains open |

Record 09 was the optional AI plan and was removed with that feature.

## Presentation contract

Original sprite matrices and the documented core care rules remain regression references. The clock, scenery, meters, contextual controls, growth cards and compact shell intentionally differ from the original clone. Neither these checks nor the inherited rules establish exact hardware emulation. See the [parity register](../parity-status.md).

## Remaining verification

The release review is the authoritative list: exact undocumented hardware constants, physical iPhone and Android checks, human screen reader and audio listening, broader native zoom and accessibility testing, and native file picker import. The npm registry listing also requires an authorized login; the GitHub package and hosted embed already work.
