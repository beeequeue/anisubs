import { sync as remove } from "rimraf"
import { default as TorrentClient, Torrent } from "webtorrent"

import { ExtractOptions } from "./types"
import { formatBytes, throttle } from "./utils"

const TIMEOUT_MS = 1000 * 60 * 5

export class WebTorrent {
  static client = new TorrentClient()

  static async getMetadata(magnetUri: string) {
    return new Promise<Torrent>((resolve, reject) => {
      this.client.add(magnetUri, (torrent) => {
        console.log(
          `Getting metadata for:\n${torrent.infoHash} "${torrent.name}"`,
        )

        // Deselect all files so we don't download anything
        torrent.files.forEach((file) => file.deselect())
        torrent.deselect(0, torrent.pieces.length - 1, 0)

        torrent.addListener("error", reject)
        torrent.addListener("noPeers", () =>
          reject(`[${torrent.name}]: Found no peers.`),
        )

        torrent.addListener("download", () => {
          resolve(torrent)

          setTimeout(() => {
            torrent.destroy()

            if (process.env.NODE_ENV === "production") {
              // If we destroy it immediately it breaks
              remove(torrent.path)
            }
          }, 0)
        })
      })
    })
  }

  static async download(job: ExtractOptions): Promise<TorrentFile> {
      this.client.add(job.sourceUri, (torrent) => {
        console.log(`Downloading:\n${torrent.infoHash} "${torrent.name}"`)

        const timeout = setTimeout(() => {
          torrent.destroy()
          remove(torrent.path)
          reject(`[${torrent.name}]: Timed out downloading.`)
        }, TIMEOUT_MS)

        if (torrent.files.length > 1) {
          torrent.files.forEach(file => file.deselect())
          torrent.deselect(0, torrent.pieces.length - 1, 0)

          const correctFile = torrent.files.find((file) => file.name === job.fileName)

          if (correctFile == null) {
            torrent.destroy()
            remove(torrent.path)
            return reject(
              `[${torrent.name}]: Failed to find wanted file in torrent.`,
            )
          }

          correctFile.select()
        }

        torrent.addListener("error", reject)
        torrent.addListener("noPeers", () =>
          reject(`[${torrent.name}]: Found no peers.`),
        )

        torrent.addListener("done", () => {
          console.log(`Downloaded ${torrent.name}!`)

          clearTimeout(timeout)
          resolve(torrent)
        })
      })
    })
  }
}

const throttledLogger = throttle(console.log, 2500)

WebTorrent.client.on("torrent", (torrent) => {
  const prefix = `[${torrent.name}]:`

  torrent.on("done", () => {
    console.log(`${prefix} Finished.`)
  })

  torrent.addListener("download", () => {
    throttledLogger(
      `${prefix} ${formatBytes(torrent.downloaded)} ${(
        torrent.progress * 100
      ).toFixed(0)}%`,
    )
  })

  torrent.addListener("upload", () => {
    throttledLogger(
      `${prefix} Uploaded ${formatBytes(torrent.uploaded)}. Currently at a ${
        torrent.ratio
      } ratio.`,
    )
  })
})
