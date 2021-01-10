const { resolve } = require("path")

const rootDir = resolve(__dirname)

/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: "../../",
  name: "worker",
  displayName: "worker",
  testEnvironment: "node",
  transform: {
    ".(js|jsx|ts|tsx)": "@sucrase/jest-plugin",
  },
  moduleNameMapper: {
    "^@/(.*?)$": `${rootDir}/src/$1`,
  },
}
