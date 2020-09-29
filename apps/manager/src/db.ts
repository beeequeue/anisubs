import { createConnection } from "typeorm"

import { config } from "@/config"

export const connectToDatabase = async () => {
  const connection = createConnection(config.db)

  return connection
}
