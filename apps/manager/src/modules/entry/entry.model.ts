import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
} from "typeorm"
import { IsDefined, IsEnum } from "class-validator"

@Entity()
@ObjectType()
export class Entry extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  @Field(() => ID)
  public uuid!: string
}
