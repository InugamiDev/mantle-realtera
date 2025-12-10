import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Disable formatting-related rules so Prettier can be the single source of truth.
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files - no need to lint these
    "src/generated/**",
    // Large mock data file exceeds BABEL limit
    "src/data/mockProjects.ts",
    // Node modules and artifacts
    "node_modules/**",
    "coverage/**",
    "dist/**",
    // Smart contracts folder (separate hardhat project)
    "contracts/**",
  ]),
]);

export default eslintConfig;
