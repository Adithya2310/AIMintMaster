/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PINATA_GATEWAY: string
  readonly VITE_PINATE_JWT_TOKEN: string
  // ... other env variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
