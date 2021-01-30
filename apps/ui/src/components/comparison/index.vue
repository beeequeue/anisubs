<template>
  <div class="comparison" :class="classes">
    <column
      v-for="(entry, index) in entries"
      :key="entry.id"
      :anime-id="animeId"
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
    animeId: {
      type: Number,
      required: true,
    },
    entries: {
      type: Object as PropType<Entry[]>,
      required: true,
    },
  },
  computed: {
    classes(): unknown {
      return {
        single: this.entries.length === 1,
        double: this.entries.length === 2,
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.comparison {
  display: grid;
  grid-auto-columns: calc(33%);
  grid-template-rows: auto 1fr;
  grid-column-gap: 8px;

  width: 100%;
  height: 100%;

  &.single {
    grid-auto-columns: initial;
    grid-template-columns: 80%;
    justify-content: center;
  }

  &.double {
    grid-auto-columns: calc(50% - 4px);
    justify-content: center;
  }
}
</style>
