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
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://stockapp-lb-1859686354.us-east-2.elb.amazonaws.com:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://stockapp-lb-1859686354.us-east-2.elb.amazonaws.com:8080'),
      'import.meta.env.VITE_AUTH_USERNAME': JSON.stringify(env.VITE_AUTH_USERNAME || 'stockapp'),
      'import.meta.env.VITE_AUTH_PASSWORD': JSON.stringify(env.VITE_AUTH_PASSWORD || 'stockapp123'),
    }
  }
})

