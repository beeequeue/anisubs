import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { Entry } from "@/modules/entry/entry.model"
import { ArgsType, Field, Int } from "type-graphql"
import { getTorrentMetadata } from "@/lib/webtorrent"
import { UserInputError } from "apollo-server-koa"
import { IsMagnetURI, Matches } from "class-validator"

@ArgsType()
export class JobCreationArgs {
  @Field(() => Int)
  anilistId!: number

  @IsMagnetURI()
  @Field()
  source!: string

  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field(() => String, { nullable: true })
  filename!: string | null
}

@Entity()
export class Job extends Entry {
  @PrimaryGeneratedColumn("increment")
  @Field()
  index!: number

  @Column()
  @Field()
  inProgress!: boolean

  static async create({ anilistId, source, filename }: JobCreationArgs): Promise<Job> {
    const torrent = await getTorrentMetadata(source)

    if (
      filename != null &&
      torrent.files.find((file) => file.name === filename) == null
    ) {
      throw new UserInputError(`Torrent does not include a file named ${filename}`)
    }

    if (filename == null) {
      if (torrent.files.length === 1) {
        filename = torrent.files[0].name
      } else {
        throw new UserInputError(`Torrent has multiple files, need to specify which one to analyze with \`filename\`.`)
      }
    }

    const job = new Job()
    job.
  }
}
