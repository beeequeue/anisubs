import { ExtractOptions, WebTorrent, WorkerState } from "@anisubs/shared"
import { Job as QueueJob, Processor } from "bullmq"

import { Ffmpeg } from "@/lib/ffmpeg"
import { useState } from "@/state"

export const startNewExtraction: Processor = async (
  job: QueueJob<ExtractOptions>,
): Promise<unknown> => {
  const state = useState()

  state.setState(WorkerState.Downloading, job)
  const file = await WebTorrent.download(job.data)

  state.setState(WorkerState.Extracting)
  const screenshots = await Ffmpeg.extractScreenshots(job.data, file)

  state.setState(WorkerState.Idle)

  // Has to be returned in order of appearance - it is mapped to the input timestamps
  return screenshots.sort()
}
