# Add lilgotchi to your website

Paste this into your HTML:

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/3.0.2/embed.js"></script>
```

That’s it. Slice opens first, all pets are available and sound starts off. Choose **Start pet** to begin. Browsing families does not start them. Your site needs to allow custom JavaScript.

Want to pick the pets, launcher or corner? Use the [setup tool](https://www.taylordorsett.com/lilgotchi/).

Change each pet's handheld and screen colors inside its **Settings**. Switch to another family to customize that pet separately. **Return to default colors** resets the selected family's colors. These choices stay in your browser. The E ink theme keeps its black and white look.

## Host your own copy

[Download the zip](https://github.com/TaylorOD/lilgotchi/releases/download/v3.0.2/lilgotchi-3.0.2.zip), extract the whole folder into your site, then point the script at it:

```html
<script defer src="/assets/lilgotchi/embed.js"></script>
```

Keep all the files together. Use the built zip, not GitHub’s source code download.

## Install with npm

The package is on [npm](https://www.npmjs.com/package/lilgotchi):

```sh
npm install lilgotchi
```

Copy the entire `node_modules/lilgotchi/dist` folder to your site as `/assets/lilgotchi`, then use the self hosted script above. The widget needs the game HTML, scripts and styles together. Installing the package alone does not add it to your page.

For an exact version, use `npm install lilgotchi@3.0.2`. The GitHub release also includes the same npm tarball.

## Saves

Pets save in the visitor’s browser on your website. Settings has **Export save** and **Import save** for backups. There’s no account or automatic sync.

For styling and JavaScript controls, see [development](development.md).
