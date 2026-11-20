import { useCallback, useEffect, useRef, useState } from 'react';
import { COWS, type Cow } from '../data/cows';
import { placeCow, type Placement } from '../utils/layout';

export type CowPhase = 'entering' | 'exiting';

export type CowApparition = Placement & {
  key: number;
  cow: Cow;
  anchorX: number;
  anchorY: number;
};

type PendingSummon = {
  anchorX: number;
  anchorY: number;
  cowIndex: number;
};

export function useCowSwitcher() {
  const [apparition, setApparition] = useState<CowApparition | null>(null);
  const [phase, setPhase] = useState<CowPhase>('entering');

  const activeRef = useRef<CowApparition | null>(null);
  const pendingRef = useRef<PendingSummon | null>(null);
  const nextCowRef = useRef(0);
  const keyRef = useRef(0);

  const revealPending = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;

    pendingRef.current = null;
    const cow = COWS[pending.cowIndex] ?? COWS[0];

    keyRef.current += 1;
    const next: CowApparition = {
      key: keyRef.current,
      cow,
      anchorX: pending.anchorX,
      anchorY: pending.anchorY,
      ...placeCow(pending.anchorX, pending.anchorY, cow.aspectRatio),
    };

    activeRef.current = next;
    setApparition(next);
    setPhase('entering');
  }, []);

  const summon = useCallback(
    (anchorX: number, anchorY: number) => {
      if (COWS.length === 0) return;

      const cowIndex = nextCowRef.current;
      nextCowRef.current = (nextCowRef.current + 1) % COWS.length;
      pendingRef.current = { anchorX, anchorY, cowIndex };

      if (!activeRef.current) {
        revealPending();
        return;
      }

      setPhase('exiting');
    },
    [revealPending],
  );

  const finishExit = useCallback(() => {
    if (!activeRef.current) return;

    activeRef.current = null;
    revealPending();
  }, [revealPending]);

  useEffect(() => {
    let frame = 0;

    const reposition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const current = activeRef.current;
        if (!current) return;

        const next: CowApparition = {
          ...current,
          ...placeCow(current.anchorX, current.anchorY, current.cow.aspectRatio),
        };

        activeRef.current = next;
        setApparition(next);
      });
    };

    window.addEventListener('resize', reposition);
    window.addEventListener('orientationchange', reposition);
    window.addEventListener('cowverse:cow-ready', reposition);

    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('orientationchange', reposition);
      window.removeEventListener('cowverse:cow-ready', reposition);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return { apparition, phase, summon, finishExit };
}
