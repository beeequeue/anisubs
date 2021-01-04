import { Field, ObjectType } from "type-graphql"
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm"

import { Timestamp } from "@/graphql/scalars"
import { ExtendedEntity } from "@/modules/base.model"
import { Entry } from "@/modules/entry/entry.model"

@Entity()
@ObjectType()
export class Image extends ExtendedEntity {
  @PrimaryColumn()
  @Field(() => Timestamp)
  timestamp!: string

  @Column()
  @Field()
  filename!: string

  @ManyToOne(() => Entry, (entry) => entry.images)
  @Index()
  entry!: Entry
}
