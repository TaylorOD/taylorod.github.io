# lilgotchi default character family

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Default uses the original clone's art unchanged. Its purpose is to make the game recognizable and give the other families a precise reference for stages, reactions and timing.

## Lifecycle

| Stage | Original identity | Artwork requirement |
| --- | --- | --- |
| Egg | `egg` | Both original egg frames and original hatch presentation |
| Baby | `babytchi` | Complete original frame set |
| Child | `marutchi` | Complete original frame set |
| Teen | `tamatchi` | First original teen branch |
| Teen | `kuchitamatchi` | Second original teen branch |
| Adult | `mametchi` | Original adult art |
| Adult | `ginjirotchi` | Original adult art |
| Adult | `maskutchi` | Original adult art |
| Adult | `kuchipatchi` | Original adult art |
| Adult | `nyorotchi` | Original adult art |
| Adult | `tarakotchi` | Original adult art |
| Secret adult | `oyajitchi` | Original secret form |

The current adapted constants specify five minutes as an egg, one hour as a baby and one day each as a child and teen. Use the pinned source comparison to verify these values and all conditions that delay or change evolution.

## Branch contract

The current engine chooses `tamatchi` with at most one care mistake and `kuchitamatchi` otherwise. Its adult rules are ordered as follows. Preserve the underlying IDs for every skin.

| Teen | Condition in priority order | Adult |
| --- | --- | --- |
| `tamatchi` | At most 2 care mistakes and discipline at least 100 | `mametchi` |
| `tamatchi` | At most 2 care mistakes and discipline at least 75 | `ginjirotchi` |
| `tamatchi` | At most 4 care mistakes and discipline at least 50 | `maskutchi` |
| `tamatchi` | Otherwise discipline at least 50 | `kuchipatchi` |
| `tamatchi` | Otherwise discipline at least 25 | `nyorotchi` |
| `tamatchi` | Otherwise | `tarakotchi` |
| `kuchitamatchi` | Discipline at least 75 | `kuchipatchi` |
| `kuchitamatchi` | Otherwise discipline at least 50 | `nyorotchi` |
| `kuchitamatchi` | Otherwise | `tarakotchi` |

The secret check requires `maskutchi`, discipline at least 100 and age at least 10. Preserve the surrounding update conditions from the original too. These tables describe the current adapted engine and must be checked against the pinned source before release.

## Frame inventory

Extract an inventory from the original sprite data and every sprite reference in the original renderer. Preserve each required key and complete matrix. Include both idle frames, happy and sad expressions, eating, refusal, sleep, sickness, attention, game reactions, evolution and death presentation. Some reactions reuse a body frame with an effect. Record that composition explicitly instead of inventing missing source frames.

Retain shared food, heart, waste, skull, sleep, grave and angel art. Keep the original font. The bounds fix may change placement of a clipped composition, but it must not delete edge pixels or rewrite the default character shape.

## Acceptance

1. Every default matrix equals its pinned source matrix.
2. Every lifecycle branch and action resolves to a valid frame or documented original composition.
3. Screenshots match the source at a fixed animation frame, except documented bounds fixes.
4. All stages fit in the screen during every supported reaction.
5. Changing to another family and back leaves Default's state and art intact.
