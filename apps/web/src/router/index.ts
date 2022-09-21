import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { ref } from 'vue'
import { WidgetModel } from '@/apis/widget'
import DefaultLayout from '@/layouts/default.vue'
import { CategoryWidgetsModel, getCategoryWithWidgetList } from '@/apis/category'

export const routes: RouteRecordRaw[] = Object.values(
  import.meta.glob<{ default: RouteRecordRaw }>('./modules/**/*.ts', {
    eager: true,
  })
).map(t => t.default)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 16,
      }
    }
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  // if (to.meta.title) {
  //   const defaultTitle = import.meta.env.VITE_APP_TITLE as string
  //   const setTitle = useTitle(defaultTitle, true)
  //   setTitle(`${defaultTitle} - ${to.meta.title}`)
  // }
  next()
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}

// 根据后台的控件列表动态添加路由
export function asyncWidgetComponent(widgets: WidgetModel[]) {
  const widgetModules = import.meta.glob('/src/views/widgets/**/*.vue')
  router.addRoute({
    path: '/widget',
    component: DefaultLayout,
    name: 'Widget',
    children: widgets
      .filter(widget => widget.path && widget.componentPath)
      .map(widget => ({
        path: `/widget${widget.path}`,
        component: widgetModules[widget.componentPath],
        meta: {
          title: widget.name,
          intro: widget.intro,
        },
      })),
  })
}

export async function setupWidgetRouter(app: App<Element>) {
  const categories = ref<CategoryWidgetsModel[]>([])
  app.provide('categories', categories)

  const data = await getCategoryWithWidgetList()

  categories.value = data

  const widgets = data.map(t => t.widgets).flat()
  asyncWidgetComponent(widgets)
}

export default router
