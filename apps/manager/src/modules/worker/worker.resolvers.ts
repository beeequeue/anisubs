import { UserInputError } from "apollo-server-koa"
import { randomBytes } from "crypto"
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql"

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

  @Mutation(() => Boolean)
  async confirmWorker(
    @Ctx() ctx: Context,
    @Arg("token") token: string,
    @Arg("port", () => Int) port: number,
  ): Promise<boolean> {
    let ip = ctx.req.connection.localAddress

    if (ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1"
    }

    console.log(`A worker is trying to confirm ${ip}:${port}`)

    const worker = await Worker.findOne({ where: { host: `${ip}:${port}`, token } })

    if (worker == null) {
      throw new UserInputError("No such worker is registered.")
    }

    worker.confirmed = true
    await worker.save()

    return true
  }
}
