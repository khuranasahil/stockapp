/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_USERNAME: string
  readonly VITE_AUTH_PASSWORD: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
