import { Field, ObjectType } from "type-graphql"
import { Column, Entity } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"

@ObjectType()
@Entity()
export class Worker extends ExtendedEntity {
  @Column()
  @Field()
  name!: string

  @Column()
  token!: string

  @Column()
  @Field()
  confirmed!: boolean
}
