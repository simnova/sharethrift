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

export default defineConfig((_env) => {
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            'ui-core': ['antd/lib/button', 'antd/lib/layout', 'antd/lib/space', 'antd/lib/typography'],
            'ui-forms': ['antd/lib/form', 'antd/lib/input', 'antd/lib/select', 'antd/lib/checkbox', 'antd/lib/radio'],
            'ui-data': ['antd/lib/table', 'antd/lib/list', 'antd/lib/pagination'],
            'ui-feedback': ['antd/lib/modal', 'antd/lib/message', 'antd/lib/notification'],
            icons: ['@ant-design/icons'],
            graphql: ['@apollo/client', 'graphql'],
            router: ['react-router-dom'],
            utils: ['lodash', 'dayjs', 'crypto-hash'],
          },
        },
      },
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
    },
    server: isDev ? localServerConfig : baseServerConfig,
  };
});
