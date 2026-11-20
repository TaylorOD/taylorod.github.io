import test from 'node:test';
import assert from 'node:assert/strict';
import { carouselHorses } from '../carousel.js';

test('carousel horses turn inside the pavilion and repeat without a jump', () => {
  for (let time = 0; time <= 18000; time += 100) {
    const horses = carouselHorses(time);
    assert.equal(horses.length, 6);
    for (const horse of horses) {
      assert.ok(horse.x >= 205 && horse.x <= 315);
      assert.ok(horse.y >= 709 && horse.y <= 725);
      assert.ok(Math.abs(horse.bob) <= 3);
    }
    assert.deepEqual(horses, [...horses].sort((a, b) => a.y - b.y));
  }
  assert.notDeepEqual(carouselHorses(0), carouselHorses(3000));
  assert.deepEqual(carouselHorses(0), carouselHorses(18000));
  for (const horse of carouselHorses(17999)) {
    const next = carouselHorses(18001).find(item => item.saddle === horse.saddle);
    assert.ok(Math.hypot(next.x - horse.x, next.y - horse.y) < .1);
  }
});

test('reduced motion keeps the carousel in the same pose', () => {
  assert.deepEqual(carouselHorses(0, true), carouselHorses(9000, true));
});
