import Fuse from "fuse.js"
import { Args, ArgsType, Field, Query, Resolver } from "type-graphql"
import { Like } from "typeorm"

import { Group } from "@/modules/group/group.model"

@ArgsType()
class SearchGroupsArgs {
  @Field(() => String, { nullable: true })
  query!: string | null
}

@Resolver()
export class GroupResolvers {
  @Query(() => [Group])
  async searchGroups(@Args() { query }: SearchGroupsArgs): Promise<Group[]> {
    if (query == null || query.length < 1) {
      return Group.find({ order: { name: "ASC" } })
    }

    const groups = await Group.find({
      where: { name: Like(`%${query}%`) },
      take: 10,
    })

    return new Fuse(groups, { keys: ["name"] })
      .search(query)
      .map((result) => result.item)
  }
}
