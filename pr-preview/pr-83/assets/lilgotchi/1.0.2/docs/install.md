# Add lilgotchi to your website

Paste this into your HTML:

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/1.0.2/embed.js"></script>
```

That’s it. Slice opens first, all pets are available and sound starts off. Your site needs to allow custom JavaScript.

Want to pick the pets, colors or corner? Use the [setup tool](https://www.taylordorsett.com/lilgotchi/).

## Make it yours

Add these settings to the script:

**Starting pet:** `data-character="lilgotchi"`

**Available families:** `data-characters="slice,cyberpunk"` for just those two. Use `all` for everyone.

**Corner:** `data-placement="bottom-left"`. Choose `bottom-right`, `bottom-left`, `top-right` or `top-left`. Top corners open downward.

**Pet button without an egg:** `data-launcher="pet"`

**Light outer panel:** `data-appearance="light"`

**Separate saves:** `data-storage-key="my-pets"`

**Always start muted:** `data-muted`

Keep your storage key the same when updating. Give separate widgets different keys.

A saved pet opens before the starting pet. See the [character guide](characters.md) for all choices.

## Host your own copy

[Download the zip](https://github.com/TaylorOD/lilgotchi/releases/download/v1.0.2/lilgotchi-1.0.2.zip), extract the whole folder into your site, then point the script at it:

```html
<script defer src="/assets/lilgotchi/embed.js"></script>
```

Keep all the files together. Use the built zip, not GitHub’s source code download.

Prefer npm? The package is available through GitHub:

```sh
npm install https://github.com/TaylorOD/lilgotchi/releases/download/v1.0.2/lilgotchi-1.0.2.tgz
```

Copy `node_modules/lilgotchi/dist` into your public assets. The widget needs that whole folder.

## Saves

Pets save in the visitor’s browser on your website. Settings has **Export save** and **Import save** for backups. There’s no account or automatic sync.

For styling and JavaScript controls, see [development](development.md).
