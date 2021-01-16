import { randomBytes } from "crypto"

import { UserInputError } from "apollo-server-koa"
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql"

import { WorkerService } from "@/lib/worker"
import { Job } from "@/modules/job/job.model"
import { Worker } from "@/modules/worker/worker.model"

@Resolver()
export class WorkerResolvers {
  // TODO: Secure
  @Query(() => [Worker])
  async workers(): Promise<Worker[]> {
    return Worker.find({ order: { createdAt: "DESC" } })
  }

  // TODO: Secure
  @Mutation(() => Worker)
  async addWorker(@Arg("name") name: string): Promise<Worker> {
    const worker = new Worker()

    worker.name = name
    worker.confirmed = false
    worker.token = randomBytes(64).toString("hex")

    return worker.save()
  }

  @Mutation(() => Boolean)
  async confirmWorker(@Arg("token") token: string): Promise<boolean> {
    console.log("A worker is trying to confirm...")

    const worker = await Worker.findOne({
      where: { token },
    })

    if (worker == null) {
      throw new UserInputError("No such worker is registered.")
    }

    worker.confirmed = true
    await worker.save()

    return true
  }
}

@Resolver(() => Worker)
export class WorkerFieldResolvers implements ResolverInterface<Worker> {
  constructor(private readonly workerService: WorkerService) {}

  @FieldResolver()
  async enabled(@Root() worker: Worker) {
    return (
      (await this.workerService.statusLoader.load(worker))?.enabled ?? false
    )
  }

  @FieldResolver()
  async online(@Root() worker: Worker) {
    return (await this.workerService.statusLoader.load(worker)) != null
  }

  @FieldResolver()
  async currentJob(@Root() worker: Worker) {
    const status = await this.workerService.statusLoader.load(worker)

    return status != null && status.job != null
      ? Job.fromQueueJob(status.job)
      : null
  }
}
