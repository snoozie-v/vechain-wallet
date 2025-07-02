import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    global: 'globalThis',
    'process.env': 'import.meta.env',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Transpile CommonJS to ES Modules
    },
  },
  optimizeDeps: {
    include: [
      '@vechain/vechain-kit',
      '@vechain/sdk-network',
      '@vechain/sdk-core',
      'ethers',
      'buffer',
      'process',
    ],
  },
});
