import { createHash } from "crypto"

import { JobType } from "@anisubs/shared"
import { parse } from "anitomy-js"
import { UserInputError } from "apollo-server-koa"
import { Job as QueueJob } from "bullmq"
import { IsMagnetURI, Matches, validate } from "class-validator"
import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql"
import { Index } from "typeorm"

import { addJob } from "@/lib/queue"
import { getTorrentMetadata } from "@/lib/webtorrent"
import { Group } from "@/modules/group/group.model"

const md5 = createHash("md5")

@ArgsType()
export class JobCreationArgs {
  @Field(() => Int)
  animeId!: number

  @IsMagnetURI()
  @Field()
  source!: string

  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field(() => String, { nullable: true })
  fileName!: string | null
}

@ObjectType()
export class Job implements JobType {
  @Index()
  @Field()
  hash!: string

  @Field(() => ID, { description: "A mapping for `hash`, useful in caching" })
  get id(): string {
    return this.hash
  }

  animeId!: number

  groupId!: string

  @Field(() => Int)
  episode!: number

  @Field()
  source!: string

  @IsMagnetURI()
  @Field()
  // TODO: make private
  sourceUri!: string

  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field()
  fileName!: string

  @Field()
  inProgress!: boolean

  @Field()
  createdAt!: Date

  static async fromQueueJob(
    queueJob: QueueJob<JobType, unknown>,
  ): Promise<Job> {
    const job = new Job()

    job.hash = queueJob.data.hash
    job.animeId = queueJob.data.animeId
    job.groupId = queueJob.data.groupId
    job.episode = queueJob.data.episode
    job.source = queueJob.data.source
    job.sourceUri = queueJob.data.sourceUri
    job.fileName = queueJob.data.fileName
    job.inProgress = await queueJob.isActive()
    job.createdAt = new Date(queueJob.timestamp)

    return job
  }

  static async createJob({
    animeId,
    source,
    fileName,
  }: JobCreationArgs): Promise<Job> {
    const torrent = await getTorrentMetadata(source)

    if (
      fileName != null &&
      torrent.files.find((file) => file.name === fileName) == null
    ) {
      throw new UserInputError(
        `Torrent does not include a file named ${fileName}`,
      )
    }

    if (fileName == null) {
      if (torrent.files.length === 1) {
        fileName = torrent.files[0].name
      } else {
        throw new UserInputError(
          `Torrent has multiple files, need to specify which one to analyze with \`filename\`.`,
        )
      }
    }

    // TODO: block duplicate hashes
    const hash = md5.update(torrent.infoHash + fileName).digest("hex")
    const info = await parse(torrent.name)

    if (info.release_group == null) {
      throw new UserInputError(
        "Could not determine release group from torrent name.",
      )
    }

    const episodeNumber = /^(\d+)/.exec(info.episode_number ?? "")?.[1]
    if (info.episode_number == null || episodeNumber == null) {
      throw new UserInputError(
        "Could not determine episode number from torrent name.",
      )
    }

    const group = await Group.findOrCreateByName(info.release_group)

    const options: JobType = {
      hash: hash,
      id: hash,
      animeId: animeId,
      groupId: group.id,
      source: torrent.name,
      sourceUri: source,
      fileName: fileName,
      episode: Number(episodeNumber),
    }

    const errors = await validate(options)
    if (errors.length > 0) {
      console.error(
        `Failed to save Job.\n${errors
          .map((e) => e.toString())
          .join("\n")}\n${JSON.stringify(options, null, 2)}`,
      )
      throw new UserInputError("Failed to create Job.")
    }

    const job = await addJob(options)

    return Job.fromQueueJob(job)
  }
}
