import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Підтримка змінних оточення з .env файлу
  envPrefix: 'VITE_',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/components/layout/warehouseNav.js', 'src/routes/ProtectedRoute.jsx', 'src/utils/stats/**'],
    },
  },
})