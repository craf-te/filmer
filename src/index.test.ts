import { getLerpCoeff, filmer } from './index';

declare const global: any;

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
    filmer.add('animation1', () => {});
    expect(filmer.animationList.length).toBe(1);
    expect(filmer.animationList.some((animation) => animation.id === 'animation1')).toBeTruthy();
  });

  test('remove', () => {
    filmer.add('animation1', () => {});
    const removeFunc = filmer.add( 'animation2', () => {});
    filmer.remove('animation1');
    expect(filmer.animationList.length).toBe(1);
    removeFunc();
    expect(filmer.animationList.length).toBe(0);
  });

  test('removeAll', () => {
    filmer.add('animation1', () => {});
    filmer.add('animation2', () => {});
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

  test('sort', () => {
    filmer.add('animation1', () => {}, 3);
    filmer.add('animation2', () => {}, -Infinity);
    filmer.add('animation3', () => {}, 0.2);
    filmer.add('animation4', () => {}, Infinity);
    filmer.add('animation5', () => {}, 8.5);

    expect(filmer.animationList[0].id).toBe('animation2');
    expect(filmer.animationList[1].id).toBe('animation3');
    expect(filmer.animationList[2].id).toBe('animation1');
    expect(filmer.animationList[3].id).toBe('animation5');
    expect(filmer.animationList[4].id).toBe('animation4');
  });
  test('reorder', () => {

    filmer.add('animation1', () => {}, 3);
    filmer.add('animation2', () => {}, -Infinity);
    filmer.add('animation3', () => {}, 0.2);
    filmer.add('animation4', () => {}, Infinity);
    filmer.add('animation5', () => {}, 8.5);

    filmer.reorder();

    expect(filmer.animationList[0].id).toBe('animation2');
    expect(filmer.animationList[0].order).toBe(-Infinity);

    expect(filmer.animationList[1].id).toBe('animation3');
    expect(filmer.animationList[1].order).toBe(0);

    expect(filmer.animationList[2].id).toBe('animation1');
    expect(filmer.animationList[2].order).toBe(1);

    expect(filmer.animationList[3].id).toBe('animation5');
    expect(filmer.animationList[3].order).toBe(2);

    expect(filmer.animationList[4].id).toBe('animation4');
    expect(filmer.animationList[4].order).toBe(Infinity);
  });
});
