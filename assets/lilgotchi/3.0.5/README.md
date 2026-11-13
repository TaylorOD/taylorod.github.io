# <img src="https://raw.githubusercontent.com/TaylorOD/lilgotchi/main/widget/egg.svg" width="24" height="28" alt=""> lilgotchi

A little pixel pet for your website. Feed it, play with it, and watch it grow.

**[Meet lilgotchi](https://www.taylordorsett.com/lilgotchi/)** · **[Character guide](https://github.com/TaylorOD/lilgotchi/blob/main/docs/characters.md)** · **[Download](https://github.com/TaylorOD/lilgotchi/releases/latest)**

<p align="center">
  <a href="https://www.taylordorsett.com/lilgotchi/">
    <img src="https://raw.githubusercontent.com/TaylorOD/lilgotchi/main/pr-screenshots/readme-three-characters.png" alt="Slice, Cypunk and Lilgotchi in their handhelds with keychains" width="1000">
  </a>
</p>

## Five little families

| Family | Starts as |
| --- | --- |
| Slice | A ball of dough |
| Cypunk | A binary egg |
| Lilgotchi | Our little logo egg |
| Gen 1 | The classic egg |
| Gen 2 | The second generation egg |

Every family starts small and follows its own growth paths. Each keeps a separate save. Gen 1 and Gen 2 include 26 characters across both generations, with source pixel artwork and regional hidden forms.

Choose **Start pet** when you are ready. Opening the drawer or switching families does not start a new pet. Each family has its own handheld and screen colors in **Settings**, with a button to return to its defaults.

Feed, play, clean up and settle down for a nap. Progress stays in your browser, with file backups in Settings.

## Put one on your website

```html
<script defer src="https://www.taylordorsett.com/lilgotchi/releases/3.0.5/embed.js"></script>
```

That’s it. No account, backend or dependencies.

Use the [setup tool](https://www.taylordorsett.com/lilgotchi/) to pick your pets and placement. The [install guide](https://github.com/TaylorOD/lilgotchi/blob/main/docs/install.md) covers hosting your own copy.

## Install with npm

```sh
npm install lilgotchi
```

Copy the whole `node_modules/lilgotchi/dist` folder into your site's public assets, then load its `embed.js`. Keep the game pages, scripts and styles together. Installing the package alone does not add the widget to your page.

[View on npm](https://www.npmjs.com/package/lilgotchi)

## Eight games to play with your lilgotchi

Catch music notes, bump an opponent, head a ball, repeat arrows, follow flags, race and shoot hoops. Or play the original guessing game. [See the games](https://github.com/TaylorOD/lilgotchi/blob/main/design/games/README.md).

## Work on it

```sh
npm start
npm test
npm run build
```

Open [localhost:4176](http://localhost:4176). The build goes in `dist`.

[Development](https://github.com/TaylorOD/lilgotchi/blob/main/docs/development.md) · [Care guide](https://github.com/TaylorOD/lilgotchi/blob/main/docs/care.md) · [Release notes](https://github.com/TaylorOD/lilgotchi/blob/main/docs/release-review.md)

## License

[MIT](https://github.com/TaylorOD/lilgotchi/blob/main/LICENSE.md) for the software. The Gen 1 and Gen 2 character artwork is third party material with separate ownership. Keep the license and [required notices](https://github.com/TaylorOD/lilgotchi/blob/main/pets/NOTICE.md) with redistributed copies.

[Credits](https://github.com/TaylorOD/lilgotchi/blob/main/docs/credits.md)
