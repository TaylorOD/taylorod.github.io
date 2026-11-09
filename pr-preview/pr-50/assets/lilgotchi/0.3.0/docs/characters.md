# Character choices

The full lineup is available by default. Each selection has its own save under your stable `storage-key`.

Cypunk keeps the `cyberpunk` configuration ID, asset paths and save keys for compatibility. Existing installs, exported backups and saved progress continue to work without migration. The name shown to players is Cypunk.

| ID | Starting stage |
| --- | --- |
| `default` | Original egg |
| `babytchi` | Baby |
| `marutchi` | Child |
| `tamatchi` | Teen |
| `kuchitamatchi` | Teen |
| `mametchi` | Adult |
| `ginjirotchi` | Adult |
| `maskutchi` | Adult |
| `kuchipatchi` | Adult |
| `nyorotchi` | Adult |
| `tarakotchi` | Adult |
| `oyajitchi` | Adult |
| `slice` | Slice egg |
| `cyberpunk` | Cypunk egg |

Named original choices are starting presets. They use the actual original sprites and begin at the pictured stage. Age and care history start at zero, with the minimum weight from the stage constants. Growth and care rules still apply. A teen can grow into another character. Choosing Mametchi does not lock every future life to Mametchi. Reset returns that save to its selected preset. The original egg still follows the normal full evolution path.

## Choose what your site offers

```html
<script type="module" src="/assets/lilgotchi/0.1.0/lilgotchi.js"></script>
<lil-gotchi characters="default,mametchi,slice" character="mametchi" storage-key="site-pet"></lil-gotchi>
```

Omit `characters` or use `characters="all"` for all 14 choices. Lists accept commas or spaces and preserve order. Unknown IDs and empty lists show an explicit configuration error. The setting is read when the element connects.

`await pet.setCharacter('mametchi')` selects an allowed choice and opens its existing save. It rejects unknown or unavailable IDs. Imports also reject unavailable choices before replacing anything. The picker contains only the site's allowed choices.

An allowed saved selection wins over `character` on a later visit. If it is no longer allowed, the first allowed choice is selected. Its excluded save is kept and becomes available again if the site restores that choice. With no saved selection, an allowed `character` wins, otherwise the first allowed choice is used.

## Save design

The public choice ID is the save identity, not the current evolved character. A Babytchi save remains in the `babytchi` slot after growing up. `default`, `slice` and `cyberpunk` retain their existing keys and import format. Named originals get distinct keys in the same versioned format. Legacy migration applies only to those original three slots, so an old classic save is never copied into every original character.

The shared catalog maps public IDs to the internal classic, pizza or cyberpunk skin. The frame validates that pair. All named originals use the classic skin and its normal evolution engine. This keeps appearance, picker choices, reset behavior and save identity consistent without separate game implementations.

## Lilgotchi

Use `lilgotchi` to start the logo egg family. It begins as a small egg and grows eyes, then a larger body. Its elder form has a crack. Each choice has its own saved progress.
