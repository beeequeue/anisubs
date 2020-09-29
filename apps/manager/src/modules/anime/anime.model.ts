import { Field, Float, ID, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
} from "typeorm"

import { Alias } from "@/modules/alias/alias.model"
import { MyAnimeList } from "@/lib/myanimelist"

@Entity()
@ObjectType()
export class Anime extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  @Field(() => ID)
  id!: string

  @Column()
  @Field(() => Int)
  anilistId!: number

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  anidbId!: number

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  anilistScore!: number

  @Field(() => Float, { nullable: true })
  async malScore(): Promise<number | null> {
    return MyAnimeList.fetchRating(this.anilistId)
  }

  @OneToMany(() => Alias, (alias) => alias.anime)
  aliases!: Alias[]

  @Field(() => [String], {
    name: "aliases",
  })
  getAliases(): string[] {
    return this.aliases.map(({ name }) => name)
  }
}
