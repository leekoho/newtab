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

  <div class="mb-5">
    <h4>输入</h4>
  </div>
  <el-input v-model="text" />

  <div class="my-5">
    <h4>输出</h4>
  </div>

  <img :src="qrcode" alt="QR Code" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

enum DataSource {
  STRING = 'string',
  FILE = 'file',
}

const dataSources: LabelValueOptions<DataSource> = [
  { label: '字符串', value: DataSource.STRING },
  { label: '文件', value: DataSource.FILE },
]

const dataSource = ref('')

const text = ref('text-to-qrcode')
const qrcode = useQRCode(text)
</script>
