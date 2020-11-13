/* eslint-disable */
/* THIS IS A GENERATED FILE */
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string
  /** A timestamp in the format `[HH:]MM:SS[.xxxx]` */
  Timestamp: string
}

export type Group = {
  readonly __typename?: "Group"
  readonly id: Scalars["ID"]
  readonly createdAt: Scalars["DateTime"]
  readonly updatedAt: Scalars["DateTime"]
  readonly name: Scalars["String"]
}

export type Image = {
  readonly __typename?: "Image"
  readonly id: Scalars["ID"]
  readonly createdAt: Scalars["DateTime"]
  readonly updatedAt: Scalars["DateTime"]
  readonly timestamp: Scalars["Timestamp"]
  readonly url: Scalars["String"]
}

export type Entry = {
  readonly __typename?: "Entry"
  readonly id: Scalars["ID"]
  readonly createdAt: Scalars["DateTime"]
  readonly updatedAt: Scalars["DateTime"]
  readonly hash: Scalars["String"]
  readonly episode: Scalars["Int"]
  readonly source: Scalars["String"]
  readonly sourceUri: Scalars["String"]
  readonly fileName: Scalars["String"]
  readonly accepted: Scalars["Boolean"]
  readonly group: Group
  readonly anime: Anime
  readonly images: ReadonlyArray<Image>
}

export type Anime = {
  readonly __typename?: "Anime"
  /** AniList ID */
  readonly id: Scalars["Int"]
  readonly score: Maybe<Scalars["Int"]>
  readonly anilistUrl: Scalars["String"]
  readonly anidbId: Maybe<Scalars["Int"]>
  readonly malScore: Maybe<Scalars["Float"]>
  readonly names: ReadonlyArray<Scalars["String"]>
  readonly entries: ReadonlyArray<Entry>
}

export type Job = {
  readonly __typename?: "Job"
  readonly hash: Scalars["String"]
  /** A mapping for `hash`, useful in caching */
  readonly id: Scalars["ID"]
  readonly episode: Scalars["Int"]
  readonly timestamps: ReadonlyArray<Scalars["Timestamp"]>
  readonly source: Scalars["String"]
  readonly sourceUri: Scalars["String"]
  readonly fileName: Scalars["String"]
  readonly inProgress: Scalars["Boolean"]
  readonly createdAt: Scalars["DateTime"]
  readonly anime: Anime
  readonly group: Group
}

export type Worker = {
  readonly __typename?: "Worker"
  readonly id: Scalars["ID"]
  readonly createdAt: Scalars["DateTime"]
  readonly updatedAt: Scalars["DateTime"]
  readonly name: Scalars["String"]
  readonly host: Scalars["String"]
  readonly token: Scalars["String"]
  readonly confirmed: Scalars["Boolean"]
  readonly enabled: Scalars["Boolean"]
  readonly online: Scalars["Boolean"]
  readonly currentJob: Maybe<Job>
}

export type JobPage = {
  readonly __typename?: "JobPage"
  readonly items: ReadonlyArray<Job>
  readonly nextOffset: Maybe<Scalars["Int"]>
  readonly total: Scalars["Int"]
}

export type Query = {
  readonly __typename?: "Query"
  readonly anime: Maybe<Anime>
  readonly recentlyAdded: ReadonlyArray<Entry>
  readonly entries: ReadonlyArray<Entry>
  readonly jobQueue: JobPage
  readonly workers: ReadonlyArray<Worker>
}

export type QueryAnimeArgs = {
  id: Scalars["Float"]
}

export type QueryEntriesArgs = {
  animeId: Scalars["Float"]
}

export type QueryJobQueueArgs = {
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
}

export type Mutation = {
  readonly __typename?: "Mutation"
  readonly createJob: Job
  readonly addWorker: Worker
  readonly confirmWorker: Scalars["Boolean"]
}

export type MutationCreateJobArgs = {
  animeId: Scalars["Int"]
  source: Scalars["String"]
  fileName: Maybe<Scalars["String"]>
  timestamps: Maybe<ReadonlyArray<Scalars["Timestamp"]>>
}

export type MutationAddWorkerArgs = {
  host: Scalars["String"]
  name: Scalars["String"]
}

export type MutationConfirmWorkerArgs = {
  port: Scalars["Int"]
  token: Scalars["String"]
}
