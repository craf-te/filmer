declare const global: any;

import { getLerpCoeff, filmer } from './index';

test('getLerpCoeff', () => {
  const coeff = 0.5;
  const deltaTime = 0.016;
  const targetFps = 60;
  const expected = 1 - (1 - coeff) ** (deltaTime * targetFps);

  const result = getLerpCoeff(coeff, deltaTime, targetFps);
  expect(result).toBe(expected);
});

describe('filmer', () => {
  beforeAll(() => {
    global.requestAnimationFrame = () => Math.random();
    global.cancelAnimationFrame = () => {};
  });
  afterEach(() => {
    filmer.removeAll();
  });

  test('initial state', () => {
    expect(filmer.currentTime).toBe(0);
    expect(filmer.isAnimating).toBe(false);
    expect(filmer.animationList.length).toBe(0);
  });

  test('add', () => {
    filmer.add({
      id: 'animation1',
      update: () => {},
    });
    expect(filmer.animationList.length).toBe(1);
    expect(filmer.animationList.some((animation) => animation.id === 'animation1')).toBeTruthy();
  });

  test('remove', () => {
    filmer.add({
      id: 'animation1',
      update: () => {},
    });
    const removeFunc = filmer.add({
      id: 'animation2',
      update: () => {},
    });
    filmer.remove('animation1');
    expect(filmer.animationList.length).toBe(1);
    removeFunc();
    expect(filmer.animationList.length).toBe(0);
  });

  test('removeAll', () => {
    filmer.add({
      id: 'animation1',
      update: () => {},
    });
    filmer.add({
      id: 'animation2',
      update: () => {},
    });
    filmer.removeAll();
    expect(filmer.animationList.length).toBe(0);
  });

  test('start & stop', () => {
    expect(filmer.isAnimating).toBe(false);
    filmer.start();
    expect(filmer.isAnimating).toBe(true);
    expect(filmer.currentTime).toBeGreaterThan(0);
    filmer.stop();
    expect(filmer.isAnimating).toBe(false);
    expect(filmer.currentTime).toBeGreaterThan(0);
  });

  test('start & reset', () => {
    filmer.start();
    expect(filmer.isAnimating).toBe(true);
    expect(filmer.currentTime).toBeGreaterThan(0);
    filmer.reset();
    expect(filmer.isAnimating).toBe(false);
    expect(filmer.currentTime).toBe(0);
  });

  test('reorder', () => {
    filmer.add({
      id: 'animation1',
      order: 1,
      update: () => {},
    });
    filmer.add({
      id: 'animation2',
      order: 2,
      update: () => {},
    });
    filmer.add({
      id: 'animation3',
      order: 0,
      update: () => {},
    });
    expect(filmer.animationList[0].id).toBe('animation3');
    expect(filmer.animationList[1].id).toBe('animation1');
    expect(filmer.animationList[2].id).toBe('animation2');
  });
});
