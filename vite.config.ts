/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  // Agrega aquí otras variables de entorno si es necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}