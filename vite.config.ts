
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.wasm'], // allow importing WASM
  optimizeDeps: {
     exclude: ['lucide-react','@ffmpeg/ffmpeg'],
  },
  build: {
    target: 'esnext', // needed for WebAssembly
  }
});