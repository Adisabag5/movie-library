/// <reference types="vite/client" />

// Vite types `import.meta.env` with an `any` index signature, so every env
// var reads as `any` and silently poisons whatever it touches. Declaring the
// ones this app uses restores real types — and gives a single place that
// documents what `.env.local` has to contain.
interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
