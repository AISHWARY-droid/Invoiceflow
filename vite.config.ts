import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'), // Tells Vite your frontend is in the client folder
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Forces the final build folder into the root 'dist'
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
});