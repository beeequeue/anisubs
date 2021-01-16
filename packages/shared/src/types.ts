import type { Job } from "bullmq"

export type ExtractOptions = {
  id: string
  hash: string
  episode: number
  timestamps: string[] | null
  source: string
  sourceUri: string
  fileName: string
  groupId: string
  animeId: number
}

export type ExtractResult = { fileName: string; timestamp: string }

export enum WorkerState {
  Idle = "Idle",
  Downloading = "Downloading",
  Extracting = "Extracting",
  FindingTimestamps = "FindingTimestamps",
}

export type WorkerStatusResponse = {
  enabled: boolean
  state: WorkerState
  job: Job<ExtractOptions, null> | null
}
