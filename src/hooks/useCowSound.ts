import { useCallback } from 'react';
import { MOO_SOUND_FILE } from '../data/cows';

const VOLUME = 0.72;

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement | null {
  if (!MOO_SOUND_FILE || typeof window === 'undefined') return null;

  if (!audio) {
    audio = new Audio(MOO_SOUND_FILE);
    audio.preload = 'auto';
    audio.volume = VOLUME;
    audio.load();
  }

  return audio;
}

export function preloadCowSound(): void {
  getAudio();
}

export function useCowSound(): () => void {
  return useCallback(() => {
    const element = getAudio();
    if (!element) return;

    try {
      element.currentTime = 0;
    } catch {
      // Metadata may still be loading. play() below will start it once ready.
    }

    const attempt = element.play();
    if (attempt) {
      void attempt.catch(() => {
        // Autoplay can be blocked or the asset may be missing. Fail silently.
      });
    }
  }, []);
}
