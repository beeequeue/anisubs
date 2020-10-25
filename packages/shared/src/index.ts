export type JobType = {
  id: string
  hash: string
  episode: number
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
  job: JobType | null
}
