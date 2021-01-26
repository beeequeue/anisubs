import { randomBytes } from "crypto"

import { Worker } from "@/modules/worker/worker.model"
import { UserInputError } from "apollo-server-koa"
import { Arg, Mutation, Query, Resolver } from "type-graphql"

@Resolver()
export class WorkerResolvers {
  @Query(() => [Worker])
  async workers(): Promise<Worker[]> {
    return Worker.find({ order: { createdAt: "DESC" } })
  }

  @Mutation(() => String)
  async registerWorker(@Arg("name") name: string): Promise<string> {
    const worker = new Worker()

    worker.name = name
    worker.confirmed = false
    worker.token = randomBytes(64).toString("hex")

    await worker.save()

    return worker.token
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
