import { ExtractOptions, WorkerState } from "@anisubs/shared"
import { Job } from "bullmq"

const state = {
  enabled: false,
  state: WorkerState.Idle as WorkerState,
  job: null as Job<ExtractOptions, null> | null,

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  },
  setState(state: WorkerState, job?: Job<JobType>) {
    this.state = state
    this.job = state !== WorkerState.Idle ? job ?? this.job : null
  },
}

export const useState = () => state as Readonly<typeof state>
