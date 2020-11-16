<template>
  <h1 class="title">
    <slot />

    <span class="underline" />
  </h1>
</template>

<style lang="scss" scoped>
.title {
  position: relative;
  display: inline-block;
  margin: 25px auto;
  width: content-box;

  font-size: 32px;
  //font-weight: 300;
}

.underline {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--highlight-gradient-primary);
  box-shadow: 0 0 4px var(--highlight-primary-shine);
}
</style>
