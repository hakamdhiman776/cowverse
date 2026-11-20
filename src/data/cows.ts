import assetManifest from 'virtual:cow-assets';

export type Cow = {
  id: string;
  name: string;
  src: string;
  aspectRatio: number;
};

const PROVIDED_ASPECT_RATIO = 1.15;

const NAMES = [
  'Buttercup',
  'Clover',
  'Mocha',
  'Daisy',
  'Willow',
  'Hazel',
  'Pepper',
  'Nori',
];

export const COWS: Cow[] = assetManifest.cows.map((file, index) => ({
  id: file.replace(/\.[^.]+$/, ''),
  name: NAMES[index] ?? `Cow ${index + 1}`,
  src: `/cows/${file}`,
  aspectRatio: PROVIDED_ASPECT_RATIO,
}));

export const MOO_SOUND_FILE = assetManifest.sound
  ? `/sounds/${assetManifest.sound}`
  : null;

const imageCache = new Map<string, HTMLImageElement>();
const readyImages = new Set<string>();
let preloadPromise: Promise<void> | null = null;

export function isCowReady(cow: Cow): boolean {
  return readyImages.has(cow.src);
}

export function getCachedCowImage(src: string): HTMLImageElement | undefined {
  return imageCache.get(src);
}

export function markCowReady(src: string, width: number, height: number): void {
  const cow = COWS.find((entry) => entry.src === src);
  if (cow && width > 0 && height > 0) {
    cow.aspectRatio = width / height;
  }
  readyImages.add(src);
  window.dispatchEvent(new Event('cowverse:cow-ready'));
}

function waitForLoad(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
}

async function decodeImage(image: HTMLImageElement): Promise<void> {
  if (typeof image.decode === 'function') {
    try {
      await image.decode();
      return;
    } catch {
      await waitForLoad(image);
      return;
    }
  }

  await waitForLoad(image);
}

async function loadAllCows(): Promise<void> {
  await Promise.all(
    COWS.map(async (cow) => {
      if (readyImages.has(cow.src)) return;

      let image = imageCache.get(cow.src);
      if (!image) {
        image = new Image();
        image.decoding = 'async';
        image.src = cow.src;
        imageCache.set(cow.src, image);
      }

      await decodeImage(image);

      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        cow.aspectRatio = image.naturalWidth / image.naturalHeight;
        readyImages.add(cow.src);
      }
    }),
  );

  window.dispatchEvent(new Event('cowverse:cow-ready'));
}

export function preloadCows(): Promise<void> {
  if (!preloadPromise) preloadPromise = loadAllCows();
  return preloadPromise;
}
