import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Entity, Generated, PrimaryColumn } from "typeorm"

@Entity()
@ObjectType()
export class Entry extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  @Field(() => ID)
  public uuid!: string
}
