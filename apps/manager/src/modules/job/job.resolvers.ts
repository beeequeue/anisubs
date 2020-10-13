import { Args, Mutation, Resolver } from "type-graphql"

import { Job, JobCreationArgs } from "@/modules/job/job.model"

@Resolver()
export class JobResolvers {
  @Mutation(() => Job)
  async createJob(
    @Args() options: JobCreationArgs,
  ): Promise<Job> {
    return Job.createJob(options)
  }
}
