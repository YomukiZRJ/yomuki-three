import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        // presets
        'vue',
        '@vueuse/core'
        // {
        //   '@vueuse/core': [
        //     // named imports
        //     'useMouse', // import { useMouse } from '@vueuse/core',
        //   ],
        // },
      ],
      dirs: ['src/three', 'src/hooks'],
      eslintrc: {
        enabled: true // <-- this
      }
    }),
    glsl()
  ],
  server: {
    port: 8088
  }
})
