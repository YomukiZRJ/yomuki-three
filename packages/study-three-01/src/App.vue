<script setup lang="ts">
import { onMounted, ref } from "vue";
import useTransformsObjects from "./three/transforms-objects";
const canvasRef = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvasRef.value) {
    useTransformsObjects(
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
