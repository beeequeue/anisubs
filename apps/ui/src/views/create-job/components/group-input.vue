<template>
  <div class="anime-input">
    <input
      v-model.trim="groupName"
      placeholder="Group (Optional)"
      :class="{ empty: groupName.length < 1 }"
    />
  </div>
</template>

<script lang="ts" setup>
import { useGroupInput } from "../hooks/group-input"

const { groupName } = useGroupInput()
</script>

<style lang="scss" scoped>
.anime-input {
  width: 133px;

  & > input {
    width: 100%;
    height: 39px;
    text-align: center;

    &.empty {
      font-size: 0.75em;
    }
  }

  & > .cover {
    position: relative;
    height: 200px;
    width: 133px;
    margin-bottom: 10px;

    border-radius: 15px;
    background: var(--bg-secondary);
    overflow: hidden;

    & > img,
    & > .placeholder {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }

    & > img {
      object-fit: cover;
    }

    & > .placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
  }
}
</style>
