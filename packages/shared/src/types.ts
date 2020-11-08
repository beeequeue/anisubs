import type { Job } from "bullmq"

export type ExtractOptions = {
  id: string
  hash: string
  episode: number
  timestamps: string[]
  source: string
  sourceUri: string
  fileName: string
  groupId: string
  animeId: number
}

export enum WorkerState {
  Idle = "Idle",
  Downloading = "Downloading",
  Extracting = "Extracting",
  Uploading = "Uploading",
  Confirming = "Confirming",
}

export type WorkerStatusResponse = {
  enabled: boolean
  state: WorkerState
  job: Job<ExtractOptions, null> | null
}
