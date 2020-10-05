import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@ObjectType({ isAbstract: true })
export class ExtendedEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @CreateDateColumn()
  @Field()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
