import { ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Anime } from "@/modules/anime/anime.model"

@Entity()
@ObjectType()
export class Alias extends BaseEntity {
  @PrimaryColumn()
  @ManyToOne(() => Anime, (anime) => anime.aliases)
  anime!: Anime

  @Column()
  name!: string
}
