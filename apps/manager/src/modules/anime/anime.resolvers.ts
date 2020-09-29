import { Arg, Query, Resolver } from "type-graphql"
import { Anime } from "@/modules/anime/anime.model"

@Resolver()
export class AnimeResolvers {
  @Query(() => Anime, {
    nullable: true,
  })
  async anime(@Arg("uuid") uuid: string): Promise<Anime | null> {
    return (await Anime.findOne(uuid)) ?? null
  }
}
