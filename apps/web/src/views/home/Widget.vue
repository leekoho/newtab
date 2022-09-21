<template>
  <section-title icon="widget" title="Widget" />

  <!--  <section v-for="category in widgets" :key="category.category">-->
  <!--    <h4>{{ category.title }}</h4>-->
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <section
      v-for="(widget, idx) in widgets"
      :key="idx"
      class="flex cursor-pointer items-center rounded-md bg-white p-5 px-4 text-sm transition"
      @click="openDrawer(widget)"
    >
      <svg-icon v-if="widget.icon" :name="widget.icon" class="mr-2 text-xl text-blue-500" />
      {{ widget.title }}
    </section>
    <!--    </section>-->
  </section>

  <el-drawer
    v-model="drawerVisible"
    append-to-body
    lock-scroll
    :title="currentWidget?.title"
    size="875px"
  >
    <async-widget-component />
  </el-drawer>
</template>

<script lang="ts" setup>
import {
  AsyncComponentOptions,
  defineAsyncComponent,
  defineComponent,
  h,
  markRaw,
  ref,
  resolveDirective,
  withDirectives,
  computed,
} from 'vue'

const drawerVisible = ref(false)

interface Widget {
  title: string
  description: string
  icon: string
  path: string
}

// interface IWidgets {
//   title: string
//   icon: ''
//   category: WidgetCategoryEnum
//   children: Widget[]
// }

// enum WidgetCategoryEnum {
//   // 转换类
//   CONVERTER = 'converter',
//   // 编码 / 解码类
//   ENCODER_DECODER = 'encoders_decoder',
//   // 格式类
//   FORMATTER = 'formatter',
//   // 生成类
//   GENERATOR = 'generator',
//   // 文本类
//   TEXT = 'text',
//   // 图像类
//   GRAPHIC = 'graphic',
// }

// const widgets = reactive(['MD5加密', 'RSA加密、解密', '文字对比', 'JSON格式化', '代码图片生成'])
const widgets: Widget[] = [
  {
    title: 'Base64编码 / 解码',
    description: '编码、解码Base64格式的数据',
    icon: 'base64',
    path: 'base64',
  },
  {
    title: 'JWT解码',
    description: '根据JWT TOKEN解码出头部和负载',
    icon: 'loading',
    path: 'jwt',
  },
  {
    title: 'JSON格式化',
    description: '格式化或压缩JSON数据',
    icon: 'json',
    path: 'json',
  },
  {
    title: '二维码',
    description: '',
    icon: 'qrcode',
    path: 'qrcode',
  },
  // {
  //   title: '图像类',
  //   icon: '',
  //   category: WidgetCategoryEnum.GRAPHIC,
  //   children: [
  //     {
  //       title: '代码转图片',
  //       mintitle: 'code<>image',
  //       description: '',
  //       icon: '',
  //       path: 'code-to-image',
  //     },
  //   ],
  // },
]

const currentWidget = ref<Widget>()

const asyncWidgetComponent = computed<AsyncComponentOptions>(() => {
  console.log(currentWidget.value)
  return markRaw(
    defineAsyncComponent({
      // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
      loader: () => import(/* @vite-ignore */ `../widgets/${currentWidget.value?.path}/index.vue`),
      loadingComponent: () => {
        const loadingDirective = resolveDirective('loading')

        if (!loadingDirective) {
          return h('div', { class: 'text-gray-500 text-center text-sm' }, '组件加载中...')
        }

        return withDirectives(
          h('div', {
            class: 'h-50',
          }),
          [[loadingDirective, { visible: true, text: '组件加载中...' }]]
        )
      },
      errorComponent: defineComponent({
        render: () =>
          h('div', { class: 'text-red-500 text-center text-sm' }, '加载失败！请刷新重试'),
      }),
      timeout: 10000,
      suspensible: false,
      onError(error, retry, fail, attempts) {
        console.log(error.message, attempts)
        // 如果是网络问题，重新拉取了3次之后，还不行，就返回错误
        if (error.message.match(/fetch/) && attempts < 3) {
          retry()
        } else {
          fail()
        }
      },
    })
  )
})

const openDrawer = (widget: Widget) => {
  currentWidget.value = widget
  drawerVisible.value = true
}
</script>
