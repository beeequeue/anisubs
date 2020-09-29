import { Field, FieldResolver, ID, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  OneToMany,
} from "typeorm"
import { IsDefined, IsEnum } from "class-validator"

import { Alias } from "@/modules/alias/alias.model"

@Entity()
@ObjectType()
export class Anime extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  @Field(() => ID)
  id!: string

  @Column({ nullable: true })
  @Field(() => Int)
  anilistId!: number

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  anidbId!: number

  @OneToMany(() => Alias, (alias) => alias.anime)
  aliases!: Alias[]

  @FieldResolver(() => [String])
  aliasesField(): string[] {
    return this.aliases.map((alias) => alias.name)
  }
}
