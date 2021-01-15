import { createHash } from "crypto"

import { ExtractOptions, WebTorrent } from "@anisubs/shared"
import { parse, parseSync } from "anitomy-js"
import { UserInputError } from "apollo-server-koa"
import { Job as QueueJob } from "bullmq"
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsMagnetURI,
  Matches,
  validate,
} from "class-validator"
import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql"
import { Index } from "typeorm"

import { Timestamp } from "@/graphql/scalars"
import { addJob } from "@/lib/queue"
import { Entry } from "@/modules/entry/entry.model"
import { Group } from "@/modules/group/group.model"

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

  @Field(() => [Timestamp], { nullable: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(15)
  timestamps!: string[] | null

  @Field(() => String, { nullable: true })
  group!: string | null
}

@ObjectType()
export class Job implements ExtractOptions {
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

  @Field(() => [Timestamp])
  timestamps!: string[]

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
    queueJob: QueueJob<ExtractOptions, unknown>,
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
    timestamps,
    group: customGroupName,
  }: JobCreationArgs): Promise<Job> {
    const torrent = await WebTorrent.getMetadata(source)

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
        const episodeOne = torrent.files.find((file) => {
          const parsed = parseSync(file.name)

          return Number(parsed.episode_number) === 1
        })

        if (episodeOne == null) {
          throw new UserInputError(
            `Torrent has multiple files, need to specify which one to analyze with \`filename\`.`,
          )
        }

        fileName = episodeOne.name
      }
    }

    // TODO: block duplicate hashes
    const hash = createHash("md5")
      .update(torrent.infoHash + fileName)
      .digest("hex")
    const torrentInfo = await parse(torrent.name)
    const fileInfo = await parse(fileName)

    if (torrentInfo.release_group == null && customGroupName == null) {
      throw new UserInputError(
        "Could not determine release group from torrent name.",
      )
    }

    const episodeNumber = /^(\d+)/.exec(fileInfo.episode_number ?? "")?.[1]
    if (fileInfo.episode_number == null || episodeNumber == null) {
      throw new UserInputError(
        "Could not determine episode number from torrent name.",
      )
    }

    const group = await Group.findOrCreateByName(
      torrentInfo.release_group || customGroupName!,
    )

    const existingTimestamps = await Entry.getTimestampsForAnime(animeId)

    // Sort and fix mistakes in timestamps
    timestamps = timestamps?.sort() ?? timestamps

    const options: ExtractOptions = {
      hash: hash,
      id: hash,
      fileName: fileName,
      episode: Number(episodeNumber),
      timestamps: existingTimestamps ?? timestamps!, //  TS doesn't realize one of the vars will not be null
      source: torrent.name,
      sourceUri: source,
      animeId: animeId,
      groupId: group.id,
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
