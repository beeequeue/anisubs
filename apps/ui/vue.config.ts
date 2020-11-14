import { ProjectOptions } from "@vue/cli-service"

const config: ProjectOptions = {
  devServer: {
    progress: false,
    host: "localhost",
  },
  // prettier-ignore
  chainWebpack: chain =>
    chain
      .stats("errors-warnings"),
}

export default config
