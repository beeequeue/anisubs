const { join } = require("path")

module.exports = {
  root: false,
  extends: ["../../.eslintrc.js"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    warnOnUnsupportedTypeScriptVersion: false,
    project: join(__dirname, "./tsconfig.json"),
  },
}
