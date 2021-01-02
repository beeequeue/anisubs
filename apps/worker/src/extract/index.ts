import { join } from "path"

import {
  ExtractOptions,
  SCREENSHOTS_PATH,
  WebTorrent,
  WorkerState,
} from "@anisubs/shared"
import { Job as QueueJob, Processor } from "bullmq"

import { Ffmpeg } from "@/lib/ffmpeg"
import { uploadFilesToSpace } from "@/lib/upload"
import { useState } from "@/state"

export const startNewExtraction: Processor = async (
  job: QueueJob<ExtractOptions>,
): Promise<unknown> => {
  const state = useState()

  state.setState(WorkerState.Downloading, job)
  const file = await WebTorrent.download(job.data)

  state.setState(WorkerState.Extracting)
  const screenshots = await Ffmpeg.extractScreenshots(job.data, file)

  let urls
  if (process.env.NODE_ENV === "production") {
    state.setState(WorkerState.Uploading)
    urls = await uploadFilesToSpace(job.data, screenshots)
  } else {
    urls = screenshots.map(
      (image) =>
        `file:\\\\${join(
          SCREENSHOTS_PATH,
          job.data.animeId.toString(),
          image,
        )}`,
    )
  }

  state.setState(WorkerState.Idle)
  return urls
}
