import { Field, ObjectType } from "type-graphql"
import { Column, Entity } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"
import { IsHost } from "@/validators"

@ObjectType()
@Entity()
export class Worker extends ExtendedEntity {
  @Column()
  @Field()
  name!: string

  @Column()
  @Field()
  @IsHost()
  host!: string

  @Column()
  @Field()
  token!: string

  @Column()
  @Field()
  confirmed!: boolean

  @Field(() => Boolean, {})
  enabled!: Promise<boolean>

  @Field(() => Boolean)
  online!: Promise<boolean>
}
