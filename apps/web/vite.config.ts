import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import WindiCSS from 'vite-plugin-windicss'
import HtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = resolve(__dirname, '../../')
  const envPrefix = ['VITE', 'APP']
  const env: { [key: string]: any } = loadEnv(mode, envDir, envPrefix)

  return {
    base: '/',
    envDir,
    envPrefix,
    server: {
      port: env.VITE_PORT,
      proxy: {
        '/apis': `http://localhost:${env.APP_SERVER_PORT}`,
      },
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, '/src') }],
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),

      // https://cn.vitejs.dev/guide/using-plugins.html#conditional-application
      {
        ...visualizer(),
        apply: 'build',
      },

      HtmlEnv({
        // @ts-ignore
        envPrefixes: envPrefix,
      }),

      Components({
        dts: 'types/components.d.ts',
        resolvers: [ElementPlusResolver()],
      }),

      // https://github.com/antfu/vite-plugin-windicss
      WindiCSS({
        // safelist: 'prose prose-sm m-auto text-left',
      }),

      // https://github.com/anncwb/vite-plugin-svg-icons
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(__dirname, 'src/assets/icons')],
        // 指定是否使用 svgo 压缩
        svgoOptions: true,
        // 指定 symbolId 格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    // 配置Dep优化行为
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'axios',
        'dayjs',
        'lodash-es',
        'element-plus',
        'vue-draggable-next',
      ],
    },
  }
})
