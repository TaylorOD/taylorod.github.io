import test from 'node:test';
import assert from 'node:assert/strict';
import { woodlandBuildings } from '../woodland.js';
import { insidePolygon } from '../town-layout.js';
import { elkMoment } from '../scout.js';

test('fleeing elk pass behind SBG while the forest remains visible', () => {
  const hidden = (x,y) => woodlandBuildings.some(shape=>insidePolygon(x,y,shape));
  assert.equal(hidden(1260,374), false);
  assert.equal(hidden(1100,374), true);
  assert.equal(hidden(1300,470), true);
  let behind = 0, clearing = 0;
  for (let time=58000;time<116000;time+=100) {
    const x=1260-elkMoment(time).offset;
    if (x<1154) { assert.ok(hidden(x,374)); behind++; }
    if (x>1170) { assert.equal(hidden(x,374),false); clearing++; }
  }
  assert.ok(behind>0 && clearing>0);
});
