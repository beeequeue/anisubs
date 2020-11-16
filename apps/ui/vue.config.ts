import { ProjectOptions } from "@vue/cli-service"
import { Configuration } from "webpack"

const config: ProjectOptions & { devServer: Configuration["devServer"] } = {
  devServer: {
    host: "localhost",
    clientLogLevel: "warn",
  },
  // prettier-ignore
  chainWebpack: chain =>
    chain
      .stats("errors-warnings"),
}

export default config
