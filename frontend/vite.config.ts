import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL;
  // Allow empty API base URL - we'll handle the fallback at runtime
  console.log('Building with API base URL:', apiBaseUrl || 'EMPTY (will use window.location.origin at runtime)');
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
      'import.meta.env': JSON.stringify({
        VITE_API_BASE_URL: env.VITE_API_BASE_URL,
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

