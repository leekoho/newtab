<template>
  <h4 class="mb-5">配置</h4>

  <el-form label-position="left">
    <el-form-item label="数据来源">
      <el-radio-group v-model="dataSource">
        <el-radio v-for="item in dataSources" :key="item.value" :label="item.value" border>
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-show="dataSource === 'string'" label="容错级别">
      <el-radio-group v-model="correctionLevel">
        <el-radio v-for="level in correctionLevels" :key="level.value" :label="level.value" border>
          {{ level.label }}
        </el-radio>
      </el-radio-group>
      <p class="mt-2 text-xs text-gray-500">
        * 二维码具有"容错"功能，容错级别越高，容错率越高，即二维码污损时数据修复能力越强
      </p>
    </el-form-item>
  </el-form>

  <template v-if="dataSource === 'string'">
    <div class="mb-5">
      <h4>字符串</h4>
    </div>
    <el-input v-model="text" type="textarea" :rows="8" />

    <div class="my-5">
      <h4>二维码</h4>
    </div>
    <img :src="qrcode" alt="QR Code" class="mx-auto" />
  </template>

  <template v-else>
    <div class="mb-5">
      <h4>二维码</h4>
    </div>
    <el-upload
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      accept="image/*"
      :multiple="false"
      drag
      class="w-full"
      :on-change="onFileChange"
    >
      <div class="flex h-full flex-col items-center justify-center">
        <svg-icon name="upload" class="text-6xl text-gray-300" />
        <div class="el-upload__text">将文件拖入此处 或 <em>点击上传</em></div>
      </div>
    </el-upload>

    <div class="my-5 flex items-center justify-between">
      <h4>字符串</h4>
      <el-button size="small" type="info" :disabled="!result" @click="copy(result)">复制</el-button>
    </div>

    <pre v-show="result"><code v-hljs:plaintext>{{ result }}</code></pre>
  </template>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { computedAsync, useClipboard } from '@vueuse/core'
import { toDataURL, QRCodeErrorCorrectionLevel } from 'qrcode'
import jsQR from 'jsqr'
import { UploadFile } from 'element-plus'

const { copy } = useClipboard()

const dataSources = [
  { label: '字符串', value: 'string' },
  { label: '文件', value: 'file' },
] as const
type DataSource = typeof dataSources[number]['value']

const dataSource = ref<DataSource>('string')

const correctionLevel = ref<QRCodeErrorCorrectionLevel>('Q')
const correctionLevels: LabelValueOptions<QRCodeErrorCorrectionLevel> = [
  {
    label: '低',
    value: 'L',
  },
  {
    label: '中',

    value: 'M',
  },
  {
    label: '较高',
    value: 'Q',
  },
  {
    label: '高',
    value: 'H',
  },
]

const text = ref('text-to-qrcode')

const qrcode = computedAsync(
  async () =>
    await toDataURL(text.value, {
      errorCorrectionLevel: correctionLevel.value,
      maskPattern: 1,
    })
)

const onFileChange = ({ raw: file }: UploadFile) => {
  if (!file) return

  const FAIL_TEXT = '「解析失败」'

  if (!file.type.startsWith('image/')) {
    result.value = FAIL_TEXT
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = URL.createObjectURL(file)

  img.onload = () => {
    ctx!.drawImage(img, 0, 0)
    const imageData = ctx!.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

    const qrcode = jsQR(imageData.data, img.naturalWidth, img.naturalHeight)
    if (qrcode?.data) {
      result.value = qrcode.data
    } else {
      result.value = FAIL_TEXT
    }
  }
}
const result = ref('')
</script>
