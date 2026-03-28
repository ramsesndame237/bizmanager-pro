import pluginVue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.output/**",
      "**/.nuxt/**",
      "**/target/**",
      "**/coverage/**",
      "**/.turbo/**",
      "pnpm-lock.yaml",
    ],
  },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      // Enforce strict typing — no 'any'
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      // No empty catch blocks
      "no-empty": ["error", { allowEmptyCatch: false }],
      // No console.log in committed code
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },

  // Vue files
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
    },
    processor: pluginVue.processors[".vue"],
    rules: {
      ...pluginVue.configs["vue3-recommended"].rules,
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "error",
    },
  },

  // Disable formatting rules (handled by Prettier)
  prettier,
];
