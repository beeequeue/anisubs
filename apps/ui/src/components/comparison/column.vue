<template>
  <router-link
    v-bind="$attrs"
    :to="`/group/${entry.group.id}`"
    class="group"
    :style="{ gridColumn: `${index + 1} / span 1`, gridRow: '1 / span 1' }"
  >
    {{ entry.group.name }}
  </router-link>

  <div
    :style="{ gridColumn: `${index + 1} / span 1`, gridRow: '2 / span 1' }"
    class="images"
  >
    <div v-for="image in entry.images" :key="image.id" class="image-container">
      <img :src="image.url" class="image" />

      <div class="timestamp">{{ image.timestamp }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Entry } from "@anisubs/graphql-types"
import { defineComponent, PropType } from "vue"

export default defineComponent({
  name: "Column",
  props: {
    entry: {
      type: Object as PropType<Entry>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.group {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--bg-body);
  font-size: 32px;

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
      min-height: calc(50vw * 0.55);
      width: 100%;
      object-fit: contain;
    }

    & > .timestamp {
      position: sticky;
      bottom: 0;
      padding: 4px;

      background: var(--bg-body);
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 800;
      font-variant: tabular-nums;
    }
  }
}
</style>
