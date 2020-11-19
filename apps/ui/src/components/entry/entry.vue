<template>
  <router-link :to="`/anime/${entry.anime.id}`" class="entry">
    <div class="image-container">
      <img :src="entry.anime.anilist.imageMedium" class="image" />

      <img :src="entry.anime.anilist.imageMedium" class="image shadow" />
    </div>

    <div class="info">
      <div class="title">{{ entry.anime.anilist.title }}</div>

      <router-link :to="`/group/${entry.group.id}`" class="group"
        >{{ entry.group.name }}
      </router-link>

      <time :datetime="entry.createdAt">{{ createdAt }}</time>
    </div>

    <span class="end-line" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { EntryComponentFragment } from "@anisubs/graphql-types"

const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

const dateFormatter = (date: Date | number | string) =>
  Intl.DateTimeFormat(undefined, dateOptions).format(
    typeof date === "string" ? new Date(date) : date,
  )

export default defineComponent({
  props: {
    entry: {
      type: Object as PropType<EntryComponentFragment>,
      required: true,
    },
  },
  computed: {
    createdAt(): string {
      return dateFormatter(this.entry.createdAt)
    },
  },
})
</script>

<style lang="scss" scoped>
.entry {
  position: relative;
  display: flex;

  width: 100%;
  max-width: 450px;

  // Reset styles from router-link
  color: var(--text-primary);
  font-weight: 400;
  text-shadow: none;
  text-decoration: none;

  & > .image-container {
    position: relative;
    height: 75px;
    width: 52px;
    flex-shrink: 0;

    & > .image {
      position: relative;
      height: 100%;
      width: 100%;
      object-fit: cover;

      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      z-index: 2;

      &.shadow {
        position: absolute;
        top: -3px;
        left: -3px;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        z-index: 1;
        filter: blur(8px) opacity(0.25) brightness(0.5);

        will-change: filter;
        transition: filter 0.2s;
      }
    }
  }

  & > .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 100%;
    padding: 0 12px;

    & > time {
      margin-top: auto;
      margin-left: auto;
      color: var(--text-tertiary);
    }
  }

  & > .end-line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--highlight-gradient-primary-vertical);
    box-shadow: 0 0 4px var(--highlight-primary-shine);

    transition: box-shadow 0.2s;
  }

  &:hover {
    & .image.shadow {
      filter: blur(8px) opacity(0.5) brightness(0.5);
    }

    & .end-line {
      box-shadow: 0 0 8px var(--highlight-primary-shine);
    }
  }
}
</style>
