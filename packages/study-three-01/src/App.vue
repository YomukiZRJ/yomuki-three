<script setup lang="ts">
// const fps = useFps()
const canvasRef = ref < HTMLCanvasElement | null >(null)
const { width, height } = useWindowSize()
useStats()
onMounted(() => {
  if (canvasRef.value) useMixingHtmlAndWebgl(canvasRef.value, width, height)
})
// onMounted(() => {
//   if (canvasRef.value)
//     useCodeStructuringForBiggerProjects(canvasRef)
// })
</script>

<template>
  <canvas
    ref="canvasRef"
    class="webgl"
  />
  <mixing-html-and-webgl />
  <!-- <div class="fps">
    {{ fps }}
  </div> -->
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
