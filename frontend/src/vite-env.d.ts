/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_USERNAME: string
  readonly VITE_AUTH_PASSWORD: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_USERNAME: string
  readonly VITE_AUTH_PASSWORD: string
  readonly VITE_ALPHAVANTAGE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
