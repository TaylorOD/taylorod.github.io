# Add lilgotchi to your website

Paste this into your HTML:

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/3.0.0/embed.js"></script>
```

That’s it. Slice opens first, all pets are available and sound starts off. Your site needs to allow custom JavaScript.

Want to pick the pets, colors or corner? Use the [setup tool](https://www.taylordorsett.com/lilgotchi/).

Choose a family under **Pet colors** to set its handheld and screen colors. The preview shows your choices and the install code includes them. **Return to default colors** resets that family.

Visitors can also change each pet's colors in **Settings**. Those choices stay in their browser. Gen 1 starts with a rose handheld and green screen. Gen 2 starts with a blue handheld and pale blue screen. The E ink theme keeps its black and white look.

## Host your own copy

[Download the zip](https://github.com/TaylorOD/lilgotchi/releases/download/v3.0.0/lilgotchi-3.0.0.zip), extract the whole folder into your site, then point the script at it:

```html
<script defer src="/assets/lilgotchi/embed.js"></script>
```

Keep all the files together. Use the built zip, not GitHub’s source code download.

Prefer npm? The package is available through GitHub:

```sh
npm install https://github.com/TaylorOD/lilgotchi/releases/download/v3.0.0/lilgotchi-3.0.0.tgz
```

Copy `node_modules/lilgotchi/dist` into your public assets. The widget needs that whole folder.

## Saves

Pets save in the visitor’s browser on your website. Settings has **Export save** and **Import save** for backups. There’s no account or automatic sync.

For styling and JavaScript controls, see [development](development.md).
