import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes, findSmoothPath, isWalkable } from '../scenes.js';

test('smooth routes reach every town stop both ways without clipping scenery', () => {
  const scene = scenes.town;
  for (const target of scene.points) for (const [from,to] of [[scene.spawn,target],[target,scene.spawn]]) {
    let anchor = from;
    const route = findSmoothPath(scene,from,to);
    assert.ok(route.length);
    for (const end of route) {
      const steps = Math.ceil(Math.hypot(end.x-anchor.x,end.y-anchor.y)*4);
      for (let i=0;i<=steps;i++) assert.ok(isWalkable(scene,anchor.x+(end.x-anchor.x)*i/steps,anchor.y+(end.y-anchor.y)*i/steps));
      anchor = end;
    }
    assert.deepEqual(anchor,{x:to.x,y:to.y});
  }
});

test('an open diagonal route needs no stair stepping turns', () => {
  const scene = {bounds:[0,0,500,500],obstacles:[],grid:8};
  assert.deepEqual(findSmoothPath(scene,{x:40,y:40},{x:400,y:320}),[{x:400,y:320}]);
});
