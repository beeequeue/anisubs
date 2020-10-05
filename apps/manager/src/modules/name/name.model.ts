import { Entity, Index, ManyToOne, PrimaryColumn } from "typeorm"

import { Anime } from "@/modules/anime/anime.model"
import { ExtendedEntity } from "@/modules/base.model"

@Entity()
export class Name extends ExtendedEntity {
  @ManyToOne(() => Anime, (anime) => anime.names)
  anime!: Anime

  @PrimaryColumn()
  @Index()
  name!: string
}
