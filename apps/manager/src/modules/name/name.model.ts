import {
  BaseEntity,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm"

import { Anime } from "@/modules/anime/anime.model"

@Entity()
export class Name extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string

  @ManyToOne(() => Anime, (anime) => anime.names)
  anime!: Anime

  @PrimaryColumn()
  @Index()
  name!: string
}
