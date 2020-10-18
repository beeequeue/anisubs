import { Args, Mutation, ObjectType, Query, Resolver } from "type-graphql"

import { Job, JobCreationArgs } from "@/modules/job/job.model"

import { PaginatedResponse, PaginationArgs } from "../pagination"

@ObjectType()
export class JobPage extends PaginatedResponse(Job) {}

@Resolver()
export class JobResolvers {
  @Query(() => JobPage)
  async jobQueue(
    @Args() { limit, offset, getPageFilters }: PaginationArgs,
  ): Promise<JobPage> {
    const count = await Job.count()
    const items = await Job.find({
      ...getPageFilters(),
    })

    return {
      items,
      total: count,
      nextOffset: PaginatedResponse.getNextOffset({
        offset,
        limit,
        total: count,
      }),
    }
  }

  @Mutation(() => Job)
  async createJob(@Args() options: JobCreationArgs): Promise<Job> {
    return Job.createJob(options)
  }
}
