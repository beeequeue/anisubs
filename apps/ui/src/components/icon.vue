<template>
  <span class="icon" :aria-label="label">
    <svg viewBox="0 0 24 24">
      <path :d="icon" />
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    sizeStr(): string {
      return `${this.size}px`
    },
  },
})
</script>

<style lang="scss" scoped vars="{ sizeStr }">
.icon {
  position: relative;
  display: inline-block;
  height: var(--sizeStr);
  width: var(--sizeStr);

  & > svg {
    height: 100%;
    width: 100%;
  }
}
</style>
