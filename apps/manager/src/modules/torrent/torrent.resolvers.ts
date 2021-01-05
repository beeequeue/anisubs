import { WebTorrent } from "@anisubs/shared"
import { IsMagnetURI, MaxLength, MinLength } from "class-validator"
import NodeCache from "node-cache"
import { Args, ArgsType, Field, Query, Resolver } from "type-graphql"
import { Torrent as ITorrent } from "webtorrent"

import { NyaaService } from "@/lib/nyaa"
import { Torrent } from "@/modules/torrent/torrent.model"

const fileCache = new NodeCache({
  stdTTL: 1000 * 60 * 60 * 365, // 24h
  checkperiod: 1000 * 60,
})

@ArgsType()
export class SearchTorrentsArgs {
  @Field(() => String)
  @MinLength(4)
  @MaxLength(50)
  query!: string
}

@ArgsType()
export class TorrentFileArgs {
  @Field(() => String)
  @IsMagnetURI()
  magnetUri!: string
}

@Resolver()
export class TorrentResolvers {
  constructor(private readonly nyaaService: NyaaService) {}

  @Query(() => [Torrent])
  async searchTorrents(
    @Args() { query }: SearchTorrentsArgs,
  ): Promise<Torrent[]> {
    const torrents = await this.nyaaService.fetchRating(query)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return torrents.map(Torrent.from)
  }

  @Query(() => [String])
  public async torrentFiles(
    @Args() { magnetUri }: TorrentFileArgs,
  ): Promise<string[]> {
    if (fileCache.has(magnetUri)) {
      return fileCache.get<string[]>(magnetUri)!
    }

    let data: ITorrent | null = null

    try {
      data = await WebTorrent.getMetadata(magnetUri, 2500)
    } catch (e) {
      return []
    }

    const files = data.files.map((file) => file.name)

    fileCache.set(magnetUri, files)
    return files
  }
}
