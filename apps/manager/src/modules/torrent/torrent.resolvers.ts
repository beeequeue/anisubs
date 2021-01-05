import { Arg, Query, Resolver } from "type-graphql"

import { NyaaService } from "@/lib/nyaa"
import { Torrent } from "@/modules/torrent/torrent.model"

@Resolver()
export class TorrentResolvers {
  constructor(private readonly nyaaService: NyaaService) {}

  @Query(() => [Torrent])
  async searchTorrents(@Arg("query") query: string): Promise<Torrent[]> {
    const torrents = await this.nyaaService.fetchRating(query)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return torrents.map(Torrent.from)
  }
}
