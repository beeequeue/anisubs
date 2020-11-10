import { UserConfig } from "vite"

const config: UserConfig = {
  esbuildTarget: "es2016",
  rollupInputOptions: {
    external: ["react"],
  },
}

export default config
