# Add lilgotchi to your website

Paste this into your HTML:

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/3.0.1/embed.js"></script>
```

That’s it. Slice opens first, all pets are available and sound starts off. Choose **Start pet** to begin. Browsing families does not start them. Your site needs to allow custom JavaScript.

Want to pick the pets, launcher or corner? Use the [setup tool](https://www.taylordorsett.com/lilgotchi/).

Change each pet's handheld and screen colors inside its **Settings**. Switch to another family to customize that pet separately. **Return to default colors** resets the selected family's colors. These choices stay in your browser. The E ink theme keeps its black and white look.

## Host your own copy

[Download the zip](https://github.com/TaylorOD/lilgotchi/releases/download/v3.0.1/lilgotchi-3.0.1.zip), extract the whole folder into your site, then point the script at it:

```html
<script defer src="/assets/lilgotchi/embed.js"></script>
```

Keep all the files together. Use the built zip, not GitHub’s source code download.

Prefer npm? Install the package from GitHub. It is not published on the npm registry:

```sh
npm install https://github.com/TaylorOD/lilgotchi/releases/download/v3.0.1/lilgotchi-3.0.1.tgz
```

Copy `node_modules/lilgotchi/dist` into your public assets. The widget needs that whole folder.

## Saves

Pets save in the visitor’s browser on your website. Settings has **Export save** and **Import save** for backups. There’s no account or automatic sync.

For styling and JavaScript controls, see [development](development.md).
