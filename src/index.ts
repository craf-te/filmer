type AnimationProps = {
  deltaTime: number;
  time: number;
};

type AnimationFunction = (props: AnimationProps) => void;

type Animation = {
  id: string;
  order: number;
  update: AnimationFunction;
};

type AddedAnimation = Omit<Animation, 'order'> & Partial<Pick<Animation, 'order'>>;

export function getLerpCoeff(coeff: number, deltaTime: number, targetFps: number = 60) {
  const frameStretch = deltaTime * targetFps;
  const adjustedCoeff = 1 - (1 - coeff) ** frameStretch;
  return adjustedCoeff;
}

class Filmer {
  private time: number = 0;

  private deltaTime: number = 0;

  private lastTimestamp: number = 0;

  private animationCount: number = 0;

  private animationId: number | null = null;

  private animations: Animation[] = [];

  get animationList() {
    return this.animations;
  }

  get currentTime() {
    return this.time;
  }

  get isAnimating() {
    return this.animationId !== null;
  }

  getLerpCoeff(coeff: number, targetFPS: number = 60): number {
    return getLerpCoeff(coeff, this.deltaTime, targetFPS);
  }

  add(animation: AddedAnimation): () => void {
    const needsRestarting = this.animationId !== null;
    if (needsRestarting) this.stop();
    const order = animation.order ?? this.animationCount;
    this.animations.push({ ...animation, order });
    this.sortAnimationsArray();
    if (needsRestarting) this.start();
    this.animationCount += 1;
    return () => this.remove(animation.id);
  }

  remove(id: string): void {
    const needsRestarting = this.animationId !== null;
    if (needsRestarting) this.stop();
    const newAnimations = this.animations.filter((animation) => animation.id !== id);
    this.animations = newAnimations;
    if (needsRestarting) this.start();
  }

  removeAll(): void {
    this.stop();
    this.animations = [];
    this.animationCount = 0;
  }

  start(): void {
    this.lastTimestamp = performance.now();
    this.animate();
  }

  stop(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.lastTimestamp = 0;
    this.animationId = null;
  }

  reset(needsAllRemoving: boolean = true): void {
    this.stop();
    this.time = 0;
    if (needsAllRemoving) this.removeAll();
  }

  reorder(): void {
    this.sortAnimationsArray();
    const renumbered = this.animations.map((animation, index) => ({
      ...animation,
      order: index,
    }));
    this.animationCount = renumbered.length;
    this.animations = renumbered;
  }

  protected animate(): void {
    const timestamp = performance.now();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    this.deltaTime = (timestamp - this.lastTimestamp) * 0.001;
    this.time += this.deltaTime;
    this.animations.forEach((animation) => {
      animation.update({ deltaTime: this.deltaTime, time: this.time });
    });
    this.lastTimestamp = timestamp;
  }

  private sortAnimationsArray(): void {
    this.animations.sort((a, b) => a.order - b.order);
  }
}

export const filmer = new Filmer();
