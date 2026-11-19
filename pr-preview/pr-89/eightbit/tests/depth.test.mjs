import test from 'node:test';
import assert from 'node:assert/strict';
import { riverTrees, treeOpacity } from '../depth.js';

test('river canopies fade for people and companions behind them', () => {
  for (const tree of riverTrees) {
    const [x, y] = tree;
    assert.equal(treeOpacity(tree, [{ x, y: y - 20 }]), .28);
    assert.equal(treeOpacity(tree, [{ x: x + 200, y: y - 20 }]), 1);
    assert.equal(treeOpacity(tree, [{ x, y: y + 10 }]), 1);
    assert.equal(treeOpacity(tree, [{ x, y: y - 20, hidden: 1 }]), 1);
  }
});
