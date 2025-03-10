/// <reference types="vite/client" />
import { MetaMaskInpageProvider } from "@metamask/providers";

interface ImportMetaEnv {
  readonly VITE_PINATA_GATEWAY: string
  readonly VITE_PINATE_JWT_TOKEN: string
  readonly VITE_CONTRACT_ADDRESS: string
  // ... other env variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
