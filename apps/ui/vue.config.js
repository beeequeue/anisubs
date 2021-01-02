/** @type import("@vue/cli-service").ProjectOptions */
module.exports = {
  devServer: {
    host: "localhost",
    clientLogLevel: "warn",
    progress: false,
  },
  // prettier-ignore
  chainWebpack: chain => {
    chain
      .stats("errors-warnings")

    return chain
  },
}
