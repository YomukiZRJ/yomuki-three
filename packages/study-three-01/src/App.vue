<script setup lang="ts">

const canvasRef = ref < HTMLCanvasElement | null >(null)
const { width, height } = useWindowSize()
onMounted(() => {
  if (canvasRef.value) useParticles(canvasRef.value, width, height)
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
