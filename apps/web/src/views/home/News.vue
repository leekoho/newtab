<template>
  <section-title icon="quotes" title="News" />

  <section class="rounded-xl bg-white transition">
    <div class="grid transform cursor-pointer grid-cols-3 gap-4 p-4">
      <div
        v-for="(channel, idx) in channelList"
        class="text-center"
        @click="onClickChannel(channel)"
      >
        <svg-icon :key="idx" :name="channel.value" class="text-5xl" />
        <p class="mt-2 font-bold" :class="channel.value === currentChannel ? 'text-blue-500' : ''">
          {{ channel.label }}
        </p>
      </div>
    </div>

    <!--    <section class="transform -rotate-y-180 hover:(rotate-y-0) backface-hidden">-->
    <el-scrollbar ref="scrollbarRef" height="400px" noresize view-class="px-4">
      <el-skeleton animated :throttle="500" :loading="loading">
        <template #template>
          <el-skeleton-item v-for="item in 10" :key="item" class="mb-4 block h-5" />
        </template>

        <template #default>
          <a
            v-for="(news, idx) in newsList"
            :key="idx"
            :href="news.url"
            target="_blank"
            :title="news.title"
            class="visited:(text-gray-400) hover:(text-blue-500) mb-4 flex items-center justify-between"
          >
            <span>{{ idx + 1 }}.</span>
            <span class="flex-auto truncate text-left text-sm"> {{ news.title }}</span>
            <span class="ml-1 whitespace-nowrap text-xs text-gray-400">{{ news.extra }}</span>
          </a>
        </template>
      </el-skeleton>
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { fetchNewsList, NewsModel } from '@/apis/news'
import type { ElScrollbar } from 'element-plus'

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

interface NewsChannel {
  label: string
  value: string
}

const channelList: NewsChannel[] = [
  { label: '知乎热榜', value: 'zhihu' },
  { label: '虎扑步行街', value: 'hupu' },
  { label: '脉脉热榜', value: 'maimai' },
]
const currentChannel = ref<string>(channelList[0].value)

const newsList = ref<NewsModel[]>([])

const loading = ref(false)
fetchNewsList(currentChannel.value).then(news => {
  newsList.value = news
})

const initNewsList = async () => {
  loading.value = true
  scrollbarRef.value!.setScrollTop(0)
  newsList.value = await fetchNewsList(currentChannel.value)
  loading.value = false
}

const onClickChannel = (channel: NewsChannel) => {
  console.log(channel)
  currentChannel.value = channel.value
  initNewsList()
}
</script>
