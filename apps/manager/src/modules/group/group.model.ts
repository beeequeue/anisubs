import { Field, ObjectType } from "type-graphql"
import { Column, Entity, Index, OneToMany } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"
import { Entry } from "@/modules/entry/entry.model"

@Entity()
@ObjectType()
export class Group extends ExtendedEntity {
  @Column()
  @Index()
  @Field(() => String)
  name!: string

  @OneToMany(() => Entry, (entry) => entry.group, {
    nullable: false,
    cascade: true,
  })
  entries!: Entry[]

  static async findOrCreateByName(name: string): Promise<Group> {
    let group = await this.findOne({ name })

    if (group == null) {
      group = new Group()

      group.name = name

      await group.save()
    }

    return group
  }
}
