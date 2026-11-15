# lilgotchi embeddable widget

> Historical design plan. This records the original requirements, not an outstanding task list. Later care, layout and release changes supersede parts of this plan. See the [current status](../implementation-status.md) and [release review](../release-review.md).

lilgotchi should work on an ordinary website with a script and one element. It must not depend on Taylor's site, its styles, its paths or its build tools.

## Static install

Ship a versioned static distribution that can be hosted anywhere. The first release should support copying the distribution into a site's assets. A public package or CDN can be added once its actual publishing location exists.

```html
<script type="module" src="/assets/lilgotchi/0.1.0/lilgotchi.js"></script>
<lil-gotchi character="slice" storage-key="site-pet"></lil-gotchi>
```

This is the supported API after copying the complete static build to that location. `character` accepts `default`, `slice` or `cyberpunk`. The selector includes all three by default. The default character is `default` when omitted.

## Widget structure

Use a custom element with a Shadow DOM shell and an isolated game iframe. The shell owns the launcher, drawer, selector, focus and save bridge. The iframe owns the original game presentation and loop. Keep the engine independent of either layer.

Resolve files relative to the loader module URL. Never assume the host is at `/` or that a `pets/` folder exists. Use relative paths inside the iframe bundle. Bundle fonts, sounds and sprites locally so the default game works without third party requests.

Use a private MessageChannel for the shell and its own frame. Establish the channel against the known frame window and expected origin. Validate message types and save payloads. Do not accept arbitrary window messages as game commands. The frame must not require direct access to its parent's DOM or storage.

## Public surface

| Setting | Behavior |
| --- | --- |
| `character` | Initial family only. A saved user selection takes precedence on later visits |
| `storage-key` | Stable instance identity within the host origin. Defaults to `default` |
| `placement` | `bottom-right` by default, or `bottom-left` |
| `mode` | `drawer` by default, or `inline` for a permanently mounted game |
| `migrate-legacy` | Opt in to validated full game legacy copies on first family open. Existing destination data always wins |
| `muted` | Sound begins muted. Sound can only start after user interaction |

Expose `open()`, `close()` and `setCharacter(name)`. Emit `lilgotchi:ready`, `lilgotchi:open`, `lilgotchi:close`, `lilgotchi:characterchange` and `lilgotchi:error` from the element. Public events carry simple documented values, never the entire private save. Reset stays behind an explicit confirmation in the game UI.

Expose a small set of shell CSS properties for surface color, text color, accent, outer spacing and stacking order. Host styling must not recolor Default's original game screen accidentally.

## Loading and cleanup

Register the element once even if the loader appears twice. Load the game on first open. Closing saves and stops animation, sound and active timers. Reopening applies the documented elapsed time rules. Disconnecting the element removes its listeners and frame.

Two widgets with different storage keys have independent pets. Two widgets with the same key share progress through a single active writer and a clear read only state for the other instance. Do not silently overwrite newer progress. See [saves](08-saves-and-site-migration.md).

## Distribution

Keep the engine, default source adaptation, skins, shell and storage in separate modules. Ship a complete static bundle, an unminified source tree, install instructions, license notices and a demo page. Pin versions in examples. No credentials, account, build step or backend is needed for the core game.

Document required script, frame and asset allowances for sites with a content security policy. Provide a self hosted example and a separate origin example. Do not promise arbitrary embeds work until both are tested.

## Acceptance

1. Copy the release files into a plain HTML site and install using only the example.
2. Run it under a nested path and from a separate asset origin.
3. Test on a host with aggressive global button, font and canvas styles. The game remains unchanged.
4. Open, close, remove and recreate the element without duplicate loops or sound.
5. Verify two independent instances and a duplicate storage key.
6. With network access removed after assets load, the core game remains playable.
