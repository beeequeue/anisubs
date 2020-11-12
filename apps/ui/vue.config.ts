import { ProjectOptions } from "@vue/cli-service"

const config: ProjectOptions = {
  // prettier-ignore
  chainWebpack: chain =>
    chain
      .stats("errors-warnings"),
}

export default config
