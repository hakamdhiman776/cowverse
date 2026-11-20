/// <reference types="vite/client" />

declare module 'virtual:cow-assets' {
  const assets: {
    cows: string[];
    sound: string | null;
  };
  export default assets;
}
