import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql"

import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Anime } from "@/modules/anime/anime.model"
import { Entry } from "@/modules/entry/entry.model"
import { Image } from "@/modules/image/image.model"

@Resolver()
export class EntryResolvers {
  @Query(() => [Entry])
  async entries(@Arg("animeId") animeId: number): Promise<Entry[]> {
    return Entry.find({ where: { animeId } })
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
    return await Image.find({ where: { entry: entry.id } })
  }
}
