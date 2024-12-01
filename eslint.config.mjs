// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    ignores: [
      "dist/**/*.ts",
      "dist/**",
      "**/*.mjs",
      "eslint.config.mjs",
      "**/*.js",
    ],
  },
  {
    files: ["src/**/*.ts"],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: "advent2024-typescript",
        projectFolderIgnoreList: ["**dist**"],
      },
    },
  },
);