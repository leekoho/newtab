<template>
  <h4 class="mb-5">配置</h4>

  <el-form label-position="left">
    <el-form-item label="数据来源">
      <el-radio-group v-model="dataSource" @change="onDataSourceChange">
        <el-radio v-for="item in dataSources" :key="item.value" :label="item.value" border>
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>

  <!--    <pre contenteditable="true"><code v-hljs:plaintext>const a = 'test'</code></pre>-->

  <div class="my-5 flex items-center justify-between">
    <h4>{{ dataSourceLabel }}</h4>
    <el-button
      size="small"
      type="info"
      :disabled="dataSource === DataSource.FILE"
      @click="copy(source)"
    >
      复制
    </el-button>
  </div>
  <el-input
    v-if="dataSource === DataSource.STRING"
    v-model="source"
    type="textarea"
    :rows="8"
    placeholder="请粘贴"
    @input="doEncode"
  />
  <el-upload
    v-else
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    accept="image/*"
    :multiple="false"
    drag
    class="w-full"
    :on-change="onFileListChange"
  >
    <div class="flex h-full flex-col items-center justify-center">
      <svg-icon name="upload" class="text-6xl text-gray-300" />
      <div class="el-upload__text">将文件拖入此处 或 <em>点击上传</em></div>
    </div>
  </el-upload>

  <div class="my-5 flex items-center justify-between">
    <h4>编码</h4>
    <el-button size="small" type="info" @click="copy(target)">复制</el-button>
  </div>
  <el-input v-model="target" type="textarea" :rows="8" placeholder="请粘贴" @input="doDecode" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { decode, encode, isValid } from 'js-base64'
import { useClipboard } from '@vueuse/core'
import type { UploadFile } from 'element-plus'

enum DataSource {
  STRING = 'string',
  FILE = 'file',
}

const dataSources: LabelValueOptions<DataSource> = [
  { label: '字符串', value: DataSource.STRING },
  { label: '文件', value: DataSource.FILE },
]

const dataSource = ref<DataSource>(DataSource.STRING)

const dataSourceLabel = computed(
  () => dataSources.find(item => item.value === dataSource.value)?.label
)

const onDataSourceChange = () => {
  source.value = ''
  target.value = ''
}

const source = ref('')
const target = ref('')

const doEncode = () => {
  if (dataSource.value !== DataSource.STRING) return
  try {
    target.value = encode(source.value)
  } catch (e) {
    console.log(e)
    target.value = '[编码失败]'
  }
}

const doDecode = () => {
  if (dataSource.value !== DataSource.STRING) return

  const isValidTarget = isValid(target.value)

  if (!isValidTarget) {
    source.value = '[不是合法的base64格式内容]'
    return
  }

  try {
    source.value = decode(target.value)
  } catch (e) {
    console.log(e)
    source.value = '[解码失败]'
  }
}

const onFileListChange = (file: UploadFile) => {
  if (!file.raw) return

  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = e => {
    const _result = e.target?.result as string
    if (_result) {
      target.value = _result
    }
  }
}

const { copy } = useClipboard()
</script>
