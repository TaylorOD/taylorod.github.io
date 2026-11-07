# lilgotchi

A small virtual pet for your website, based on [plateaukao/tamagochi](https://github.com/plateaukao/tamagochi).

The widget runs without a backend or dependencies. Choose the original egg, any of the 11 original characters, Slice or Cypunk. Each choice has its own saved progress.

## Add it to a website

Paste this into your page. It creates the widget and loads the hosted files. No upload or build needed.

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.2.1/embed.js"></script>
```

Use `data-character="cyberpunk"` to start with Cypunk or `data-characters="default,slice,cyberpunk"` to limit the lineup. All element settings below work on the script with a `data-` prefix. The default is Slice with all characters available. Use one script per page unless you give each widget a different `data-storage-key`.

## Host your own copy

Download the [built zip or npm package](https://github.com/TaylorOD/lilgotchi/releases/tag/v0.2.1). The package can be installed directly from GitHub:

```sh
npm install https://github.com/TaylorOD/lilgotchi/releases/download/v0.2.1/lilgotchi-0.2.1.tgz
```

Copy `node_modules/lilgotchi/dist` to your public `/assets/lilgotchi/0.2.1/` directory, or extract the zip there. Keep the entire folder together. This is a static browser package, not a server component or a single bundled import. It is available from GitHub; an npm registry listing is separate.

```html
<script defer src="/assets/lilgotchi/0.2.1/embed.js"></script>
```

For direct control of the custom element, load the module and add the element yourself:

```html
<script type="module" src="/assets/lilgotchi/0.2.1/lilgotchi.js"></script>
<lil-gotchi character="slice" storage-key="site-pet"></lil-gotchi>
```

Use `characters="all"` for the full lineup, or limit the picker with `characters="default,mametchi,slice"`. `character` chooses the starting selection. See the [character guide](docs/characters.md) for every ID and starting stage. Add `mode="inline"` for an always visible game, or `placement="bottom-left"` to move the launcher. Each storage key has independent saves. Reusing the same key keeps a single active player.

The element exposes async `open()`, `close()` and `setCharacter(name)` methods. Events are `lilgotchi:ready`, `lilgotchi:open`, `lilgotchi:close`, `lilgotchi:characterchange` and `lilgotchi:error`. Details include only the selected character or error message, never a save.

See [installation and storage](docs/install.md) for hosting, styles, browser limits and recovery.

## Run it

Node.js is the only local tool needed. There are no package dependencies.

```sh
npm start
npm test
```

Open `http://localhost:4176`. To choose another port, use `npm start -- --port 4177`.

The demo opens the game from a pixel pet launcher. The untouched original is at `/reference/upstream.html` for source review. See [the reference review](docs/reference-review.md) for its known limits. The original sprite contact sheet is at `/reference/contact-sheet.html`. These source review pages are not part of the release.

After building, open `http://localhost:4176/dist/examples/install.html` to try a plain page using only the built files. The release includes version metadata and license notices. See the [migration instructions](docs/install.md#migrate-the-earlier-personal-site-pets) for the explicit legacy save option.

## Source and checks

The pinned upstream HTML is kept intact under `reference/`. Its exact revision and file hash are in [source.json](reference/source.json). Credits and license terms are in [NOTICE](pets/NOTICE.md).

lilgotchi is public and [MIT licensed](LICENSE.md). Keep the license and upstream notice with redistributed copies.

`npm test` runs the existing gameplay checks plus original source integrity, constants, sprite matrices, font, evolution boundary and logical rendering comparisons. These checks establish a baseline. They do not yet prove complete behavioral or browser pixel parity.

`npm run inventory` regenerates the original frame inventory from the pinned source.

See the [difference register](docs/parity-status.md) and [module map](docs/module-handoff.md) for implementation context. Outstanding verification is listed in the [release review](docs/release-review.md).

The landing page includes a setup configurator and a named release download. Use `appearance="light"` for a light outer widget. The pet display keeps its family colors. See the [release packaging instructions](docs/install.md#download-and-release-packaging) for a versioned built archive.
