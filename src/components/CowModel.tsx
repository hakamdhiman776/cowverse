import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { gsap } from 'gsap';
import { playEntrance, playExit, startIdle } from '../animations/cowAnimations';
import { COWS, isCowReady, markCowReady } from '../data/cows';
import type { CowApparition, CowPhase } from '../hooks/useCowSwitcher';

type CowModelProps = {
  apparition: CowApparition;
  phase: CowPhase;
  reducedMotion: boolean;
  onExitComplete: () => void;
};

export function CowModel({ apparition, phase, reducedMotion, onExitComplete }: CowModelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<gsap.core.Timeline | null>(null);
  const exitRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Tween[]>([]);
  const phaseRef = useRef(phase);
  const fallbackUsedRef = useRef(false);

  const { cow, x, y, width, height } = apparition;

  const [src, setSrc] = useState(cow.src);
  const [imageReady, setImageReady] = useState(() => isCowReady(cow));

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (isCowReady(cow)) setImageReady(true);
  }, [cow]);

  useLayoutEffect(() => {
    if (!imageReady) return;

    const root = rootRef.current;
    if (!root || phaseRef.current === 'exiting') return;

    const context = gsap.context(() => {
      const entrance = playEntrance(root, reducedMotion, () => {
        if (phaseRef.current !== 'entering') return;
        idleRef.current = startIdle(root, reducedMotion);
      });

      entranceRef.current = entrance;
    });

    return () => {
      entranceRef.current = null;
      idleRef.current.forEach((tween) => tween.kill());
      idleRef.current = [];
      exitRef.current?.kill();
      exitRef.current = null;
      context.revert();
    };
  }, [imageReady, reducedMotion]);

  useLayoutEffect(() => {
    if (phase !== 'exiting') return;

    const root = rootRef.current;
    if (!root) return;

    entranceRef.current?.kill();
    entranceRef.current = null;
    idleRef.current.forEach((tween) => tween.kill());
    idleRef.current = [];
    exitRef.current?.kill();

    const exit = playExit(root, reducedMotion, onExitComplete);
    exitRef.current = exit;

    return () => {
      exit.kill();
      if (exitRef.current === exit) exitRef.current = null;
    };
  }, [phase, reducedMotion, onExitComplete]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    markCowReady(src, image.naturalWidth, image.naturalHeight);
    setImageReady(true);
  };

  const handleError = () => {
    if (!fallbackUsedRef.current) {
      const fallback = COWS.find((entry) => entry.src !== src);

      if (fallback) {
        fallbackUsedRef.current = true;
        setImageReady(false);
        setSrc(fallback.src);
        return;
      }
    }

    setImageReady(true);
  };

  return (
    <>
      <div
        ref={rootRef}
        className={`cow-anchor ${phase === 'exiting' ? 'is-exiting' : 'is-entering'}`}
        style={{ left: x, top: y, width, height }}
        aria-hidden="true"
      >
        <div className="cow-aura" />
        <div className="cow-shadow" />
        <div className="cow-float">
          <div className="cow-visual">
            <img
              className="cow-image"
              src={src}
              alt=""
              draggable={false}
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        </div>
      </div>

      {!imageReady && (
        <span
          className="cow-loader"
          style={{ left: x + width / 2, top: y + height / 2 }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
