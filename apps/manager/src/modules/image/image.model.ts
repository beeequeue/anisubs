import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Entry } from "@/modules/entry/entry.model"
import { IsUrl, registerDecorator, ValidationOptions } from "class-validator"

const timestampRegex = /^\d{2}:\d{2}:\d{2}$/

const IsTimestamp = (validationOptions?: ValidationOptions) => (
  obj: BaseEntity,
  propertyName: string,
) => {
  registerDecorator({
    name: "isTimestamp",
    target: obj.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate: (value: unknown) =>
        typeof value === "string" && timestampRegex.test(value),
    },
  })
}

@Entity()
@ObjectType()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @PrimaryColumn()
  @IsTimestamp()
  @Field()
  timestamp!: string

  @Column()
  @IsUrl({
    require_host: true,
    require_protocol: true,
    require_tld: true,
    disallow_auth: true,
    protocols: ["https"],
    host_whitelist: ["cdn.anisubs.app"],
  })
  @Field()
  url!: string

  @ManyToOne(() => Entry, (entry) => entry.images)
  entry!: Entry
}
