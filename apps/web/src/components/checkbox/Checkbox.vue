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

<script lang="ts">
import { defineComponent, computed, CSSProperties } from 'vue'
import VueTypes from 'vue-types'

type Booleanish = boolean | 'true' | 'false'

export default defineComponent({
  name: 'Checkbox',

  emits: ['update:modelValue', 'change'],

  props: {
    label: VueTypes.string,
    modelValue: VueTypes.bool.def(false),
    disabled: VueTypes.bool.def(false),
  },

  setup(props, context) {
    const checked = computed<Booleanish>({
      get() {
        return props.modelValue
      },
      set(val) {
        context.emit('update:modelValue', val)
      },
    })

    return {
      checked,
    }
  },
})
</script>
