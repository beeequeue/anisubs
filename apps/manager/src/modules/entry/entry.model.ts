import { IsMagnetURI, Matches } from "class-validator"
import { Field, Int, ObjectType } from "type-graphql"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"

import { Anime } from "@/modules/anime/anime.model"
import { ExtendedEntity } from "@/modules/base.model"
import { Group } from "@/modules/group/group.model"
import { Image } from "@/modules/image/image.model"

@ObjectType()
@Entity()
export class Entry extends ExtendedEntity {
  @Column()
  @Field(() => Int)
  episode!: number

  @Column()
  @IsMagnetURI()
  @Field()
  // TODO: make private
  source!: string

  @Column()
  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field()
  filename!: string

  @Column()
  @Field()
  accepted!: boolean

  @Column()
  animeId!: number

  @ManyToOne(() => Group, (group) => group.entries)
  group!: Anime

  @OneToMany(() => Image, (image) => image.entry)
  images!: Image[]
}
