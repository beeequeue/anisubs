import { Field, ObjectType } from "type-graphql"
import { Column, Entity, OneToMany } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"
import { Entry } from "@/modules/entry/entry.model"

@Entity()
@ObjectType()
export class Group extends ExtendedEntity {
  @Column()
  @Field(() => String)
  name!: string

  @OneToMany(() => Entry, (entry) => entry.group, {
    nullable: false,
    cascade: true,
  })
  entries!: Entry[]
}
