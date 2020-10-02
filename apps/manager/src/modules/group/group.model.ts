import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
@ObjectType()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @Column()
  @Field(() => String)
  name!: string
}
