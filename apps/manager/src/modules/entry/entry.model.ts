import { IsMagnetURI, Matches } from "class-validator"
import { Field, Int, ObjectType } from "type-graphql"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"

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
  @Field()
  source!: string

  @Column()
  @IsMagnetURI()
  @Field()
  // TODO: make private
  sourceUri!: string

  @Column()
  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a filename." })
  @Field()
  filename!: string

  @Column({ default: false })
  @Field()
  accepted!: boolean

  @Column()
  animeId!: number

  @ManyToOne(() => Group, (group) => group.entries)
  group!: Group

  @OneToMany(() => Image, (image) => image.entry)
  images!: Image[]
}
