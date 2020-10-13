import { Column, Entity, Index, PrimaryColumn } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"

@Entity()
export class Name extends ExtendedEntity {
  @Column()
  animeId!: number

  @PrimaryColumn()
  @Index()
  name!: string
}
