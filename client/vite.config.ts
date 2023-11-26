import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/codeestetic/',
  server: {
    port: 4000,
    host: true,
    strictPort: true,
  },
});
