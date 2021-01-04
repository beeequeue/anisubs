<template>
  <div class="home">
    <Title class="big">Anime Fansub Comparisons</Title>

    <router-link to="/create-job">Create new comparisons</router-link>

    Either...

    <input placeholder="Search for an anime" />

    Or check out shows by season:
    <br />

    SEASONS HERE

    <Title>Recently added</Title>
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

  .title.big {
    font-size: 48px;
  }
}
</style>
