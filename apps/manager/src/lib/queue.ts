import { JobType } from "@anisubs/shared"
import { Queue } from "bullmq"

import { config } from "../config"

const jobQueue = new Queue<JobType>("extraction", {
  connection: {
    ...config.redis,
  }
})

enum Job {
  Extract = "extract"
}

export const addJob = async (job: JobType) => {
  return jobQueue.add(Job.Extract, job)
}

export const getJobs = async (from = 0, to = 15) => {
  return jobQueue.getWaiting(from, to)
}

export const getJobCount = async () => {
  return jobQueue.getWaitingCount()
}