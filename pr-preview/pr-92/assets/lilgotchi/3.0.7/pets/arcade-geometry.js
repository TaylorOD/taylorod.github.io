export const FIELD_WIDTH = 32;
export const FIELD_HEIGHT = 24;
export const FALLING_FIELD_HEIGHT = 40;

export function headingPose(sprite, center, jump = 0) {
  const width = Math.max(...sprite.map(row => row.length));
  const left = Math.max(0, Math.min(FIELD_WIDTH - width, Math.round(center - width / 2)));
  const top = Math.round(FALLING_FIELD_HEIGHT - sprite.length - jump);
  const occupiedRows = sprite.flatMap((row, index) => row.some(Boolean) ? [index] : []);
  const highest = Math.min(...occupiedRows);
  const lowest = Math.max(...occupiedRows);
  const headLimit = highest + Math.floor((lowest - highest) / 2);
  const head = [];
  for (let column = 0; column < width; column++) {
    const row = sprite.findIndex(line => !!line[column]);
    if (row >= 0 && row <= headLimit) head.push({x:left + column, y:top + row});
  }
  return {left, top, width, height:sprite.length, head};
}
