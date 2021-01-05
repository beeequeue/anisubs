declare type KoaContext = { requestId: string }

declare type Context = Pick<
  import("koa").ParameterizedContext<KoaContext>,
  "req" | "res" | "state"
>

declare module "nyaapi" {
  type Category = /** Anime */ "3"

  type Language = "en"

  type Sort =
    | /** Id */ "0"
    | /** Name */ "1"
    | /** Date */ "2"
    | /** Downloads */ "3"
    | /** Size */ "4"
    | /** Seeders */ "5"
    | /** Leechers */ "6"
    | /** Completed */ "7"

  type Order = /** Asc */ "true" | /** Desc */ "false"

  export type NyaaTorrent = {
    id: number
    name: string
    status: number
    hash: string
    date: string
    filesize: number
    description: string
    comments: string[]
    sub_category: string
    category: string
    anidb_id: string
    downloads: number
    uploader_id: number
    uploader_name: string
    uploader_old: string
    website_link: string
    languages: string[]
    magnet: string
    torrent: string
    seeders: number
    leechers: number
    completed: number
    last_scrape: string
    file_list: Array<{
      path: string
      filesize: number
    }>
  }

  type SiSearchOptions = {
    filter?: number
    category?: "1_2"
  }

  export const si: {
    search(
      query: string,
      limit?: number,
      options?: SiSearchOptions,
    ): Promise<NyaaTorrent[]>

    searchAll(query: string, options?: SiSearchOptions): Promise<NyaaTorrent[]>
  }

  type PantsuSearchOptions = {
    /** Categories to search */
    c?: Category[]
    /** Search query */
    q?: string
    page?: number
    limit?: number // TODO: might be string
    /** Torrent status */
    s?: string
    maxage?: string
    toDate?: string
    fromDate?: string
    dateType?: "d" | "m" | "y"
    minSize?: string
    maxSize?: string
    sizeType?: "b" | "k" | "m" | "g"
    sort?: Sort
    order?: Order
    lang?: Language
    userID?: string
    fromID?: string
  }

  export const pantsu: {
    search(
      query: string,
      limit?: number,
      options?: Omit<PantsuSearchOptions, "q" | "limit">,
    ): Promise<NyaaTorrent[]>
    search(options: PantsuSearchOptions): Promise<NyaaTorrent[]>

    searchAll(
      query: string,
      options?: Omit<PantsuSearchOptions, "q" | "limit">,
    ): Promise<NyaaTorrent[]>
    searchAll(
      options: Omit<PantsuSearchOptions, "limit">,
    ): Promise<NyaaTorrent[]>
  }
}
