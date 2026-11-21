# missoula art review

Open `models.html` for the full cast and individual animation frames. Open `index.html` to walk through every interaction using the game code. The original scene layouts and trees are the source of truth.

There are 44 model entries. That includes two unused deer entries from the older scene. Player, neighbor, student and dog walker models share the human pose system. Joggers, cyclists, river visitors, companions and wildlife use their actual game renderers. Sleep and happy companion poses share silhouettes between directions. The catalog exposes those existing states instead of inventing animation frames that the game does not use.

The scene links show the main page and exported town, arcade, cabin and rooftop views. Save scene image exports the complete current scene as a PNG, with the same characters, pixel grid and palette as the moving preview. Saved PNGs are snapshots, not replacement backgrounds.

## changes checked

The town keeps its original forest and carousel. People use a shared town scale. The Wilma marquee says LIVE MUSIC, leaving one WILMA sign.

The player and neighbors share explicit front, back and side poses. Walking shoes stay attached to the legs. Carrying keeps the hands on the pizza box. The companion has a clear spawn and more following space indoors.

Cabinet and pinball hands align with the controls. The bartender stays behind the counter. Poker players sit behind the tabletop. The desk interaction uses the chair and keyboard. The pet approach stands beside the bed. Leashes and the fishing rod attach to the hands.

## validation

All 60 tests pass. These cover every route in both directions, each destination from four starting facings, hand reach, seat height, foot attachment and every declared model pose. Browser checks covered the main page, all four rooms, cabinet and bar approaches, the desk, the pet approach, carrying near the stairs and the carousel. Desktop rendering was roughly 2 to 4 ms per frame on the review machine. Phone checks used a Chrome viewport.

These are review changes. The palette and grid enforce an 8 bit inspired style. They do not reproduce the hardware restrictions of a specific console. Route and geometry tests do not replace looking at movement and occlusion in the browser.
