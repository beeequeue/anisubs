import { Field, Float, ID, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

import { MyAnimeList } from "@/lib/myanimelist"
import { Entry } from "@/modules/entry/entry.model"
import { Name } from "@/modules/name/name.model"

@Entity()
@ObjectType()
export class Anime extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @Column()
  @Field(() => Int)
  anilistId!: number

  @Field()
  anilistUrl(): string {
    return `https://anilist.co/anime/${this.anilistId}`
  }

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

  @OneToMany(() => Name, (name) => name.anime, {
    nullable: false,
    cascade: true,
  })
  names!: Name[]

  @Field(() => [String], {
    name: "names",
  })
  getAliases(): string[] {
    return this.names.map(({ name }) => name)
  }

  @OneToMany(() => Entry, (entry) => entry.anime, {
    nullable: false,
    cascade: true,
  })
  entries!: Entry[]
}
