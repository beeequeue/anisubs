import { randomBytes } from "crypto"
import { Arg, Mutation, Query, Resolver } from "type-graphql"

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
  async addWorker(
    @Arg("name") name: string,
    @Arg("host") host: string,
  ): Promise<Worker> {
    const worker = new Worker()

    worker.name = name
    worker.host = host
    worker.confirmed = false
    worker.token = randomBytes(64).toString("hex")

    return worker.save()
  }
}
