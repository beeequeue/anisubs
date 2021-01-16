<template>
  <div
    v-bind="$attrs"
    class="info"
    :style="{ gridColumn: `${index + 1} / span 1`, gridRow: '1 / span 1' }"
  >
    <span class="source">
      <span>{{ splitSource[0] }}</span>

      <router-link :to="`/group/${entry.group.id}`">
        {{ entry.group.name }}
      </router-link>

      <span>{{ splitSource[1] }}</span>
    </span>
  </div>

  <div
    :style="{ gridColumn: `${index + 1} / span 1`, gridRow: '2 / span 1' }"
    class="images"
  >
    <div v-for="image in entry.images" :key="image.id" class="image-container">
      <img :src="getImageUrl(image)" class="image" />

      <div class="timestamp">{{ image.timestamp }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Entry, Image } from "@anisubs/graphql-types"
import { defineComponent, PropType } from "vue"

import { CONFIG } from "@/config"

export default defineComponent({
  name: "Column",
  props: {
    animeId: {
      type: Number,
      required: true,
    },
    entry: {
      type: Object as PropType<Entry>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    splitSource(): [string, string] {
      return this.entry.source.split(this.entry.group.name) as [string, string]
    },
  },
  methods: {
    getImageUrl(image: Image): string {
      return `${CONFIG.VUE_APP_CDN_URL}/${this.animeId}/${image.fileName}`
    },
  },
})
</script>

<style lang="scss" scoped>
.info {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--bg-body);
  font-size: 22px;

  z-index: 2;
}

.images {
  display: flex;
  flex-direction: column;
  //gap: 16px;

  & > .image-container {
    display: flex;
    flex-direction: column;

    & > .image {
      min-height: calc(33vw * 0.55);
      width: 100%;
      object-fit: contain;
    }

    & > .timestamp {
      position: sticky;
      bottom: 0;
      padding: 4px;

      border-bottom: 4px solid var(--highlight-primary-primary);
      background: var(--bg-body);
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 800;
      font-variant: tabular-nums;
    }
  }
}
</style>
