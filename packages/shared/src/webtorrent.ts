import { sync as remove } from "rimraf"
import WebTorrent, { Torrent } from "webtorrent"

import { formatBytes, throttle } from "./utils"

export class Torrent {
  static client = new WebTorrent()

  static async getMetadata(magnetUri: string) {
    return new Promise<Torrent>((resolve, reject) => {
      this.client.add(magnetUri, (torrent) => {
        console.log(`Getting metadata for:\n${torrent.infoHash} "${torrent.name}"`)

        torrent.addListener("error", reject)

        torrent.addListener("download", () => {
          resolve(torrent)

          // If we destroy it immediately it breaks
          setTimeout(() => {
            torrent.destroy()
            remove(torrent.path)
          }, 0)
        })
      })
    })
  }

  static async getMetadata(magnetUri: string) {
    return new Promise<Torrent>((resolve, reject) => {
      this.client.add(magnetUri, (torrent) => {
        console.log(`Getting metadata for:\n${torrent.infoHash} "${torrent.name}"`)

        torrent.addListener("error", reject)

        torrent.addListener("download", () => {
          resolve(torrent)

          // If we destroy it immediately it breaks
          setTimeout(() => {
            torrent.destroy()
            remove(torrent.path)
          }, 0)
        })
      })
    })
  }
}

const throttledLogger = throttle(console.log, 2500)

Torrent.client.on("torrent", (torrent) => {
  const prefix = `[${torrent.name}]:`

  torrent.on("done", () => {
    console.log(`${prefix} Finished.`)
  })

  torrent.addListener("download", () => {
    throttledLogger(`${prefix} ${formatBytes(torrent.downloaded)} ${(torrent.progress * 100).toFixed(0)}%`)
  })

  torrent.addListener("upload", () => {
    throttledLogger(`${prefix} Uploaded ${formatBytes(torrent.uploaded)}. Currently at a ${torrent.ratio} ratio.`)
  })

  torrent.addListener("noPeers", () => {
    console.log(`${prefix} found no peers :(`)
  })
})

