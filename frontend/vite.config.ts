import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL environment variable is required');
  }
  console.log('Building with environment:', {
    mode,
    VITE_API_BASE_URL: apiBaseUrl,
  });
  
  return {
    plugins: [react()],
    server: {
      host: true,
      strictPort: true,
      port: 5173,
      proxy: mode === 'development' ? {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        }
      } : undefined,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env': JSON.stringify({
        VITE_API_BASE_URL: apiBaseUrl,
        VITE_AUTH_USERNAME: env.VITE_AUTH_USERNAME || 'stockapp',
        VITE_AUTH_PASSWORD: env.VITE_AUTH_PASSWORD || 'stockapp123',
        MODE: mode,
        DEV: mode === 'development',
        PROD: mode === 'production',
      })
    }
  }
})

