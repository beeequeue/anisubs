<template>
  <div class="home">
    <h1 class="subtitle">Anime Fansub<br />Comparisons</h1>

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

export default defineComponent({
  name: "Home",
  components: {
    RecentlyAddedFeed,
  },
})
</script>

<style lang="scss" scoped>
.subtitle {
  margin: 0 0 32px;
}
</style>
