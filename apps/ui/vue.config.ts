import { ProjectOptions } from "@vue/cli-service"

const config: ProjectOptions = {
  devServer: {
    progress: false,
  },
  // prettier-ignore
  chainWebpack: chain =>
    chain
      .stats("errors-warnings"),
}

export default config
