import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

// Check if certificates exist (local dev only)
const certKeyPath = path.resolve(__dirname, '../../.certs/sharethrift.localhost-key.pem');
const certPath = path.resolve(__dirname, '../../.certs/sharethrift.localhost.pem');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

const baseServerConfig = {
  port: 3000,
  open: true,
};

const localServerConfig = {
  ...baseServerConfig,
  host: '0.0.0.0',
  ...(hasCerts
    ? {
        https: {
          key: fs.readFileSync(certKeyPath),
          cert: fs.readFileSync(certPath),
        },
      }
    : {}),
  open: hasCerts ? 'https://sharethrift.localhost:3000' : 'http://localhost:3000',
};

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
        react(),     
    ],
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Single vendor chunk (recommended baseline)
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    esbuild: {
      legalComments: 'none',
      treeShaking: true,
    },
    server: isDev ? localServerConfig : baseServerConfig,
  };
});
