import { Arg, Field, Float, Int, ObjectType } from "type-graphql"

import { Anilist } from "@/lib/anilist"
import { IdsService } from "@/lib/arm"
import { MyAnimeListService } from "@/lib/myanimelist"
import { Entry } from "@/modules/entry/entry.model"
import { Name } from "@/modules/name/name.model"

@ObjectType()
export class Anime {
  constructor(
    private readonly idsService: IdsService,
    private readonly malService: MyAnimeListService,
  ) {}

  @Field(() => Int, {
    description: "AniList ID",
  })
  id!: number

  @Field(() => Int, { nullable: true })
  async anidbId(): Promise<number | null> {
    const result = await this.idsService.fetchIds("anilist", this.id)
    return result?.anidb ?? null
  }

  @Field(() => Float, { nullable: true })
  async malScore(): Promise<number | null> {
    return this.malService.fetchRating(this.id)
  }

  @Field(() => [String])
  async names(): Promise<string[]> {
    const names = await Name.find({
      where: { animeId: this.id },
      select: ["name"],
    })

    return names.map((name) => name.name)
  }

  @Field(() => [Entry])
  async entries(
    @Arg("all", () => Boolean, { nullable: true })
    all: boolean | null,
  ): Promise<Entry[]> {
    const entries = await Entry.find({
      where: { animeId: this.id },
      relations: ["group"],
    })

    if (all) return entries

    const distinctEntries: Record<string, Entry> = {}

    for (const entry of entries) {
      const group = await entry.group

      if (Object.keys(distinctEntries).includes(group.id)) continue

      distinctEntries[group.id] = entry
    }

    return Object.values(distinctEntries)
  }

  @Field(() => Anilist, { nullable: true })
  async anilist(): Promise<Anilist | null> {
    return Anilist.fetch(this.id)
  }
}
