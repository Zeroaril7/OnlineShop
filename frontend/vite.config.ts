import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, path.resolve(process.cwd(), '..'), '')
  const localEnv = loadEnv(mode, process.cwd(), '')

  const frontendPort =
    Number(localEnv.PORT || rootEnv.FRONTEND_PORT || localEnv.FRONTEND_PORT || process.env.FRONTEND_PORT || process.env.PORT) || 3000
  const backendPort =
    Number(localEnv.BACKEND_PORT || rootEnv.BACKEND_PORT || process.env.BACKEND_PORT || process.env.PORT) || 5000

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
