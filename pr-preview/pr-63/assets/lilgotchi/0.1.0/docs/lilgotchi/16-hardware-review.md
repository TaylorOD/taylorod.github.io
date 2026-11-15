# Hardware review

Reviewed November 7, 2026 against current constants and engine. This is a source based behavior review, not firmware verification.

## Primary references

A. [Bandai P1 instructions](https://www.bandai.com/amfile/file/download/file/3639/product/1309818/), pages 1 and 2.

B. [Official Original FAQ](https://tamagotchi-official.com/kr/series/original/faq/), English answers under the care and Tamagotchi sections. The locale is Korean but the cited answers are English.

The official manual hosted at https://tamagotchi-official.com/manual/toy/original/Original_webmanual.pdf was also located. Its text was not extractable in this review, so no additional rule rests on that copy.

## Verified player facing rules

| Rule | Primary evidence | Current behavior | Decision |
| --- | --- | --- | --- |
| Hatching | A p1 and B care question1 describe roughly five minutes | EGG_MS is 90 seconds | Deliberate user requested faster hatch. Keep it and document the difference |
| First care | A p1 describes attention and food/play needs after hatching | doEvolve fills both needs | Change newly hatched babies to empty needs and issue attention |
| Feeding | A p2 offers meals and snacks, including refusal when full | Separate meal/snack actions with caps | Consistent at this level |
| Sleeping lights | A p2 asks players to switch lights off and describes automatic light on at waking | Light control and wake light on exist | Consistent. Scheduled sleep and manual naps remain our implementation choices |
| Waste | A p2 connects unattended waste with illness | Waste accumulation can cause sickness | Consistent at this level; exact probabilities unverified |
| Health screen | A p2 includes age, weight, discipline, hunger, happiness | These exist; energy and numeric health added | New metrics are lilgotchi additions |
| Game | A p2 describes five direction guesses | Five round guessing game exists | Consistent structure; precise reward formula unknown |
| Medicine | A p2 allows multiple doses including three | makeSick currently chooses only one or two | Allow one through three on newly created illnesses |
| Discipline | B care question3 lists unnecessary calls and refusal behavior | Misbehavior and discipline exist | Consistent concept; probabilities unknown |
| Restart | B care question4 describes a new egg | Preset restart can create a named adult | Intentional starting preset difference. Clearly name the restart destination |
| Sound | B device question6 provides a mute toggle | Mute toggle exists | Consistent capability; waveform and timing not verified |

## Unknown details

The sources reviewed do not establish the exact original hunger/happiness decay intervals, waste rates, sleep times per identity, stage durations, base weights, care mistake window, discipline increments, snack sickness threshold, mortality age, or adult branch thresholds. Existing values remain clone assumptions, not verified hardware constants. The identity branches are tested against the archived clone; that is regression evidence only.

The instructions do not establish an automatic refill at child or teen evolution. Preserving food and happiness across these transitions is a recommended lilgotchi care consistency fix, not a proven reproduction of firmware. Existing saves should retain their current needs; apply the new behavior only on future transitions. Do not retroactively deduct needs, change birthdays, force evolution, or rewrite medicine doses already assigned.

The numeric health meter is advisory. It must not add a new death condition or claim that 100 means the pet cannot be sick. Energy and care grades must not silently replace original evolution logic. The persistent care grade is calculated by our new elapsed time model.

## Concrete implementation and validation

1. In doEvolve, identify the previous egg stage. For that transition set food and happiness to zero and initiate the normal attention path. Do not refill other stages.
2. In makeSick, expand the new illness dose range to one through three. Keep imported and existing medDoses values intact.
3. Preserve the 90 second hatch setting as the user's product choice. Update any tests or prose still claiming five minutes for lilgotchi.
4. Add focused tests for hungry newborns, preserved later stage needs, three dose recovery, and unaffected existing save values.
5. Update source parity notes with narrow explicit exceptions. Keep the original data and tests for every unrelated rule.
6. Explain the difference between documented original rules, inherited clone assumptions, and lilgotchi additions in the public reference review.

## Acceptance boundary

These changes improve evidence based consistency. They do not justify a claim of exact original firmware behavior. A future exact emulation mode requires a separately identified hardware revision and reproducible observations or lawful firmware emulation evidence.
