import { parse } from "anitomy-js"
import { UserInputError } from "apollo-server-koa"
import { IsMagnetURI, Matches } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ArgsType, Field, Int, ObjectType } from "type-graphql"

import { Entry } from "@/modules/entry/entry.model"
import { Group } from "@/modules/group/group.model"
import { getTorrentMetadata } from "@/lib/webtorrent"

@ArgsType()
export class JobCreationArgs {
  @Field(() => Int)
  animeId!: number

  @IsMagnetURI()
  @Field()
  source!: string

  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field(() => String, { nullable: true })
  filename!: string | null
}

@Entity()
@ObjectType()
export class Job extends Entry {
  @PrimaryGeneratedColumn("increment")
  @Field()
  index!: number

  @Column({ default: false })
  @Field()
  inProgress!: boolean

  static async createJob({
    animeId,
    source,
    filename,
  }: JobCreationArgs): Promise<Job> {
    const torrent = await getTorrentMetadata(source)

    if (
      filename != null &&
      torrent.files.find((file) => file.name === filename) == null
    ) {
      throw new UserInputError(
        `Torrent does not include a file named ${filename}`,
      )
    }

    if (filename == null) {
      if (torrent.files.length === 1) {
        filename = torrent.files[0].name
      } else {
        throw new UserInputError(
          `Torrent has multiple files, need to specify which one to analyze with \`filename\`.`,
        )
      }
    }

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

    const job = new Job()
    job.animeId = animeId
    job.source = torrent.name
    job.sourceUri = source
    job.group = group
    job.filename = filename
    job.episode = Number(episodeNumber)

    try {
      await job.save()
    } catch (err: any) {
      console.error(
        `Failed to save Job.\n${err.toString()}\n${JSON.stringify(job, null, 2)}`,
      )
      throw new UserInputError("Failed to create Job.")
    }

    return job
  }
}
