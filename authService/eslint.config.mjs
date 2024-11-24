// @ts-nocheck

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["dist", "node_modules", "eslint.config.mjs"],
  },
  {
    rules: {
      // "no-console": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "no-unused-vars": "warning",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  }
);
