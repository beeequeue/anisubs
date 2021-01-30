import { UserInputError } from "apollo-server-koa"
import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql"
import { getManager } from "typeorm"

import { IdsService } from "@/lib/arm"
import { Logger } from "@/lib/logger"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Anime } from "@/modules/anime/anime.model"
import { Entry } from "@/modules/entry/entry.model"
import { Image } from "@/modules/image/image.model"

@Resolver()
export class EntryResolvers {
  @Query(() => [Entry])
  async entries(@Arg("animeId") animeId: number): Promise<Entry[]> {
    return Entry.getDistinctEntries(animeId)
  }

  @Mutation(() => Boolean)
  async deleteEntry(@Arg("id", () => ID) id: string) {
    const entry = (await Entry.findByIds([id], { select: ["id"] }))[0]

    if (entry == null) {
      throw new UserInputError(`Entry:${id} does not exist.`)
    }

    try {
      await getManager().transaction(async (transaction) => {
        await transaction.delete(Image, await entry.images)
        await transaction.delete(Entry, entry.id)
      })
    } catch (e) {
      Logger.error(e)
      throw new Error(`Could not delete Entry:${id}!`)
    }

    return true
  }
}

@Resolver(() => Entry)
export class EntryFieldResolvers {
  constructor(
    private readonly idsService: IdsService,
    private readonly malService: MyAnimeListService,
  ) {}

  @FieldResolver()
  anime(@Root() entry: Entry): Anime {
    const anime = new Anime(this.idsService, this.malService)
    anime.id = entry.animeId

    return anime
  }

  @FieldResolver(() => [Image])
  async images(@Root() entry: Entry): Promise<Image[]> {
    return await Image.find({
      where: { entry: entry.id },
      order: { timestamp: "ASC" },
    })
  }
}
