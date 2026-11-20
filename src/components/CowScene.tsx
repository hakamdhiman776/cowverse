import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { CowHeader } from './CowHeader';
import { CowModel } from './CowModel';
import { ParticleBackground } from './ParticleBackground';
import { useCowSound } from '../hooks/useCowSound';
import { useCowSwitcher } from '../hooks/useCowSwitcher';
import { useReducedMotion } from '../hooks/useReducedMotion';
import '../styles/cowverse.css';

type Ripple = {
  key: number;
  x: number;
  y: number;
};

export function CowScene() {
  const reducedMotion = useReducedMotion();
  const { apparition, phase, summon, finishExit } = useCowSwitcher();
  const playMoo = useCowSound();

  const [hasSummoned, setHasSummoned] = useState(false);
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const rippleKeyRef = useRef(0);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!event.isPrimary) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      playMoo();
      summon(event.clientX, event.clientY);

      rippleKeyRef.current += 1;
      setRipple({ key: rippleKeyRef.current, x: event.clientX, y: event.clientY });
      setHasSummoned(true);
    },
    [playMoo, summon],
  );

  return (
    <main
      className="cowverse-stage"
      onPointerDown={handlePointerDown}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="COWVERSE. Click or tap anywhere to reveal a cow."
    >
      <ParticleBackground />
      <CowHeader dimmed={hasSummoned} />

      {ripple && (
        <span
          key={`ripple-${ripple.key}`}
          className="cow-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => setRipple(null)}
          aria-hidden="true"
        />
      )}

      {apparition && (
        <CowModel
          key={apparition.key}
          apparition={apparition}
          phase={phase}
          reducedMotion={reducedMotion}
          onExitComplete={finishExit}
        />
      )}

      <div className="sr-only" aria-live="polite">
        {apparition && phase !== 'exiting'
          ? `${apparition.cow.name} the cow appeared.`
          : ''}
      </div>
    </main>
  );
}
