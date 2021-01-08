<template>
  <transition-group tag="div" class="timestamp-input">
    <div class="input">
      <input
        key="input"
        v-model="input"
        v-maska="['##:##', '##:##.###']"
        placeholder="00:00.000"
        :style="{ zIndex: 100 }"
      />

      <button @click="addTimestamp(input)">
        <Icon :icon="mdiPlus" :size="24" />
      </button>
    </div>

    <div
      v-for="(timestamp, i) in timestamps"
      :key="timestamp.id"
      class="input"
      :style="{ zIndex: 99 - i }"
    >
      <input
        v-model="timestamp.value"
        v-maska="'##:##.###'"
        placeholder="00:00.000"
        @blur="handleTimestampBlur(i)"
      />

      <button @click="removeTimestamp(i)">
        <Icon :icon="mdiMinus" :size="24" />
      </button>
    </div>
  </transition-group>
</template>

<script lang="ts" setup>
import { mdiPlus, mdiMinus } from "@mdi/js"
import { ref } from "vue"

import { useTimestampInput } from "../hooks/timestamp-input"

const validTimestamp = (str: string) =>
  str === "" || str.length < 5 || str.length === 6

const { timestamps } = useTimestampInput()

const id = ref(0)

const sortTimestamps = () => {
  timestamps.value = timestamps.value.sort((a, b) =>
    a.value.localeCompare(b.value),
  )
}

const handleTimestampBlur = (index: number) => {
  if (timestamps.value[index].value.length < 1) {
    removeTimestamp(index)
  }

  sortTimestamps()
}

const addTimestamp = (value: string) => {
  if (!validTimestamp(value)) return

  timestamps.value.push({ value, id: id.value.toString() })
  sortTimestamps()

  input.value = ""
  id.value++
}

const removeTimestamp = (index: number) => {
  timestamps.value = [
    ...timestamps.value.slice(0, index),
    ...timestamps.value.slice(index + 1),
  ]
}

const input = ref("")
</script>

<style lang="scss" scoped>
.timestamp-input {
  position: relative;
  width: 100%;

  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;

  & > .input {
    position: relative;
    display: flex;
    border-bottom: 1px solid var(--bg-body);

    font-variant: tabular-nums;
    font-size: 1.1em;

    --button-width: 30px;

    & > input {
      padding-right: 5px;
      width: calc(100% - var(--button-width));
      text-align: center;
      border-radius: 0;
    }

    &:first-of-type > input {
      border-top-left-radius: 8px;
    }

    &:last-of-type > input {
      border-bottom-left-radius: 8px;
    }

    & > button {
      width: var(--button-width);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;

      border: none;
      background: var(--bg-primary);
      cursor: pointer;

      &:hover {
        background: var(--bg-primary-hover);
      }
    }

    &:first-of-type > button {
      border-top-right-radius: 8px;
    }

    &:last-of-type > button {
      border-bottom-right-radius: 8px;
    }

    &.v-move {
      transition: transform 500ms;
    }

    &.v-enter-active,
    &.v-leave-active {
      transition: opacity 350ms, transform 500ms ease-out;

      &.v-leave-active {
        position: absolute;
      }
    }

    &.v-enter-from,
    &.v-leave-to {
      opacity: 0;
      transform: translateY(-50%);
    }

    &.v-enter-to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
