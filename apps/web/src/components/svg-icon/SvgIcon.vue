<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    prefix?: string
  }>(),
  {
    prefix: 'icon',
  }
)

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  font-size: 1rem;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
