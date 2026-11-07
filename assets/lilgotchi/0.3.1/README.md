# 🥚 lilgotchi

A little pixel pet for your website. Feed it, play with it, and watch it grow.

**[Try it live](https://www.taylordorsett.com/lilgotchi/)** · **[Install guide](docs/install.md)** · **[Releases](https://github.com/TaylorOD/lilgotchi/releases)**

<p align="center">
  <a href="https://www.taylordorsett.com/lilgotchi/">
    <img src="https://raw.githubusercontent.com/TaylorOD/lilgotchi/main/pr-screenshots/release-030-mobile.jpg" alt="lilgotchi running in its compact pet widget" width="320">
  </a>
</p>

## Meet the pets

| Pet type | Starts as | Character ID |
| --- | --- | --- |
| Original | The classic egg | `default` |
| Slice | A little ball of dough | `slice` |
| Cypunk | A binary egg | `cyberpunk` |
| Lilgotchi | Its own pixel egg | `lilgotchi` |

Each pet type has its own growth stages and saved progress. Original pets grow into original characters, Slice stays pizza, Cypunk stays digital, and Lilgotchi stays an egg. Switching types opens a separate saved pet. You can also start with any of the 11 original characters. Show everyone or pick your favorites with the [character guide](docs/characters.md).

## What it does

* **Raise a pet.** Feeding, games, sleep, cleaning, health, care grades, and evolution. Eggs hatch after 90 seconds.
* **Keep it close.** A small launcher opens the drawer. Or put the whole game directly in your page.
* **Make it yours.** Four pet types, day and night scenery, optional sound, LCD scanlines, and an E ink look for the original pets.
* **Come back later.** Progress saves in the browser. Vacation pauses care and growth. Download a save file to keep a backup or move it elsewhere.
* **Drop it in.** Plain JavaScript with no dependencies, account, or backend. Each visitor gets their own pet.

## Add it to your site

Paste this into your HTML:

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.3.1/embed.js"></script>
```

That opens with Slice, all characters available, and sound off. Your site needs to allow custom JavaScript. Saves belong to your site and stay in the visitor's browser.

This example offers only Original, Slice, Cypunk and Lilgotchi. The button that opens the widget shows a pet icon and the word lilgotchi, without an egg behind it. The game display still keeps its egg shape.

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/0.3.1/embed.js" data-character="lilgotchi" data-characters="default,slice,cyberpunk,lilgotchi" data-launcher="pet"></script>
```

### Options

| Script setting | What it changes |
| --- | --- |
| `data-character="slice"` | Starting pet. An existing saved selection takes priority. |
| `data-characters="all"` | Available pets. Use a comma separated list to limit the picker. |
| `data-launcher="pet"` | Use a pet icon and text for the launcher button. This does not change the game display. |
| `data-placement="bottom-left"` | Move the launcher from the bottom right. |
| `data-mode="inline"` | Keep the game visible in the page instead of a drawer. |
| `data-appearance="light"` | Use a light outer panel. |
| `data-storage-key="my-pets"` | Separate this widget's saves. Keep the key stable between updates. |
| `data-muted` | Start muted even if sound was previously enabled. |

Use one script per page, or give each widget its own storage key. The custom element accepts the same options without `data-`. Its launcher can be styled with `lil-gotchi::part(launcher)`.

The [install guide](docs/install.md) covers hosting your own copy, the GitHub package, custom styles, JavaScript methods, events, and save recovery. The [live demo](https://www.taylordorsett.com/lilgotchi/) also builds a snippet for you.

## Run it locally

Node.js is the only tool needed. There are no dependencies to install.

```sh
npm start
```

Open [localhost:4176](http://localhost:4176). Then run the checks or build the static package:

```sh
npm test
npm run build
```

The build goes into `dist`. Keep that whole folder together when hosting it. Preview the built example at [localhost:4176/dist/examples/install.html](http://localhost:4176/dist/examples/install.html).

For deeper work, see the [module map](docs/module-handoff.md), [gameplay comparisons](docs/parity-status.md), and [release review](docs/release-review.md).

## License

[MIT licensed](LICENSE.md). Free to use, change and share. Keep the license and [required notices](pets/NOTICE.md) with redistributed copies.

[Credits](docs/credits.md) · [Release notes](docs/release-review.md)
