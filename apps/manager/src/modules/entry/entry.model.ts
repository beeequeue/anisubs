import { ExtractOptions } from "@anisubs/shared"
import { IsMagnetURI, Matches } from "class-validator"
import { Field, Int, ObjectType } from "type-graphql"
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { Timestamp } from "@/graphql/scalars"
import { ExtendedEntity } from "@/modules/base.model"
import { Group } from "@/modules/group/group.model"
import { Image } from "@/modules/image/image.model"

@ObjectType()
@Entity()
export class Entry extends ExtendedEntity implements ExtractOptions {
  @Column()
  @Index()
  @Field()
  hash!: string

  @Column()
  @Field(() => Int)
  episode!: number

  @Column()
  @Field()
  source!: string

  @Column({ type: "simple-array" })
  @Field(() => [Timestamp])
  timestamps!: string[]

  @Column()
  @IsMagnetURI()
  @Field()
  // TODO: make private
  sourceUri!: string

  @Column()
  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field()
  fileName!: string

  @Column({ default: false })
  @Field()
  accepted!: boolean

  @Column()
  animeId!: number

  @JoinColumn()
  groupId!: string

  @ManyToOne(() => Group, (group) => group.entries)
  @Field(() => Group)
  group!: Promise<Group>

  @OneToMany(() => Image, (image) => image.entry)
  images!: Image[]

  static async getTimestampsForAnime(
    animeId: number,
  ): Promise<string[] | null> {
    return (await Entry.findOne({ animeId }))?.timestamps ?? null
  }
}
