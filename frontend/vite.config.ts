import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('Building with environment:', {
    mode,
    VITE_API_BASE_URL: env.VITE_API_BASE_URL,
  });
  
  return {
    plugins: [react()],
    server: {
      host: true,
      strictPort: true,
      port: 5173,
      // Removed proxy configuration as we're using absolute URLs in production
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || ''),
      'import.meta.env.VITE_AUTH_USERNAME': JSON.stringify(env.VITE_AUTH_USERNAME || process.env.VITE_AUTH_USERNAME || ''),
      'import.meta.env.VITE_AUTH_PASSWORD': JSON.stringify(env.VITE_AUTH_PASSWORD || process.env.VITE_AUTH_PASSWORD || ''),
    }
  }
})

