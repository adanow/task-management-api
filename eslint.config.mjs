import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Wymuszaj użycie const/let zamiast var
      "no-var": "error",
      "prefer-const": "error",

      // TypeScript - przydatne reguły
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // Ogólna jakość kodu
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: "error",
      curly: "error",
    },
  },
  prettierConfig,
  {
    ignores: ["dist/", "node_modules/", "src/**/*.js"],
  }
);
