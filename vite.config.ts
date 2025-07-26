import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'public', dest: '.' },
      ],
    }),
  ],
  resolve: { alias: { '@cookiri-extension': resolve(__dirname, './src') } },
  build: {
    rollupOptions: {
      input: { popup: resolve(__dirname, 'popup.html') },
      output: { dir: 'dist' },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: false,
});
