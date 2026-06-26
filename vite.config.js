import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Transitional (Phase 1): this project came from CRA, where .js files contain
  // JSX. esbuild only treats .jsx/.tsx as JSX by default, so we tell it to parse
  // every src .js file as JSX. Phase 2 renames these to .tsx and this block goes away.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
