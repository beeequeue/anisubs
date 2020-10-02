import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Anime } from "@/modules/anime/anime.model"
import { Group } from "@/modules/group/group.model"
import { Image } from "@/modules/image/image.model"

@Entity()
@ObjectType()
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  uuid!: string

  @ManyToOne(() => Anime, (anime) => anime.entries)
  anime!: Anime

  @ManyToOne(() => Group, (group) => group.entries)
  group!: Anime

  @OneToMany(() => Image, (image) => image.entry)
  images!: Image[]
}
