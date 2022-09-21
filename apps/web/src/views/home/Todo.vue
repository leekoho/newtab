<template>
  <section-title icon="todolist" title="Todo List" />

  <section class="space-y-4 rounded-xl bg-white p-4">
    <el-skeleton :rows="5" :loading="loading" animated>
      <template #default>
        <p class="text-xs font-medium">
          <span class="text-base text-blue-500">{{ todoList.length }}</span>
          项代办事项
        </p>

        <input
          v-model="title"
          type="text"
          placeholder="写下你的代办事项"
          class="w-full appearance-none rounded border-none bg-gray-100 px-3 py-2 text-sm focus:outline-none active:border-none"
          @keyup.enter="addTodo"
        />

        <el-scrollbar height="200px" noresize always>
          <vue-draggable-next
            class="todo-list"
            tag="ul"
            :animation="200"
            ghost-class="ghost"
            :list="todoList"
            @start="dragging = true"
            @end="dragging = false"
          >
            <transition-group type="transition" :name="dragging ? '' : 'flip'">
              <li v-for="todo in todoList" :key="todo.id" class="todo-list__item">
                <checkbox v-model="todo.isCompleted">
                  <span
                    class="hover:text-gray-400"
                    :class="todo.isCompleted ? 'text-gray-400' : ''"
                  >
                    {{ todo.title }}
                  </span>
                </checkbox>

                <!--                <div class="todo-list__actions">-->
                <!--                  <svg-icon name="close" class="todo-list__icon-close" />-->
                <!--                </div>-->
              </li>
            </transition-group>
          </vue-draggable-next>
        </el-scrollbar>

        <p
          class="cursor-pointer text-center text-xs text-blue-500 hover:text-blue-600"
          @click="completedListVisible = !completedListVisible"
        >
          显示已完成的事项({{ completedList.length }})
          <svg-icon
            name="arrow"
            class="transform text-xs transition-transform"
            :class="completedListVisible ? '-rotate-180' : ''"
          />
        </p>

        <el-collapse-transition v-show="completedListVisible">
          <el-scrollbar tag="ul" height="300px" noresize view-class="todo-list">
            <transition-group type="transition" name="flip">
              <li v-for="completed in completedList" :key="completed.id" class="todo-list__item">
                <checkbox v-model="completed.isCompleted">
                  <span class="text-gray-400">{{ completed.title }}</span>
                </checkbox>
              </li>
            </transition-group>
          </el-scrollbar>
        </el-collapse-transition>
      </template>
    </el-skeleton>
  </section>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useStorage } from '@vueuse/core'

interface TodoItem {
  id: number | string
  title: string
  isCompleted: boolean
}

const loading = ref(true)

setTimeout(() => {
  loading.value = false
}, 500)

const title = ref('')

const list = useStorage<TodoItem[]>('TODO_LIST', [
  {
    id: 1,
    title: '💼 前端部门会议',
    isCompleted: false,
  },
  {
    id: 2,
    title: '👏 按时下班',
    isCompleted: false,
  },
  {
    id: 3,
    title: '🔗 Nestjs连接数据库',
    isCompleted: false,
  },
  {
    id: 4,
    title: '🚀 Server端错误统一处理',
    isCompleted: false,
  },
  {
    id: 5,
    title: '👮 Todo数据库设计',
    isCompleted: false,
  },
  {
    id: 6,
    title: '📦 完成「优化审批流」任务',
    isCompleted: false,
  },
])

const todoList = computed<TodoItem[]>(() => list.value.filter(t => !t.isCompleted))

const completedList = computed<TodoItem[]>(() => list.value.filter(t => t.isCompleted))

const dragging = ref(false)

let id = 6
const addTodo = () => {
  if (!title.value) return

  id += 1
  list.value.unshift({
    id,
    title: title.value,
    isCompleted: false,
  })
  title.value = ''
}

const removeTodo = (id: number | string) => {
  const idx = list.value.findIndex(t => t.id === id)
  list.value.splice(idx, 1)
}

const completedListVisible = ref(false)
</script>

<style lang="scss">
.ghost {
  @apply opacity-0;
}

.todo-list {
  @apply relative m-0 overflow-x-hidden p-0;

  &__item {
    @apply list-none py-2;

    &:hover > .todo-list__actions {
      @apply visible;
    }
  }

  &__icon-drag {
    @apply h-4 w-4 cursor-move text-gray-500 transition;
  }

  &__icon-close {
    @apply float-right cursor-pointer text-xs text-red-500;
  }

  &__actions {
    @apply invisible float-right;
  }

  .flip-leave-active,
  .flip-enter-active {
    @apply transition duration-500;
  }

  .flip-enter-from,
  .flip-leave-to {
    opacity: 0;
    transform: translateX(20%);
  }

  .flip-enter-to,
  .flip-leave {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
