# Module handoff

The foundation intentionally preserves the existing game modules. Later tasks can replace their interfaces together without rewriting the original reference.

| Area | Current files | Next owner |
| --- | --- | --- |
| Shell and lifecycle | `lilgotchi.js`, `widget/shell.css` | Integration |
| State persistence | `pets/storage.js`, `boot.js` | Widget |
| Rules and timing | `pets/game.js`, `engine.js`, `constants.js`, `clock.js` | Default parity |
| Logical drawing | `pets/renderer.js` and render methods in `game.js` | Rendering |
| Artwork | `pets/classic-sprites.js`, `skins.js` | Default and character families |
| Original presentation | `pets/game.html`, `game.css`, `font.js`, `sound.js` | Default parity |
| Optional dialogue | New adapter plus controller hooks | Dialogue |

`GameState` provides reset, load, save and clearSave. `Evo` exposes evolution decisions. `setSimulationTime` controls the adapted clock for tests. `TamagotchiApp` owns actions and rendering. The current browser boot exposes `window.app`, which is a development aid rather than the planned public API.

The widget task should establish the frame channel and persistence interfaces before subsequent agents change them. The rendering task should establish a shared frame and anchor contract before custom art integration.

## Widget interface

The public entry is `lilgotchi.js`. It defines `<lil-gotchi>` and imports `widget/save-store.js`. Shell styling is in `widget/shell.css`. A private MessageChannel connects each element to its frame after checking parent origin, source window and a unique nonce.

`pets/storage.js` now exports `configureStorage(adapter)`. Embedded boot supplies synchronous `load()` and a `save(state)` callback that sends validated state to the host. Direct game pages retain their original storage path for reference testing. Keep those function exports stable.

`pets/boot.js` delays app creation until the host connection arrives. It handles `snapshot` requests, sends `save`, `ready`, `close` and sound `preference` messages, and receives `save-status`. Later dialogue support can extend this private protocol with validated message types. Public families map to the existing internal `classic`, `pizza` and `cyberpunk` values.

Default also sends the boolean `eink` preference through that channel. `TamagotchiApp` accepts optional `{eink, onThemeChange}` constructor options. The host passes both sound and E ink preferences at connection. Direct game pages use a guarded local theme preference instead.

`pets/game.css` is the complete original stylesheet and is checked against the pinned source. Keep embedding and accessible control differences in `pets/embed.css`. Custom families additionally load `pets/custom-themes.css` before starting the game. Do not put custom palette overrides back into the original stylesheet.

The host owns all embedded persistence. Do not read parent DOM or parent localStorage from the iframe. `SaveStore` handles validation, locks, leases, revisions, export data and confirmed replacement backups. The opt in site migration uses this adapter after acquiring ownership. See docs/install.md for migrate-legacy.

Run `npm run build` to create the static distribution. `examples/nested/`, `examples/cross-origin.html` and `examples/duplicate.html` are the widget QA surfaces. Shell polish owns further accessibility and responsive improvements.

The source harness in `tests/upstream-harness.mjs` evaluates the original without booting the browser or performing network calls. It supplies a controlled Date and repeatable random sequence. Extend action comparisons there while keeping `reference/upstream.html` untouched.

`reference/contact-sheet.html` is the initial original art review surface. Extend a separate QA page for family and stage selection, fixed animation frames and reaction fixtures. Production controls must not expose test time or state mutation.

`qa/index.html` now supplies that separate review surface. Its controls select all original identities, reactions, frame and theme. `qa/fixtures.js` is shared with a frozen source view. `qa/frame.js` mounts the current game markup without production boot and uses a no save adapter. These files do not enter the release build. Later art agents can use the family selector directly.

The Default screen comparison now omits only the original EGG label and heart draw operations, because those indicators moved below the LCD. All body and effect buffers still compare against the source. Raw sprites, font, paint and sound remain strict. Read [frame-contract.md](frame-contract.md) before adding art. The layout module derives opaque bounds and places complete matrices without overlaps. Custom bodies use equally padded frames up to 16 by 12, and eggs up to 16 by 10. The combined QA fixture and Animate fork checkbox cover the tightest live compositions.

Keep source reference captures and final browser proof under `pr-screenshots/`. Capture actual game areas at desktop and phone sizes before pushing visual work.

## Slice integration

`pets/slice-sprites.js` exports `sliceSprites`, `slicePalette` and `sliceNames`. Every body has a frozen 12 by 12 canvas for idle1, idle2, happy, sad, eat and sleep. Dough has two frozen 12 by 10 proofing frames. The drawings preserve original identity keys and all evolution logic. Palette index 6 is basil green. Shared effects stay in `classic-sprites.js`.

`skins.js` selects the family and exports `characterName` for display labels. The game uses a family's optional sleep frame before the original idle fallback. Default has no sleep override and continues to match the source. Cyberpunk now follows these interfaces with its own art module, palette and names.

Review all Slice art at `/qa/slice.html`, then use `/qa/?pet=pizza` for composed reactions. QA files stay outside the release. Do not mutate published matrices because layout metadata caches by identity.

## Cyberpunk integration

`pets/cyberpunk-sprites.js` exports frozen `cyberpunkSprites`, `cyberpunkPalette` and `cyberpunkNames`. Binary Seed has two 12 by 10 boot frames with readable 01 glyphs. Every other identity has six 12 by 12 frames, including a closed visor sleep pose. Original identities, effects, care logic and evolution remain unchanged. Reduced motion retains the current stable boot frame through the existing render gate.

Open `/qa/cyberpunk.html` for all 68 matrices at native and six times scale. Use `/qa/?pet=cyberpunk` to inspect composed reactions. Mainframe antennae and Wire cable are included in the full padded bounds. All art and rows are immutable. The robot placeholder is removed and Default and Slice keep their existing artwork.

## Shell polish handoff

`widget/launcher.js` renders a fixed portrait from existing sprite matrices. `pets/boot.js` reports `resize` over the private channel after device resize or overlay changes. The host accepts integer heights from 100 to 1200 only, from the current frame and family. Overlays contribute their natural child heights so the outer drawer owns scrolling. Keep the original stylesheet unchanged.

Save tools use a native disclosure. The modal dialog provides host inertness, with explicit outer keyboard wrapping and launcher focus restoration. Inner overlay focus handling remains in boot and game modules. Inline widgets do not apply the outer focus loop. Closing waits for the final snapshot and cancels unfinished rounds without rewards.

Wheel and single touch drags inside the frame send a bounded `scroll` delta. The host scrolls its drawer, or the page for inline mode. Ctrl wheel and multiple touch gestures stay native. `widget/scroll-lock.js` restores the original host overflow after the last modal closes or disconnects.

## Dialogue handoff

`pets/dialogue.js` owns the exact context allowlist, trigger list, original personality map and frame request lifecycle. `widget/dialogue-host.js` validates again before invoking `element.dialogueAdapter(context, {signal})`. Boot carries dialogue requests, results, cancellation and the saved opt in preference over the existing private channel. No provider code or secret is in the game. Set callbacks before opening or before connecting an inline element.

`examples/dialogue.html` has deterministic success, delayed, failure, malformed and timeout modes plus all trigger controls. Prepare adult after opening, enable dialogue in settings, then try triggers. This review page uses direct same origin access for fixtures only. Production has no fixture controls. Reset and close should cancel delayed requests. The examples folder enters dist and contains no server code. `server-example/` stays outside dist and needs hosting, authentication, durable budget counters and a real provider test before deployment.
