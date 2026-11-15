// Portions of cached scenery that should cover actors standing behind them.
export const foreground = {
  town: [[218, 490, 76, 44, 520], [762, 490, 76, 44, 520], [250, 422, 76, 78, 494]],
  arcade: [[216, 344, 96, 128, 470], [376, 344, 96, 128, 470], [536, 344, 96, 128, 470], [696, 344, 96, 128, 470], [216, 520, 96, 128, 646], [352, 584, 128, 64, 646], [536, 520, 96, 128, 646], [696, 520, 96, 128, 646]],
  cabin: [[132, 406, 136, 68, 474], [500, 328, 118, 94, 422], [489, 422, 140, 58, 480]],
};

// River trees are drawn on their own layer, never as opaque background cutouts.
export const riverTrees = [[48, 597, 1], [342, 602, .9], [640, 602, .8], [934, 607, 1.1]];
export function treeOpacity([x, y, size], actors) {
  return actors.some(actor => !actor.hidden && actor.x + 17 > x - 27 * size && actor.x - 17 < x + 32 * size && actor.y < y && actor.y > y - 94 * size) ? .28 : 1;
}
