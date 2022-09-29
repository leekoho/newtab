<template>
  <div class="flex h-full flex-col">
    <h4 class="mb-5">配置</h4>

    <el-form label-position="left">
      <el-form-item label="缩进">
        <el-radio-group v-model="indent">
          <el-radio :label="Indent.TWO_SPACES" border>2个空格</el-radio>
          <el-radio :label="Indent.FORE_SPACES" border>4个空格</el-radio>
          <el-radio :label="Indent.ONE_TAB" border>1个Tab</el-radio>
          <el-radio :label="Indent.COMPRESS" border>压缩</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="grid flex-1 grid-cols-2 gap-x-4">
      <div class="h-full">
        <div class="my-5 flex items-center justify-between">
          <h4>输入</h4>
          <!--          <el-button size="small" type="info">粘贴</el-button>-->
        </div>
        <textarea
          v-model="code"
          class="hljs h-full w-full outline-none"
          placeholder="请输入"
          spellcheck="false"
        />
      </div>

      <div class="h-full">
        <div class="my-5 flex items-center justify-between">
          <h4>输出</h4>
          <el-button size="small" type="info">复制</el-button>
        </div>
        <pre class="h-full w-full"><code v-hljs:json class="h-full">{{_code}}</code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
enum Indent {
  TWO_SPACES,
  FORE_SPACES,
  ONE_TAB,
  COMPRESS,
}

const indentWordMap: Record<Indent, string> = {
  [Indent.TWO_SPACES]: '  ',
  [Indent.FORE_SPACES]: '    ',
  [Indent.ONE_TAB]: '\t',
  [Indent.COMPRESS]: '',
}

const indent = ref(Indent.TWO_SPACES)

const code = ref('{a: 1, b: 2}')

function repeat(s: string, count: number) {
  return new Array(count + 1).join(s)
}

function formatJson(json: string, indent: string) {
  let i = 0
  let len = 0
  let targetJson = ''
  let indentLevel = 0
  let inString = false
  let currentChar = null

  for (i = 0, len = json.length; i < len; i += 1) {
    currentChar = json.charAt(i)

    switch (currentChar) {
      case '{':
      case '[':
        if (!inString && indent !== '') {
          targetJson += currentChar + '\n' + repeat(indent, indentLevel + 1)
          indentLevel += 1
        } else {
          targetJson += currentChar
        }
        break
      case '}':
      case ']':
        if (!inString && indent !== '') {
          indentLevel -= 1
          targetJson += '\n' + repeat(indent, indentLevel) + currentChar
        } else {
          targetJson += currentChar
        }
        break
      case ',':
        if (!inString && indent !== '') {
          targetJson += ',\n' + repeat(indent, indentLevel)
        } else {
          targetJson += currentChar
        }
        break
      case ':':
        if (!inString && indent !== '') {
          targetJson += ': '
        } else {
          targetJson += currentChar
        }
        break
      case ' ':
      case '\n':
      case '\t':
        if (inString) {
          targetJson += currentChar
        }
        break
      case '"':
        if (i > 0 && json.charAt(i - 1) !== '\\') {
          inString = !inString
        }
        targetJson += currentChar
        break
      default:
        targetJson += currentChar
        break
    }
  }
  return targetJson
}

const _code = computed(() => {
  return formatJson(code.value, indentWordMap[indent.value])
  // return JSON.stringify(code.value, null, indentWordMap[indent.value]).replace(
  //   /^['|"](.*)['|"]$/,
  //   '$1'
  // )
})
</script>
