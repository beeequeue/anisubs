import { createConnection } from "typeorm"

import { config } from "@/config"

export const connectToDatabase = async () => {
  const { username, password, host, port, database, url, ...rest } = config.db

  const connectionOptions =
    url != null ? { url } : { username, password, host, port, database }

  const connection = createConnection({
    ...rest,
    ...connectionOptions,
  })

  return connection
}
