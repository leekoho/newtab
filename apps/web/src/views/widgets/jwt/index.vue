<template>
  <div class="mb-5 flex items-center justify-between">
    <h4>Token</h4>
    <el-button size="small" type="info" @click="paste">粘贴</el-button>
  </div>
  <el-input v-model="token" type="textarea" :rows="5" autofocus />

  <div class="my-5 flex items-center justify-between">
    <h4>Header</h4>
    <el-button size="small" type="info" @click="_copy(header)">复制</el-button>
  </div>
  <pre><code v-hljs:json>{{ header }}</code></pre>

  <div class="my-5 flex items-center justify-between">
    <h4>Payload</h4>
    <el-button size="small" type="info" @click="_copy(payload)">复制 </el-button>
  </div>
  <pre><code v-hljs:json>{{ payload }}</code></pre>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import jwtDecode, { JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode'
import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()

const token = ref<string>(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlZWtvaG85NSIsImlhdCI6MTY0NzQwMTc1NSwiZXhwIjoxNjQ5OTkzNzU1fQ.9rbKw7XaGl3t2i08QKjldTy9_-mMXRDblseDFGh4QPQ'
)

function _jwtDecode<T = unknown>(token: string, options?: JwtDecodeOptions): T | string {
  try {
    return jwtDecode(token, options)
  } catch (e) {
    return '[解码失败]'
  }
}

const header = computed(() => _jwtDecode<JwtHeader>(token.value, { header: true }))
const payload = computed(() => _jwtDecode<JwtPayload>(token.value))

const _copy = (source: JwtPayload | JwtHeader | string) => {
  if (typeof source === 'string') return copy(source)

  return copy(JSON.stringify(source))
}

// Safari浏览器下会有奇怪的表现
const paste = async () => {
  token.value = await navigator.clipboard.readText()
}
</script>
