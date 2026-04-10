import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: Number(process.env.PORT) || undefined,
      open: 'https://admin.sharethrift.localhost:1355',
    },
  };
});
