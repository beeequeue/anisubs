import { randomBytes } from "crypto"

import { UserInputError } from "apollo-server-koa"
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
