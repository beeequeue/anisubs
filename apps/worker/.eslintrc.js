const { join } = require("path")

module.exports = {
  root: false,
  extends: ["../../.eslintrc.js"],
  parserOptions: {
    project: join(__dirname, "./tsconfig.json"),
  },
}
