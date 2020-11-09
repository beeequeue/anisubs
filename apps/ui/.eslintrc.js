const { join } = require("path")

module.exports = {
  root: false,
  extends: ["../../.eslintrc.js", "plugin:vue/vue3-recommended"],
  parserOptions: {
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    warnOnUnsupportedTypeScriptVersion: false,
    project: join(__dirname, "./tsconfig.json"),
  },
}
