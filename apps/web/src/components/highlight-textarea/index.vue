<template>
  <div class="hljs-textarea">
    <textarea v-model="code" ref="textarea" class="hljs-textarea__textarea hljs" @focus="test" />
    <pre class="hljs-textarea__"><code v-hljs:javascript>{{ code }}</code></pre>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue'
import { highlight } from '@/plugins/highlight-js'
const props = withDefaults(
  defineProps<{
    lang: string
    code: string
  }>(),
  {
    lang: 'json',
    code: '',
  }
)

const textarea = ref<HTMLTextAreaElement>()

const test = () => {
  const _textarea = unref(textarea)

  console.log(_textarea?.selectionStart, _textarea?.selectionEnd)
}

highlight(props.lang, props.code).then(res => {
  console.log(res)
})
</script>

<style lang="scss">
.hljs-textarea {
  position: relative;
  width: 100%;
  height: 200px;

  &__textarea {
    position: relative;
    width: 100%;
    height: 100%;
    caret-color: #ffa800;
    background-color: transparent;
    z-index: 2;
    outline: none;
    overflow: auto;
  }

  &__ {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    color: transparent;
    scrollbar-width: none;
    white-space: pre-wrap;
    overflow: auto;
    pointer-events: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
