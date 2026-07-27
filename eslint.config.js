import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // Type-aware rules: these read the actual type graph, so they catch
      // things syntax-only linting cannot — a floating promise, an
      // unnecessary `await`, a condition that is always truthy.
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Resolves each file to its owning tsconfig the same way the editor
        // does, so the app/node project split stays correct without listing
        // the tsconfigs here and keeping that list in sync by hand.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
