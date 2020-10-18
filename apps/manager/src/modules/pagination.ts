import { Max, Min } from "class-validator"
import { ArgsType, ClassType, Field, Int, ObjectType } from "type-graphql"

// https://typegraphql.com/docs/generic-types.html
export const PaginatedResponse = <Item>(TItemClass: ClassType<Item>) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    public items!: readonly Item[]

    @Field(() => Int, { nullable: true })
    public nextOffset!: number | null

    @Field(() => Int)
    public total!: number
  }

  return PaginatedResponseClass
}

PaginatedResponse.EMPTY_PAGE = {
  items: [],
  nextOffset: null,
  total: 0,
} as const

type NextOffsetOptions = {
  offset: number
  limit: number
  total: number
}

PaginatedResponse.getNextOffset = ({
  offset,
  limit,
  total,
}: NextOffsetOptions) => {
  const nextOffset = offset + limit

  return nextOffset < total ? nextOffset : null
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  public offset = 0

  @Field(() => Int, { nullable: true, description: "Maximum 20" })
  @Min(0)
  @Max(20)
  public limit = 20

  /**
   * Returns the query options for the page arguments.
   */
  public getPageFilters = () => ({
    take: this.limit,
    skip: this.offset,
  })
}
