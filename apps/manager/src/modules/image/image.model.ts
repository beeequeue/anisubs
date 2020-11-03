import { IsUrl } from "class-validator"
import { Field, ObjectType } from "type-graphql"
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import { Timestamp } from "@/graphql/scalars"
import { ExtendedEntity } from "@/modules/base.model"
import { Entry } from "@/modules/entry/entry.model"

@Entity()
@ObjectType()
export class Image extends ExtendedEntity {
  @PrimaryColumn()
  @Field(() => Timestamp)
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
  @Index()
  entry!: Entry

  @JoinColumn()
  entryId!: string
}
