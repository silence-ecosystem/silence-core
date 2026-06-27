// File: 05_apps/patternlens/eslint.config.mjs
// ESLint v9 flat config for Next.js 15 + patternlens
// Status: ACTIVE
// Date: 2026-06-27

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    name: "patternlens/ignores",
    ignores: [
      // Build outputs
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      // Generated files
      "next-env.d.ts",
      "*.config.js",
      "**/*.config.js",
      "**/*.config.mjs",
      "_next*",
      "src_app_favicon_ico_mjs_*",
      "{src/**",
      // Tooling / coverage
      "**/.turbo/**",
      "coverage/**",
      "node_modules/**",
      "public/**",
      // Legacy / ghost / corrupted files
      "ghost _patterns/**",
      "__tests__/*.js",
      "_app/**/*.js",
      "_next*/**",
      "src_app_*/**",
      "mobile-lens/**",
      "admin-panel/**",
      "silence-objects-voice-module/**",
      "patternlens-agent/**",
      // Docs artifacts
      "docs/*.tsx",
      "docs/*.ts",
    ],
  },
  // Base JS config (for remaining .js/.mjs files)
  {
    name: "patternlens/js-base",
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        global: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn",
      "no-empty": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // TypeScript base
  ...tseslint.configs.recommended,
  // TypeScript + Next.js
  {
    name: "patternlens/ts-next",
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-empty": "off",
      "no-case-declarations": "error",
      "no-control-regex": "warn",
      "no-misleading-character-class": "warn",
      "no-unused-vars": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  // Test files — vitest globals
  {
    name: "patternlens/tests",
    files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*.ts", "**/__tests__/**/*.tsx"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
      },
    },
  },
  // JS files — disable TS-specific rules that leak from recommended
  {
    name: "patternlens/js-no-ts-rules",
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
