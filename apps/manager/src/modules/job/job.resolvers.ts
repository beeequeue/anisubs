import {
  Args,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql"

import { PaginatedResponse, PaginationArgs } from "../pagination"
import { Job, JobCreationArgs } from "@/modules/job/job.model"
import { getJobCount, getJobs } from "@/queue"
import { Anime } from "@/modules/anime/anime.model"
import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Group } from "@/modules/group/group.model"

@ObjectType()
export class JobPage extends PaginatedResponse(Job) {}

@Resolver()
export class JobRootResolvers {
  @Query(() => JobPage)
  async jobQueue(@Args() { limit, offset }: PaginationArgs): Promise<JobPage> {
    const jobs = await getJobs(offset, offset + limit)
    const count = await getJobCount()

    const promises = jobs.map((queueJob) => Job.fromQueueJob(queueJob))

    return {
      items: await Promise.all(promises),
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

@Resolver(() => Job)
export class JobResolvers {
  constructor(
    private readonly idsService: IdsService,
    private readonly malService: MyAnimeListService,
  ) {}

  @FieldResolver(() => Anime)
  anime(@Root() job: Job): Anime {
    const anime = new Anime(this.idsService, this.malService)
    anime.id = job.animeId

    return anime
  }

  @FieldResolver(() => Group)
  async group(@Root() job: Job): Promise<Group> {
    return Group.findOneOrFail(job.groupId)
  }
}
