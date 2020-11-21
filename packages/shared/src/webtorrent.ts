import { sync as remove } from "rimraf"
import { default as TorrentClient, Torrent, TorrentFile } from "webtorrent"

import { DOWNLOADS_PATH } from "./constants"
import { ExtractOptions } from "./types"
import { formatBytes, throttle } from "./utils"

const TIMEOUT_MS = 1000 * 60 * 30

export class WebTorrent {
  static client = new TorrentClient()

  static async getMetadata(magnetUri: string) {
    return new Promise<Torrent>((resolve, reject) => {
      this.client.add(magnetUri, { path: DOWNLOADS_PATH }, (torrent) => {
        console.log(
          `Getting metadata for:\n${torrent.infoHash} "${torrent.name}"`,
        )

        torrent.addListener("error", reject)
        torrent.addListener("noPeers", () =>
          reject(`[${torrent.name}]: Found no peers.`),
        )

        torrent.addListener("download", () => {
          // Deselect all files so we don't download anything
          torrent.files.forEach((file) => file.deselect())
          torrent.deselect(0, torrent.pieces.length - 1, 0)

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
    return new Promise<TorrentFile>((resolve, reject) => {
      this.client.add(job.sourceUri, { path: DOWNLOADS_PATH }, (torrent) => {
        console.log(`Downloading:\n${torrent.infoHash} "${torrent.name}"`)

        const timeout = setTimeout(() => {
          torrent.destroy()

          setTimeout(() => {
            remove(torrent.path)
            reject(`[${torrent.name}]: Timed out downloading.`)
          }, 50)
        }, TIMEOUT_MS)

        const correctFileIndex =
          torrent.files.length > 1
            ? torrent.files.findIndex((file) => file.name === job.fileName)
            : 0

        if (torrent.files.length > 1) {
          if (correctFileIndex === -1) {
            torrent.destroy()
            remove(torrent.path)
            return reject(
              `[${torrent.name}]: Failed to find wanted file in torrent.`,
            )
          }

          torrent.files.forEach((file) => file.deselect())
          torrent.deselect(0, torrent.pieces.length - 1, 0)

          torrent.files[correctFileIndex].select()
        }

        torrent.addListener("error", reject)
        torrent.addListener("noPeers", () =>
          reject(`[${torrent.name}]: Found no peers.`),
        )

        torrent.addListener("done", () => {
          console.log(`Downloaded ${torrent.name}!`)

          clearTimeout(timeout)
          resolve(torrent.files[correctFileIndex])

          torrent.destroy()
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
