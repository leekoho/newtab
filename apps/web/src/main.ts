import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import { setupDirectives } from '@/directives'
import 'virtual:windi.css'
import 'virtual:svg-icons-register'
import '@/index.scss'

const bootstrap = async () => {
  const app = createApp(App)

  // Configure Widgets routing
  // await setupWidgetRouter(app)

  // Configure routing
  setupRouter(app)

  // Setup directives
  setupDirectives(app)

  // Mount when the route is ready
  await router.isReady()
  app.mount('#app', true)
}

bootstrap()
