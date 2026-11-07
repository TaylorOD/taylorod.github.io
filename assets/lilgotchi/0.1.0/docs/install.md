# Install lilgotchi

Build with `npm run build` and copy all of `dist` into a versioned folder on your website. Keep the files together. The loader resolves its styles, modules and iframe relative to its own URL, so the install works below a nested path.

The [README](../README.md) has the install snippet. The game needs no backend or account. The optional dialogue adapter is a separate feature.

## Hosting

Serve JavaScript modules with a JavaScript MIME type. For separate origin hosting, return `Access-Control-Allow-Origin` for the host website or `*` on public static assets. Allow the game to be framed by the host website using the asset host's frame policy.

A site with a content security policy must allow the module origin in `script-src`, the stylesheet origin in `style-src`, and the game origin in `frame-src`. The game currently also needs its existing inline styles allowed within its own frame policy. No core game `connect-src` exception is needed because it makes no API requests.

`examples/nested/` demonstrates two independent inline widgets under a hostile host stylesheet. `examples/cross-origin.html` is a local test using localhost as the host and 127.0.0.1 as the asset origin. That local example is not a production CDN URL. The preview server sets public CORS headers for this test.

## Settings

`character` chooses the initial family. Saved selection wins on later visits. `storage-key` defaults to `default` and should stay stable across pages. `mode="inline"` displays the game in the page. The default drawer uses the bottom right corner, with `placement="bottom-left"` available.

Sound starts muted. The player's choice is saved per instance and restored on later opens. Audio still requires browser user interaction. A `muted` attribute forces a muted start.

Set `--lilgotchi-surface`, `--lilgotchi-text`, `--lilgotchi-accent`, `--lilgotchi-spacing` or `--lilgotchi-z` on the element to customize its shell. The game screen lives in an iframe and stays isolated from those styles.

## Progress and recovery

The host website owns saves, including when the game assets come from another origin. Each instance and family uses a versioned envelope. Export produces a portable JSON file. Import validates it and shows the family and age before replacing progress. Replacement preserves the original raw save at the same key with `:recovery` appended.

Export also works for damaged save data so it can be kept for recovery. A damaged save is never silently overwritten. A valid imported backup can replace it after confirmation.

If browser storage is unavailable or full, a session copy keeps progress for the current page visit. The UI reports that limit. Reloading or closing the browser may lose session only progress. Clearing site data removes local pets. There is no automatic cross device or cross website sync.

Modern browsers use Web Locks to allow one writer per pet. A second widget or tab shows a read only notice. Close the active instance, then choose Try again in the other. Older browsers use a 15 second lease with revision checks. A suspended writer loses its lease instead of overwriting later progress. The fallback cannot provide the same atomic cross tab guarantees as Web Locks, so current browsers are recommended for simultaneous tabs.

Closing waits for a final state snapshot before removing the frame. Disconnecting the element retains the latest action or periodic save and immediately stops its frame. An interrupted guessing game earns no result. Exporting a save leaves the game running.

## Current limits

Default retains the original presentation, with documented accessibility and bounds corrections. Slice and Cyberpunk include every life stage. Optional dialogue is implemented and needs a host callback for live replies. Browser file upload remains unverified because the Chrome extension disallows local file URLs. Import validation and replacement are covered by automated tests.

The drawer keeps its header reachable while the game and save tools scroll together. The private frame channel reports bounded content heights, including open overlays. Save and help contains export and import. Escape closes a game overlay before closing the drawer. Closing returns focus to the launcher. Inline mode does not trap focus in the host page. Reduced motion removes the drawer entrance and decorative game movement.

## Optional dialogue

Set a callback before opening the widget. The callback returns plain text, at most 280 characters. The player then turns on personality dialogue in settings. With no callback, care works normally and no dialogue requests are made.

```js
const pet = document.querySelector('lil-gotchi');
pet.dialogueAdapter = async (context, { signal }) => {
  const response = await fetch('/api/pet-dialogue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
    signal
  });
  if (!response.ok) throw new Error('Dialogue unavailable');
  return (await response.json()).text;
};
```

Set the property before adding an inline element to the document. Adapter changes apply on the next open. Never put provider keys in this callback. The endpoint is your own authenticated server and is not included or deployed by the widget. Follow `server-example/README.md` before implementing it. The public `examples/dialogue.html` uses local fake replies for review and needs no server API.

## Migrate the earlier personal site pets

Migration is off by default. Only sites that used the earlier full game should add `migrate-legacy` before connecting the element:

```html
<script type="module" src="/assets/lilgotchi/0.1.0/lilgotchi.js"></script>
<lil-gotchi storage-key="taylor-pocket-pets" migrate-legacy></lil-gotchi>
```

Use that same storage key on home and projects. The selected family is copied when first opened. `classic`, `pizza` and `cyberpunk` from `taylor-pocket-pets-p1-v1-{type}` become Default, Slice and Cyberpunk. The host checks writer ownership and validates the full state and clocks. Any existing destination, including damaged data, prevents migration. Original keys and the simplified `taylor-pocket-pets-v1` save stay untouched.

A migration receipt is recorded only after the destination can be read back from browser storage. The destination itself prevents duplicate copies if writing the receipt fails. Quota failures leave migration available to retry with Try again. Invalid legacy data shows a recovery error instead of starting over. If storage cannot be read at all, the widget can play in session mode without copying the old pet. Restore storage access and reload to retry. Export session progress before reloading if you want to retain that visit.

The lower level `SaveStore.migrateLegacy(family)` method requires ownership acquired with `acquire(family)`. Normal installations never call it automatically.

## Check a copied release

Open `dist/examples/install.html` through your local HTTP server after building. At the default development server that is `http://localhost:4176/dist/examples/install.html`. This page imports the built loader, not the source checkout. The other built examples resolve their modules relative to the same copied folder, including the separate origin example. `version.json`, `LICENSE.md` and `reference/source.json` identify the release and its source. Tests, visual QA fixtures, the original runnable reference and server example are excluded.
