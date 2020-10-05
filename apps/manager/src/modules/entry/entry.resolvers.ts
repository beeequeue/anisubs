import { UserInputError } from "apollo-server-koa"
import { IsMagnetURI, Matches } from "class-validator"
import { Args, ArgsType, Field, Int, Mutation, Resolver } from "type-graphql"

import { getTorrentMetadata } from "@/lib/webtorrent"
import { Entry } from "@/modules/entry/entry.model"

@ArgsType()
class JobCreationArgs {
  @Field(() => Int)
  anilistId!: number

  @IsMagnetURI()
  @Field()
  source!: string

  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field(() => String, { nullable: true })
  filename!: string | null
}

@Resolver()
export class EntryResolvers {
  @Mutation(() => Entry, {
    nullable: true,
  })
  async createJob(
    @Args() { anilistId, source, filename }: JobCreationArgs,
  ): Promise<Entry | null> {
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

    return { anilistId, source } as any
  }
}
