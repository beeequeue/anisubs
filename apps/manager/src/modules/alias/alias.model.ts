import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Anime } from "@/modules/anime/anime.model"

@Entity()
export class Alias extends BaseEntity {
  @PrimaryColumn({ type: "uuid" })
  @ManyToOne(() => Anime, (anime) => anime.aliases)
  anime!: Anime

  @Column()
  name!: string
}
