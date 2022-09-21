<template>
  <el-scrollbar height="100vh" noresize view-class="container mx-auto min-h-screen px-5 sm:px-0">
    <section class="flex items-center justify-between py-5">
      <h1>{{ meridiem }}好, leekoho</h1>
      <div class="flex items-center">
        <!--        <svg-icon-->
        <!--          name="setting"-->
        <!--          class="mr-10 cursor-pointer text-gray-500"-->
        <!--          @click="dialogVisible = true"-->
        <!--        />-->

        <div class="text-right">
          <h2>{{ now.format('hh:mm') }} {{ meridiem }}</h2>
          <p class="mt-1 text-sm text-gray-400">
            {{ now.format('MM 月 DD 日, dddd') }}
          </p>
        </div>
      </div>
    </section>

    <router-view />
  </el-scrollbar>

  <!--  <el-dialog v-model="dialogVisible" width="800px" class="rounded-lg">-->
  <!--    <el-form label-position="top">-->
  <!--      <el-tabs type="border-card">-->
  <!--        <el-tab-pane label="巨幕">-->
  <!--          <el-form-item label="文字">-->
  <!--            <el-input-->
  <!--              v-model="globalConfig.jumbotronText"-->
  <!--              type="textarea"-->
  <!--              :rows="5"-->
  <!--              class="leading-5"-->
  <!--            />-->
  <!--            <jumbotron />-->
  <!--          </el-form-item>-->
  <!--        </el-tab-pane>-->
  <!--        <el-tab-pane label="网易云音乐">-->
  <!--          &lt;!&ndash;          <el-alert close-text="知道了">&ndash;&gt;-->
  <!--          &lt;!&ndash;            <template #title> 填入网易云音乐歌单ID即可替换 </template>&ndash;&gt;-->
  <!--          &lt;!&ndash;          </el-alert>&ndash;&gt;-->
  <!--          <el-form-item></el-form-item>-->
  <!--        </el-tab-pane>-->
  <!--        <el-tab-pane label="Todo List"> </el-tab-pane>-->
  <!--      </el-tabs>-->
  <!--    </el-form>-->

  <!--    &lt;!&ndash;    <template #footer>&ndash;&gt;-->
  <!--    &lt;!&ndash;      <el-button size="small">取消</el-button>&ndash;&gt;-->
  <!--    &lt;!&ndash;      <el-button type="primary" size="small">保存</el-button>&ndash;&gt;-->
  <!--    &lt;!&ndash;    </template>&ndash;&gt;-->
  <!--  </el-dialog>-->
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Jumbotron from '@/views/home/Jumbotron.vue'

dayjs.extend(localizedFormat)
dayjs.locale('zh-cn')

const now = ref(dayjs())

const timer = setInterval(() => {
  now.value = dayjs()
}, 1000)

onBeforeUnmount(() => {
  clearInterval(timer)
})

const meridiem = computed(() => {
  return now.value.format('A')
})

const dialogVisible = ref(false)

const globalConfig = reactive({
  jumbotronText: '代码是写给人看的，\n附带能在机器上运行。',
})
</script>
