# Install lilgotchi

## One line hosted install

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.3.3/embed.js"></script>
```

Paste this into the head or body of an HTML page. The versioned URL loads all required files and creates one widget. No account, upload, API key or package manager is needed. The widget starts with Slice, all characters available and sound off. The hosted files come from Taylor's GitHub Pages site. Saves stay in the visitor's browser on your website.

The URL stays on this release. Change the version to upgrade. Keep `data-storage-key` stable to preserve saves. Loading third party scripts requires a website that allows custom JavaScript; a CMS that strips script tags needs its custom code feature.

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.3.3/embed.js" data-character="cyberpunk" data-characters="default,slice,cyberpunk" data-placement="bottom-left" data-storage-key="my-pets"></script>
```

Supported script settings are `data-character`, `data-characters`, `data-placement`, `data-appearance`, `data-storage-key`, `data-mode`, `data-launcher` and `data-muted`. They map to the custom element settings below. `data-muted` is a presence flag. Inline widgets appear immediately after a script in the body; a script in the head places its inline widget at the end of the body. Put the script where you want an inline widget. Each script creates one widget. Give multiple widgets separate storage keys. Module loading failures emit `lilgotchi:loaderror` on the script.

Use the landing page to generate a customized one line snippet. The release includes `examples/one-line.html` to try the same loader with your own copy.

## Public package

The [0.3.3 release](https://github.com/TaylorOD/lilgotchi/releases/tag/v0.3.3) includes a built zip and an npm installable tarball under MIT. The npm registry listing is separate from this GitHub package.

```sh
npm install https://github.com/TaylorOD/lilgotchi/releases/download/v0.3.3/lilgotchi-0.3.3.tgz
```

Copy the entire `node_modules/lilgotchi/dist` directory into your public assets. Do not bundle just the main JavaScript file: its sibling modules, styles and game iframe must stay together. The export is browser only. Server rendered frameworks should use a script in the rendered page and serve the full static folder.

For maintainers, `npm pack` rebuilds and packages the distribution. `npm publish --access public` requires an authorized npm account. Never put an npm token in the project. The root license and upstream notice are both included.

## Build from source

Build with `npm run build` and copy all of `dist` into a versioned folder on your website. Keep the files together. The loader resolves its styles, modules and iframe relative to its own URL, so the install works below a nested path.

The [README](../README.md) has the install snippet. The game needs no backend or account.

## Hosting

Serve JavaScript modules with a JavaScript MIME type. For separate origin hosting, return `Access-Control-Allow-Origin` for the host website or `*` on public static assets. Allow the game to be framed by the host website using the asset host's frame policy.

A site with a content security policy must allow the module origin in `script-src`, the stylesheet origin in `style-src`, and the game origin in `frame-src`. The game currently also needs its existing inline styles allowed within its own frame policy. No core game `connect-src` exception is needed because it makes no API requests.

`examples/nested/` demonstrates two independent inline widgets under a hostile host stylesheet. `examples/cross-origin.html` is a local test using localhost as the host and 127.0.0.1 as the asset origin. That local example is not a production CDN URL. The preview server sets public CORS headers for this test.

## Settings

`character` chooses the initial selection. `characters="all"` is the default. A comma or space separated list such as `characters="default,mametchi,slice"` limits the picker, public method and imports. Invalid or empty lists show a configuration error. Saved selection wins when allowed. If a saved selection is excluded, the first allowed choice opens and its old save stays intact. Settings are read when the element connects. See the [character guide](characters.md). `storage-key` defaults to `default` and should stay stable across pages. `mode="inline"` displays the game in the page. The default drawer uses the bottom right corner, with `placement="bottom-left"` available.

Sound starts muted. The player's choice is saved per instance and restored on later opens. Audio still requires browser user interaction. A `muted` attribute forces a muted start.

Set `--lilgotchi-surface`, `--lilgotchi-text`, `--lilgotchi-accent`, `--lilgotchi-spacing` or `--lilgotchi-z` on the element to customize its shell. The game screen lives in an iframe and stays isolated from those styles.

## Progress and recovery

The host website owns saves, including when the game assets come from another origin. Each instance and family uses a versioned envelope. Export produces a portable JSON file. Import validates it and shows the family and age before replacing progress. Replacement preserves the original raw save at the same key with `:recovery` appended.

Export also works for damaged save data so it can be kept for recovery. A damaged save is never silently overwritten. A valid imported backup can replace it after confirmation.

If browser storage is unavailable or full, a session copy keeps progress for the current page visit. The UI reports that limit. Reloading or closing the browser may lose session only progress. Clearing site data removes local pets. There is no automatic cross device or cross website sync.

Modern browsers use Web Locks to allow one writer per pet. A second widget or tab shows a read only notice. Close the active browser tab or page, then choose Try again in the other. Closing only the drawer keeps its pet active. Older browsers use a 15 second lease with revision checks. A suspended writer loses its lease instead of overwriting later progress. The fallback cannot provide the same atomic cross tab guarantees as Web Locks, so current browsers are recommended for simultaneous tabs.

Closing waits for a final state snapshot, keeps care active and suppresses rendering and sound. Disconnecting the element retains the latest action or periodic save and immediately stops its frame. An interrupted guessing game earns no result. Exporting a save leaves the game running.

## Current limits

The original sprites and character branches are retained inside a redesigned compact interface. Slice and Cypunk include every life stage. The presentation and wellbeing additions are lilgotchi choices, not verified original hardware behavior. Import validation and replacement are covered by automated tests. See the current implementation status for browser upload verification.

The drawer keeps its header reachable while the game and save tools scroll together. The private frame channel reports bounded content heights, including open overlays. Settings contains export and import. Escape closes a game overlay before closing the drawer. Closing returns focus to the launcher. Inline mode does not trap focus in the host page. Reduced motion removes the drawer entrance and decorative game movement.

## Migrate the earlier personal site pets

Migration is off by default. Only sites that used the earlier full game should add `migrate-legacy` before connecting the element:

```html
<script type="module" src="/assets/lilgotchi/0.1.0/lilgotchi.js"></script>
<lil-gotchi storage-key="taylor-pocket-pets" migrate-legacy></lil-gotchi>
```

Use that same storage key on home and projects. The selected family is copied when first opened. `classic`, `pizza` and `cyberpunk` from `taylor-pocket-pets-p1-v1-{type}` become Default, Slice and Cypunk. The host checks writer ownership and validates the full state and clocks. Any existing destination, including damaged data, prevents migration. Original keys and the simplified `taylor-pocket-pets-v1` save stay untouched.

A migration receipt is recorded only after the destination can be read back from browser storage. The destination itself prevents duplicate copies if writing the receipt fails. Quota failures leave migration available to retry with Try again. Invalid legacy data shows a recovery error instead of starting over. If storage cannot be read at all, the widget can play in session mode without copying the old pet. Restore storage access and reload to retry. Export session progress before reloading if you want to retain that visit.

The lower level `SaveStore.migrateLegacy(family)` method requires ownership acquired with `acquire(family)`. Normal installations never call it automatically.

## Check a copied release

Open `dist/examples/install.html` through your local HTTP server after building. At the default development server that is `http://localhost:4176/dist/examples/install.html`. This page imports the built loader, not the source checkout. The other built examples resolve their modules relative to the same copied folder, including the separate origin example. `version.json`, `LICENSE.md` and `reference/source.json` identify the release and its source. Tests, visual QA fixtures, the original runnable reference and server example are excluded.

## Landing configurator and appearance

The landing page generates a complete install snippet for all characters or a chosen subset, the starting pet, placement and outer shell appearance. `appearance="light"` changes only the outer widget. Dark is the default. Each family retains its game palette.

Before first opening, the launcher shows last saved care. After opening, closing the drawer keeps the selected pet live while this page remains open, without sound or drawing. The care dot updates every five seconds when the browser permits. Close the browser tab or page to release this pet for another window. Vacation pauses both needs and growth. The welcome message can be dismissed per storage key. Settings explains browser only storage and portable backups.

## Download and release packaging

[Download lilgotchi 0.3.3](https://github.com/TaylorOD/lilgotchi/releases/download/v0.3.3/lilgotchi-0.3.3.zip). This is the named built distribution. Extract its contents directly into your asset directory.

For a reviewed source checkout on Windows, run `pwsh -File scripts/package-release.ps1`. It rebuilds the distribution and creates a zip in the temporary `lilgotchi-releases` folder named with the package version and source commit. Commit reviewed source before packaging so the filename identifies the actual source. Existing archives are never overwritten. Publish that zip as a release asset after reviewing the source and browser checks. A GitHub source archive is not the built distribution.

Real iPhone Safari, Android browser, assistive technology still require explicit verification. Browser viewport emulation does not establish those results.

## Launcher appearance

The launcher uses the selected family's shell color and current pet. Original pets also follow the E ink preference. Use `launcher="pet"` on the element or `data-launcher="pet"` on the script for the pet icon and lilgotchi text without an egg background.

The launcher exposes a CSS part. This example moves it left on mobile while leaving desktop placement unchanged:

```css
@media (max-width: 600px) {
  lil-gotchi::part(launcher) { left: 18px; right: auto; }
}
```
