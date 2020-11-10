const { join } = require("path")

module.exports = {
  root: false,
  extends: ["../../.eslintrc.js"],
  parserOptions: {
    project: join(__dirname, "./tsconfig.json"),
  },
  rules: {
    "import/no-default-export": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
        },
      },
    ],
  },
}
