<script setup lang="ts">

const canvasRef = ref < HTMLCanvasElement | null >(null)
const { width, height } = useWindowSize()

onMounted(() => {
  if (canvasRef.value) useRealisticRender(canvasRef.value, width, height)
})

</script>

<template>
  <canvas
    ref="canvasRef"
    class="webgl"
  />
  <!-- <scroll-based-animation /> -->
</template>

<style scoped>
.webgl{
  position: fixed;
    top: 0;
    left: 0;
    outline: none;
}
</style>
