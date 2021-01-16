import { ExtractOptions } from "@anisubs/shared"
import { Job as QueueJob } from "bullmq/dist/classes/job"
import { IsMagnetURI, Matches } from "class-validator"
import { Field, Int, ObjectType } from "type-graphql"
import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm"

import { ExtendedEntity } from "@/modules/base.model"
import { Group } from "@/modules/group/group.model"
import { Image } from "@/modules/image/image.model"

@ObjectType()
@Entity()
export class Entry extends ExtendedEntity implements ExtractOptions {
  @Column()
  @Index()
  @Field()
  hash!: string

  @Column()
  @Field(() => Int)
  episode!: number

  @Column()
  @Field()
  source!: string

  @Column()
  @IsMagnetURI()
  @Field()
  // TODO: make private
  sourceUri!: string

  @Column()
  @Matches(/.*\.[a-zA-Z\d]{2,}/, { message: "Not a file name." })
  @Field()
  fileName!: string

  @Column({ default: false })
  @Field()
  accepted!: boolean

  @Column()
  animeId!: number

  groupId!: string

  @ManyToOne(() => Group, (group) => group.entries)
  @Field(() => Group)
  group!: Promise<Group>

  timestamps!: string[]

  @OneToMany(() => Image, (image) => image.entry)
  images!: Image[]

  static async getTimestampsForAnime(
    animeId: number,
  ): Promise<string[] | null> {
    return (await Entry.findOne({ animeId }))?.timestamps ?? null
  }

  static fromQueueJob(queueJob: QueueJob<ExtractOptions, unknown>): Entry {
    const entry = new Entry()

    entry.hash = queueJob.data.hash
    entry.animeId = queueJob.data.animeId
    // Can't set groupId for some reason :(
    entry.group = (queueJob.data.groupId as unknown) as Promise<Group>
    entry.episode = queueJob.data.episode
    entry.source = queueJob.data.source
    entry.sourceUri = queueJob.data.sourceUri
    entry.fileName = queueJob.data.fileName

    return entry
  }
}
