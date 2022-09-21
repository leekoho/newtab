<template>
  <div class="mb-4">
    <input
      v-model="keywords"
      placeholder="输入显卡名称进行搜索，可用 ; 分隔关键字"
      @search="onSearch"
    />
  </div>

  <!--  <el-table-->
  <!--    v-loading="loading"-->
  <!--    element-loading-text="拼命加载中"-->
  <!--    :data="dataSource"-->
  <!--    border-->
  <!--    stripe-->
  <!--    size="small"-->
  <!--  >-->
  <!--    <el-table-column type="index" align="center" />-->
  <!--    <el-table-column label="名称" prop="name" />-->
  <!--    <el-table-column label="评分" width="150" align="center">-->
  <!--      <template #default="scope">-->
  <!--        <el-progress-->
  <!--          type="circle"-->
  <!--          :width="60"-->
  <!--          :stroke-width="4"-->
  <!--          stroke-linecap="butt"-->
  <!--          :percentage="Math.round((scope.row.score / maxScore) * 100)"-->
  <!--        >-->
  <!--          <span class="text-base">{{ scope.row.score }}</span>-->
  <!--        </el-progress>-->
  <!--      </template>-->
  <!--    </el-table-column>-->
  <!--  </el-table>-->
  <table class="table w-full table-auto">
    <tr>
      <th class="py-2 px-4">名称</th>
      <th class="py-2 px-4">评分</th>
    </tr>
    <tr v-for="item in dataSource.list" :key="item.id">
      <td class="border py-2 px-4 font-medium">
        {{ item.name }}
      </td>
      <td class="border py-2 px-4 font-medium">
        <!--        <a-progress-->
        <!--          type="dashboard"-->
        <!--          size="small"-->
        <!--          :width="50"-->
        <!--          :percent="Math.round((item.score / maxScore) * 100)"-->
        <!--          status="normal"-->
        <!--        >-->
        <!--          <template #format>{{ item.score }}</template>-->
        <!--        </a-progress>-->
      </td>
    </tr>
  </table>
  <!--  <a-table-->
  <!--    :data-source="dataSource"-->
  <!--    :columns="columns"-->
  <!--    :row-key="record => record.id"-->
  <!--    :pagination="false"-->
  <!--    :loading="loading"-->
  <!--    bordered-->
  <!--    size="small"-->
  <!--  >-->
  <!--    <template #expandedRowRender="{ record }">-->
  <!--      <a-descriptions bordered size="small" :column="1">-->
  <!--        <a-descriptions-item label="核心频率">-->
  <!--          {{ record.coreClock }}-->
  <!--        </a-descriptions-item>-->
  <!--        <a-descriptions-item label="流处理器">{{ record.streamPro }}</a-descriptions-item>-->
  <!--        <a-descriptions-item label="显存类型">{{ record.memoryRate }}</a-descriptions-item>-->
  <!--        <a-descriptions-item label="显存容量">{{ record.memorySize }}</a-descriptions-item>-->
  <!--      </a-descriptions>-->
  <!--    </template>-->
  <!--    <template #score="{ text: score }">-->
  <!--      <a-progress-->
  <!--        type="dashboard"-->
  <!--        size="small"-->
  <!--        :width="50"-->
  <!--        :percent="Math.round((score / maxScore) * 100)"-->
  <!--        status="normal"-->
  <!--      >-->
  <!--        <template #format>{{ score }}</template>-->
  <!--      </a-progress>-->
  <!--    </template>-->
  <!--  </a-table>-->
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, toRefs } from 'vue'
import { getGraphicsCardRankingApi, GraphicsCardModel } from '@/apis/graphics-card'

export default defineComponent({
  name: 'GraphicsCardRanking',
  setup() {
    let dataSource = reactive<{ list: GraphicsCardModel[] }>({
      list: [],
    })
    const loading = ref(true)
    const keywords = ref('')

    let list: GraphicsCardModel[] = []

    getGraphicsCardRankingApi()
      .then((data: GraphicsCardModel[]) => {
        dataSource.list = data
        list = data
      })
      .finally(() => (loading.value = false))

    const maxScore = computed(() =>
      list.map(t => t.score).reduce((prev, item) => (prev > item ? prev : item), 0)
    )

    const onSearch = (searchValue: string) => {
      if (searchValue === '') {
        dataSource.list = list
        return
      }
      const keywordArr = searchValue
        .split(';')
        .filter(Boolean)
        .map(t => t.trim().toUpperCase())

      dataSource.list = list.filter(t => {
        return keywordArr.some(keyword => t.name.toUpperCase().indexOf(keyword) > -1)
      })
    }

    return {
      dataSource,
      maxScore,
      loading,
      keywords,
      onSearch,
    }
  },
})
</script>
