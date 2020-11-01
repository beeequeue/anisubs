import { JobType, WebTorrent } from "@anisubs/shared"
import { Job as QueueJob, Processor } from "bullmq"
import { Torrent } from "webtorrent"

const downloadTorrent = (job: JobType): Promise<Torrent> =>
  WebTorrent.download(job)

export const startNewExtraction: Processor = async (job: QueueJob<JobType>): Promise<unknown> => {
  const torrent = await downloadTorrent(job.data)

  console.log(JSON.stringify(torrent, null, 2))

  return
}
