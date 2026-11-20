import { useMemo, type CSSProperties } from 'react';

type Particle = {
  id: number;
  left: string;
  top: string;
  size: string;
  opacity: number;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
};

const PARTICLE_COUNT = 34;

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2.4}px`,
    opacity: 0.1 + Math.random() * 0.42,
    duration: `${13 + Math.random() * 22}s`,
    delay: `-${Math.random() * 26}s`,
    driftX: `${(Math.random() - 0.5) * 54}px`,
    driftY: `${-24 - Math.random() * 68}px`,
  }));
}

export function ParticleBackground() {
  const particles = useMemo(createParticles, []);

  return (
    <div className="cow-atmosphere" aria-hidden="true">
      <div className="cow-orb cow-orb-warm" />
      <div className="cow-orb cow-orb-cool" />
      <div className="cow-orb cow-orb-honey" />
      <div className="cow-ambient" />
      <div className="cow-vignette" />

      <div className="cow-dust-layer">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="cow-dust"
            style={
              {
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                '--dust-opacity': particle.opacity,
                '--dust-duration': particle.duration,
                '--dust-delay': particle.delay,
                '--dust-drift-x': particle.driftX,
                '--dust-drift-y': particle.driftY,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="cow-grain" />
    </div>
  );
}
