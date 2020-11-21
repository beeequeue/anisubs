<template>
  <div class="comparison" :class="{ single: entries.length === 1 }">
    <column
      v-for="(entry, index) in entries"
      :key="entry.id"
      :entry="entry"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import { Entry } from "@anisubs/graphql-types"
import { defineComponent, PropType } from "vue"

import Column from "@/components/comparison/column.vue"

export default defineComponent({
  name: "Comparison",
  components: { Column },
  props: {
    entries: {
      type: Object as PropType<Entry[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.comparison {
  display: grid;
  grid-auto-columns: calc(50% - 4px);
  grid-template-rows: 60px 1fr;
  grid-column-gap: 8px;

  width: 100%;
  height: 100%;

  &.single {
    grid-auto-columns: initial;
    grid-template-columns: 80%;
    justify-content: center;
  }
}
</style>
