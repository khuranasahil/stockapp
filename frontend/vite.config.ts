import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://stockapp-lb-1859686354.us-east-2.elb.amazonaws.com';
  console.log('Using API base URL:', apiBaseUrl);
  console.log('Building with environment:', {
    mode,
    VITE_API_BASE_URL: apiBaseUrl,
    VITE_AUTH_USERNAME: env.VITE_AUTH_USERNAME,
    VITE_AUTH_PASSWORD: env.VITE_AUTH_PASSWORD,
    VITE_ALPHAVANTAGE_API_KEY: env.VITE_ALPHAVANTAGE_API_KEY
  });
  
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
      'import.meta.env': JSON.stringify({
        VITE_API_BASE_URL: apiBaseUrl,
        VITE_AUTH_USERNAME: env.VITE_AUTH_USERNAME || 'stockapp',
        VITE_AUTH_PASSWORD: env.VITE_AUTH_PASSWORD || 'stockapp123',
        VITE_ALPHAVANTAGE_API_KEY: env.VITE_ALPHAVANTAGE_API_KEY,
        MODE: mode,
        DEV: mode === 'development',
        PROD: mode === 'production'
      })
    }
  }
})

