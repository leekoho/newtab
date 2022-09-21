import { App } from 'vue'
import hljs from './hljs'
import elDrawerDragWidth from './el-drawer-drag-width'

export const setupDirectives = (app: App<Element>) => {
  app.directive('hljs', hljs)
  app.directive('el-drawer-drag-width', elDrawerDragWidth)
}
