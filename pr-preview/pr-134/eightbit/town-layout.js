// World coordinates match the approved 1536 by 1024 painting.
export const townLayout = {
  width: 1536, height: 1024, north: 656, south: 800,
  arcade: { x: 1304, y: 576 }, cabin: { x: 1416, y: 264 },
  wilma: { x: 144, y: 576 }, bench: { x: 560, y: 656 },
  campus: { x: 432, y: 304 },
};

// The roads are unions of polygons, so the player cannot cut through the block,
// river or trees. Adjacent surfaces overlap at their entrances.
export const townPaths = [
  [[0,558],[1536,558],[1536,600],[0,600]],
  [[0,641],[1536,641],[1536,672],[0,672]],
  [[0,780],[1536,780],[1536,817],[0,817]],
  [[847,580],[947,580],[947,660],[972,660],[972,813],[824,813],[824,660],[847,660]],
  [[345,580],[470,580],[449,380],[449,291],[418,291],[408,380]],
  [[1438,580],[1498,580],[1486,478],[1467,427],[1408,369],[1386,344],[1385,328],[1421,281],[1432,248],[1400,248],[1394,274],[1357,321],[1356,350],[1380,387],[1435,442],[1454,485]],
  [[743,790],[815,790],[751,842],[715,917],[660,947],[565,963],[556,923],[635,907],[669,879],[696,821]],
  [[80,913],[126,887],[437,880],[620,886],[632,935],[564,991],[80,991]],
];

export function insidePolygon(x, y, points) {
  let inside = false;
  for (let i=0,j=points.length-1;i<points.length;j=i++) {
    const [ax,ay]=points[i], [bx,by]=points[j];
    if ((ay>y)!==(by>y) && x<(bx-ax)*(y-ay)/(by-ay)+ax) inside=!inside;
  }
  return inside;
}
