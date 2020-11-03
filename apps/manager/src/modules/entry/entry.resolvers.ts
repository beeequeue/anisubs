import { FieldResolver, Resolver, Root } from "type-graphql"
import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Anime } from "@/modules/anime/anime.model"
import { Entry } from "@/modules/entry/entry.model"
import { Image } from "@/modules/image/image.model"

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
    return await Image.find({ where: { entryId: entry.id } })
  }
}
