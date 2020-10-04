import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { Entry } from "@/modules/entry/entry.model"

@Entity()
@ObjectType()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @Column()
  @Field(() => String)
  name!: string

  @OneToMany(() => Entry, (entry) => entry.group, {
    nullable: false,
    cascade: true,
  })
  entries!: Entry[]
}
