import { gsap } from 'gsap';

const find = (root: HTMLElement, selector: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(selector);

export function playEntrance(
  root: HTMLElement,
  reducedMotion: boolean,
  onComplete: () => void,
): gsap.core.Timeline {
  gsap.set(root, {
    opacity: 0,
    scale: reducedMotion ? 1 : 0.75,
    y: reducedMotion ? 0 : 28,
    transformOrigin: '50% 72%',
  });

  const timeline = gsap.timeline({ paused: true, onComplete });

  timeline.to(root, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: reducedMotion ? 0.2 : 0.45,
    ease: reducedMotion ? 'power1.out' : 'back.out(1.22)',
  });

  const aura = find(root, '.cow-aura');
  if (aura) {
    timeline.fromTo(
      aura,
      { opacity: 0, scale: 0.55 },
      {
        opacity: 0.9,
        scale: 1,
        duration: reducedMotion ? 0.25 : 0.7,
        ease: 'power2.out',
      },
      0,
    );
  }

  const shadow = find(root, '.cow-shadow');
  if (shadow) {
    timeline.fromTo(
      shadow,
      { opacity: 0, scaleX: 0.55 },
      {
        opacity: 1,
        scaleX: 1,
        duration: reducedMotion ? 0.25 : 0.52,
        ease: 'power2.out',
      },
      0.06,
    );
  }

  timeline.play();
  return timeline;
}

export function playExit(
  root: HTMLElement,
  reducedMotion: boolean,
  onComplete: () => void,
): gsap.core.Timeline {
  const timeline = gsap.timeline({ onComplete });

  const aura = find(root, '.cow-aura');
  if (aura) {
    timeline.to(
      aura,
      { opacity: 0, scale: 0.82, duration: reducedMotion ? 0.1 : 0.16, ease: 'power2.in' },
      0,
    );
  }

  const shadow = find(root, '.cow-shadow');
  if (shadow) {
    timeline.to(
      shadow,
      { opacity: 0, duration: reducedMotion ? 0.1 : 0.16, ease: 'power2.in' },
      0,
    );
  }

  timeline.to(
    root,
    {
      opacity: 0,
      scale: 0.88,
      y: reducedMotion ? 0 : -14,
      duration: reducedMotion ? 0.12 : 0.2,
      ease: 'power2.in',
    },
    0,
  );

  return timeline;
}

export function startIdle(root: HTMLElement, reducedMotion: boolean): gsap.core.Tween[] {
  if (reducedMotion) return [];

  const tweens: gsap.core.Tween[] = [];

  const float = find(root, '.cow-float');
  if (float) {
    tweens.push(
      gsap.to(float, {
        y: -7,
        rotation: -0.35,
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  const visual = find(root, '.cow-visual');
  if (visual) {
    tweens.push(
      gsap.to(visual, {
        scale: 1.018,
        duration: 2.7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  const head = find(root, '.cow-head');
  if (head) {
    tweens.push(
      gsap.to(head, {
        rotation: 1.1,
        y: -2.5,
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  const tail = find(root, '.cow-tail');
  if (tail) {
    tweens.push(
      gsap.to(tail, {
        rotation: 4.5,
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  return tweens;
}
