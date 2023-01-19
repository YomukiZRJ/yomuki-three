<script setup lang="ts">
import { threeResizeKey } from './utils/event-bus-key'
import type { threeResizeEvent } from './utils/event-bus-key'
import Experience from './libs/StudyCode/Experience'

const fps = useFps()
const bus = useEventBus(threeResizeKey)
const canvasRef = ref < HTMLCanvasElement | null >(null)
useThree(canvasRef)
const handleResize = (val: threeResizeEvent) => {
  // console.log(val)
}
bus.on(handleResize)

// const { width, height } = useWindowSize()

// onMounted(() => {
//   if (canvasRef.value) useCodeStructuringForBiggerProjects(canvasRef.value, width, height)
// })
let exp: null | Experience = null
onMounted(() => {
  if (canvasRef.value)
    exp = new Experience(canvasRef.value)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="webgl"
  />
  <div class="fps">
    {{ fps }}
  </div>
  <!-- <scroll-based-animation /> -->
</template>

<style scoped>
.webgl{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  outline: none;
}
.fps {
  position: fixed;
  top: 0;
  left: 0;
  color: #fff;
  background-color: rgba(0,0,0,.8);
}
</style>
