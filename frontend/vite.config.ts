import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // In production, we'll always use window.location.origin
  const apiBaseUrl = mode === 'production' ? '' : (env.VITE_API_BASE_URL || 'http://localhost:80');
  console.log('Building with API base URL:', mode === 'production' ? 'window.location.origin' : apiBaseUrl);
  
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
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(''),
      'import.meta.env.VITE_AUTH_USERNAME': JSON.stringify(env.VITE_AUTH_USERNAME),
      'import.meta.env.VITE_AUTH_PASSWORD': JSON.stringify(env.VITE_AUTH_PASSWORD),
      'import.meta.env.VITE_ALPHAVANTAGE_API_KEY': JSON.stringify(env.VITE_ALPHAVANTAGE_API_KEY),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.DEV': mode === 'development',
      'import.meta.env.PROD': mode === 'production'
    }
  }
})

