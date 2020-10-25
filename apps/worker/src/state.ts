import { JobType, WorkerState } from "@anisubs/shared"
import { Job } from "bullmq"

type State = {
  enabled: boolean
  state: WorkerState
  job: Job<JobType, null> | null
}

const state: State = {
  enabled: false,
  state: WorkerState.Idle,
  job: null,
}

export const useState = () => ({
  ...state as Readonly<State>,
})

useState().enabled = true
