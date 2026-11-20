import { readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const COWS_DIR = fileURLToPath(new URL('./public/cows', import.meta.url));
const SOUNDS_DIR = fileURLToPath(new URL('./public/sounds', import.meta.url));
const COW_FILE = /^cow-\d+\.(png|jpe?g|webp|avif)$/i;
const MOO_FILE = /^cow-moo\.(mp3|wav|ogg|m4a)$/i;
const VIRTUAL_ID = 'virtual:cow-assets';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

function readAssets(dir: string): string[] {
  try {
    return readdirSync(dir).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function cowAssets(): Plugin {
  return {
    name: 'cow-assets',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;

      const cows = readAssets(COWS_DIR).filter((file) => COW_FILE.test(file));
      const sound = readAssets(SOUNDS_DIR).find((file) => MOO_FILE.test(file)) ?? null;

      return `export default ${JSON.stringify({ cows, sound })};`;
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (!COW_FILE.test(basename(file)) && !MOO_FILE.test(basename(file))) return;

        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.add(COWS_DIR);
      server.watcher.add(SOUNDS_DIR);
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}

export default defineConfig({
  plugins: [react(), cowAssets()],
  server: {
    host: true,
  },
});
