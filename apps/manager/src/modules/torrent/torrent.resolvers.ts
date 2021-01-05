import { Arg, Query, Resolver } from "type-graphql"

import { Torrent } from "@/modules/torrent/torrent.model"
import { NyaaService } from "@/lib/nyaa"

@Resolver()
export class TorrentResolvers {
  constructor(private readonly nyaaService: NyaaService) {}

  @Query(() => [Torrent])
  async searchTorrents(@Arg("query") query: string): Promise<Torrent[]> {
    const torrents = await this.nyaaService.fetchRating(query)

    return torrents.map(Torrent.from)
  }
}
