import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
@ObjectType()
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string
}
