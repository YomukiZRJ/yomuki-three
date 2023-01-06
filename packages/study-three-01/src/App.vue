<script setup lang="ts">
import useGalaxyGenerator from './three/use-galaxy -generator'

const canvasRef = ref < HTMLCanvasElement | null >(null)
const { width, height } = useWindowSize()
onMounted(() => {
  if (canvasRef.value) useGalaxyGenerator(canvasRef.value, width, height)
})
</script>

<template>
  <div class="study-three">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.study-three {
  width: 100vw;
  height: 100vh;
}
</style>
