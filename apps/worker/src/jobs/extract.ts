import {
  compareTimestamps,
  ExtractOptions,
  ExtractResult,
  WebTorrent,
  WorkerState,
} from "@anisubs/shared"
import { Job as QueueJob, Processor } from "bullmq"
import { DeepNonNullable } from "utility-types"

import { Ffmpeg } from "@/lib/ffmpeg"
import { findTimestamps } from "@/lib/subtitles"
import { useState } from "@/state"

export const startNewExtraction: Processor = async (
  job: QueueJob<ExtractOptions>,
): Promise<ExtractResult[]> => {
  const state = useState()

  state.setState(WorkerState.Downloading, job)
  const file = await WebTorrent.download(job.data)

  if (job.data.timestamps == null) {
    state.setState(WorkerState.FindingTimestamps)

    const subtitlesPath = await Ffmpeg.extractSubtitles(job.data, file)
    job.data.timestamps = await findTimestamps(subtitlesPath)
  }

  if (job.data.timestamps == null) {
    throw new Error("Could not automatically find good timestamps")
  }

  state.setState(WorkerState.Extracting)
  const screenshots = await Ffmpeg.extractScreenshots(
    job.data as DeepNonNullable<ExtractOptions>,
    file,
  )

  state.setState(WorkerState.Idle)

  // Has to be returned in order of appearance - it is mapped to the input timestamps
  return screenshots.sort(compareTimestamps)
}
