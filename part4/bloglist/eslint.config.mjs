import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ✅ Logic-focused rules only
      eqeqeq: "error",
      "no-console": "off",
    },
  },
  {
    // ✅ Ignore build or output folders
    ignores: ["dist/**"],
  },
];
