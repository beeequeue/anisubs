import { Arg, Query, Resolver } from "type-graphql"

import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Anime } from "@/modules/anime/anime.model"
import { Entry } from "@/modules/entry/entry.model"

@Resolver()
export class AnimeResolvers {
  constructor(
    private readonly idsService: IdsService,
    private readonly malService: MyAnimeListService,
  ) {}

  @Query(() => Anime, {
    nullable: true,
  })
  anime(@Arg("id") id: number): Anime | null {
    const anime = new Anime(this.idsService, this.malService)
    anime.id = id

    return anime
  }

  @Query(() => [Entry])
  async recentlyAdded(): Promise<Entry[]> {
    return Entry.find({ order: { createdAt: "DESC" }, take: 10 })
  }
}
