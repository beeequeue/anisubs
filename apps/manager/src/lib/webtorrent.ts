import WebTorrent, { Torrent } from "webtorrent"
import { sync as remove } from "rimraf"

export const client = new WebTorrent()

const formatBytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(0)}MB`

export const getTorrentMetadata = (magnetUri: string) =>
  new Promise<Torrent>((resolve, reject) => {
    client.add(magnetUri, (torrent) => {
      console.log(`Getting metadata for:\n${torrent.infoHash} "${torrent.name}"`)

      torrent.addListener("error", reject)

      torrent.addListener("download", () => {
        resolve(torrent)

        // TODO write why
        setTimeout(() => {
          torrent.destroy()
          remove(torrent.path)
        }, 0)
      })
    })
  })

const throttle = <Fn extends (...params: unknown[]) => void>(
  fn: Fn,
  ms: number,
): ((...params: Parameters<Fn>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...params: Parameters<Fn>) => {
    if (timeoutId != null) {
      return
    }

    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId!)
      timeoutId = null
    }, ms)
    fn(...params)
  }
}

client.on("torrent", (torrent) => {
  const prefix = `[${torrent.name}]:`
  const throttledLogger = throttle(console.log, 2500)

  torrent.on("done", () => {
    console.log(`${prefix} Finished.`)
    torrent.destroy()
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
