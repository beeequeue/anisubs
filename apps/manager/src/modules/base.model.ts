import { UserInputError } from "apollo-server-koa"
import { validate } from "class-validator"
import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@ObjectType({ isAbstract: true })
export class ExtendedEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string

  @CreateDateColumn()
  @Field()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this)

    type Errors = {
      [key: string]: string[]
    }

    if (errors.length > 0) {
      const errorObj = errors.reduce<Errors>(
        (accum, { property, constraints }) => {
          accum[property] = Object.entries(constraints ?? {}).map(
            ([kind, message]) => `${kind}: ${message}`,
          )

          return accum
        },
        {},
      )

      const messageDetails = errors
        .map(
          ({ property, value, constraints }) =>
            `${property}: "${value}" [ ${Object.keys(constraints ?? {}).join(
              ", ",
            )} ]`,
        )
        .join(", ")

      throw new UserInputError(`Got invalid options. (${messageDetails})`, {
        validation: errorObj,
      })
    }
  }
}
