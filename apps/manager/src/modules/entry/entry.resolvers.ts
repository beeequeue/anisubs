import { FieldResolver, Resolver, Root } from "type-graphql"

import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Anime } from "@/modules/anime/anime.model"
import { Entry } from "@/modules/entry/entry.model"

@Resolver(() => Entry)
export class EntryResolvers {
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
}
