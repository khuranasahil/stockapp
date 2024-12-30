import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL environment variable is required');
  }
  console.log('Using API base URL from env:', apiBaseUrl);
  
  return {
    plugins: [react()],
    server: {
      host: true,
      strictPort: true,
      port: 5173,
    },
    preview: {
      port: 5173,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': {
        VITE_API_BASE_URL: JSON.stringify(apiBaseUrl),
        VITE_AUTH_USERNAME: JSON.stringify(env.VITE_AUTH_USERNAME || 'stockapp'),
        VITE_AUTH_PASSWORD: JSON.stringify(env.VITE_AUTH_PASSWORD || 'stockapp123'),
        VITE_ALPHAVANTAGE_API_KEY: JSON.stringify(env.VITE_ALPHAVANTAGE_API_KEY || 'CLTNUH1J362422LR'),
        NODE_ENV: JSON.stringify(mode)
      },
      'import.meta.env': JSON.stringify({
        VITE_API_BASE_URL: apiBaseUrl,
        VITE_AUTH_USERNAME: env.VITE_AUTH_USERNAME,
        VITE_AUTH_PASSWORD: env.VITE_AUTH_PASSWORD,
        VITE_ALPHAVANTAGE_API_KEY: env.VITE_ALPHAVANTAGE_API_KEY,
        MODE: mode,
        DEV: mode === 'development',
        PROD: mode === 'production'
      })
    }
  }
})

