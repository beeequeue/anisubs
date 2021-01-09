# To-do

## Data Models

- [x] Anime
- [x] Names
- [x] Comparison Entry
  - [ ] Future
    - [ ] download time
    - [ ] extraction time
- [ ] Group
  - [ ] Urls

## Jobs

- [ ] Sync anime aliases from AniList 
- [ ] Populate Queue
  - [x] Manual
  - [ ] Automatic
    - [ ] Based on recency + score

## Worker

- [x] Extract screenshots
  - [x] Get file
  - [x] Support specific file in torrents
  - [x] Extract screenshot of timestamp
  - [ ] Generate timestamps based on subtitle tracks
    - 5-20 st.
    - OP, ED
    - More than 2 subtitles at once
- [x] Receive new job
- [ ] Refactor to use `nats` for microservice communication
- [ ] Get Torrent Metadata for manager
- [ ] Toggleable `active` state

## Web

- [ ] Comparison/Anime page
  - [x] Comparisons
  - [ ] Image features
    - [ ] Zoom
    - [ ] Swap between corresponding other entries' images
  - [ ] Handle more than three entries
    - [ ] List of toggleable entries
- [ ] Group page
- [ ] Admin pages
  - [ ] Queue Management Page
  - [ ] Fix mistakes in data
     - [ ] Wrong `animeId`
     - [ ] Wrong group
  - [x] Create job
    - [ ] Torrent search
