import test from 'node:test';
import assert from 'node:assert/strict';
import { models } from '../review/model-catalog.js';

test('every catalog model renders all declared actions and facings without invalid geometry',()=>{
  assert.equal(models.length,44);
  assert.equal(new Set(models.map(model=>model.id)).size,models.length);
  let rectangles=0;
  const ctx=Object.fromEntries(['save','restore','translate','scale','rotate','beginPath','closePath','fill','stroke','moveTo','lineTo','quadraticCurveTo','bezierCurveTo'].map(method=>[method,(...values)=>assert.ok(values.every(Number.isFinite),method)]));
  ctx.fillRect=(...values)=>{assert.ok(values.every(Number.isFinite),'rectangle');rectangles++;};
  for(const model of models){
    assert.ok(model.actions.length&&model.directions.length,model.id);
    for(const action of model.actions)for(const direction of model.directions)for(const time of [0,65,130,195,260,325,390,455])if(!model.supports||model.supports(direction,action))model.draw(ctx,direction,action,time);
  }
  assert.ok(rectangles>10000);
});
