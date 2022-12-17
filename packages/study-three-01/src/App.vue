<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvasRef.value) {
    useFullscreenAndResizing(
      canvasRef.value,
      window.innerWidth,
      window.innerHeight
    );
  }
});
</script>

<template>
  <div class="study-three">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.study-three {
  width: 100vw;
  height: 100vh;
}
</style>
