<template>
  <div class="my-5 flex w-full items-center justify-start">
    <span class="mr-4 flex h-7 w-7 items-center justify-center rounded-md bg-blue-500">
      <svg-icon :name="icon" class="text-lg text-white" />
    </span>
    <span class="flex-1 text-lg font-semibold"> {{ title }} </span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string
  title: string
}>()
</script>
