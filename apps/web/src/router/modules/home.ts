import DefaultLayout from '@/layouts/default.vue'
export default {
  path: '/',
  component: DefaultLayout,
  children: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        keepAlive: true,
      },
    },
  ],
}
