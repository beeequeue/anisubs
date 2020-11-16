<template>
  <div class="home">
    <Title>Anime Fansub Comparisons</Title>
    <br />

    Either...
    <br />

    <input placeholder="Search for an anime" />
    <br />

    Or check out shows by season:
    <br />

    SEASONS HERE
    <br />
    <br />
    <br />

    <h3>Recently added</h3>
    <recently-added-feed />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import RecentlyAddedFeed from "@/components/recently-added-feed/recently-added-feed.vue" // @ is an alias to /src
import Title from "@/components/title.vue"

export default defineComponent({
  name: "Home",
  components: {
    RecentlyAddedFeed,
    Title,
  },
})
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 48px;
  }
}
</style>
