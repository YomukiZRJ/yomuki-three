<script setup lang="ts">
import { onMounted, ref } from "vue";
import useTransformsObjects from "./three/transforms-objects";
import useAnimations from "./three/animations";
import useAnimationsGsap from "./three/animations-gsap";
import useCamera from "./three/camera";
import useOrbitControls from "./three/orbit-controls";
const canvasRef = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvasRef.value) {
    useOrbitControls(canvasRef.value, window.innerWidth, window.innerHeight);
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
