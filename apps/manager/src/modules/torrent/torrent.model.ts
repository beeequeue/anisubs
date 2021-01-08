import { Expose, plainToClass } from "class-transformer"
import { NyaaTorrent } from "nyaapi"
import { Field, ID, Int, ObjectType } from "type-graphql"

@ObjectType()
export class Torrent {
  @Field(() => ID)
  @Expose({ name: "hash" })
  id!: string

  @Field({ nullable: true })
  @Expose()
  name!: string

  @Field()
  @Expose({ name: "magnet" })
  magnetUri!: string

  @Field(() => Int)
  @Expose()
  seeders!: number

  @Field(() => Int)
  @Expose()
  leechers!: number

  @Field(() => Int)
  @Expose({ name: "filesize" })
  sizeMb!: number

  public static from(obj: NyaaTorrent): Torrent {
    if (obj.filesize != null) {
      obj.filesize = Math.round(obj.filesize / 1e6)
    }

    return plainToClass(Torrent, obj, {
      excludeExtraneousValues: true,
    })
  }
}
