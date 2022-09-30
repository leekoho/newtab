<template>
  <label class="cursor-pointer">
    <input
      v-model="checked"
      type="checkbox"
      class="h-4 w-4 rounded border-gray-400 align-middle focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:ring-offset-0"
      @change="$emit('change', checked)"
    />

    <span class="pl-2 align-middle text-sm" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: boolean
    disabled: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
  }
)

const emits = defineEmits(['update:modelValue'])

const checked = useVModel(props, 'modelValue', emits, { passive: true })
</script>
