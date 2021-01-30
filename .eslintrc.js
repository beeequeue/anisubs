module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:vue/vue3-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/vue",
  ],
  parserOptions: {
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "apps/*/tsconfig.json",
      },
    },
  },
  rules: {
    "prettier/prettier": "off",

    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [
          "builtin",
          ["external", "internal", "unknown"],
          "parent",
          ["sibling", "index"],
          "object",
        ],
        pathGroups: [
          {
            pattern: "@/**/*",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "always",
      },
    ],
    "import/no-default-export": "error",

    // Disallow importin directly from `@apollo/client` since that's for react
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@apollo/client",
            message:
              "Cannot import from `@apollo/client` as that's the react code - use `@apollo/client/core`",
          },
        ],
      },
    ],

    // Require explanations for @ts-ignore
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": false,
        "ts-ignore": "allow-with-description",
        "ts-check": true,
        "ts-nocheck": true,
        minimumDescriptionLength: 6,
      },
    ],

    // Handles by TS
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
  },
}
