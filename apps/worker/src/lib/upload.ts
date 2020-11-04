import { promises as fs } from "fs"
import { join } from "path"

import { SCREENSHOTS_PATH, ExtractOptions } from "@anisubs/shared"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import { CONFIG } from "@/config"

const s3Client = new S3Client({
  endpoint: {
    protocol: "https",
    hostname: CONFIG.S3_DOMAIN,
    path: "",
  },
  credentials: {
    accessKeyId: CONFIG.SPACE_CLIENT,
    secretAccessKey: CONFIG.SPACE_SECRET,
  },
})

export const uploadFilesToSpace = async (
  job: ExtractOptions,
  files: string[],
) => {
  const keys = await Promise.all(
    files.map(async (filename) => {
      const key = `${job.animeId}/${filename}`

      const command = new PutObjectCommand({
        ACL: "public-read",
        Bucket: "anisubs",
        Key: key,
        Body: await fs.readFile(join(SCREENSHOTS_PATH, job.hash, filename)),
        ContentType: "image/png",
      })

      await s3Client.send(command)

      return `https://cdn.anisubs.app/${key}`
    }),
  )

  return keys
}
