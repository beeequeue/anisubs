<template>
  <div class="hello"/>
</template>

<script lang="ts" setup>
import { useRecentlyAddedFeedQuery } from "@anisubs/graphql-types"
import { defineComponent } from "vue"

export default defineComponent({
  props: {
  },
  setup() {
    const result = useRecentlyAddedFeedQuery()

  },
})
</script>

<style lang="scss" scoped>

</style>
