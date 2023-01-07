<template>
  <section class="section">
    <h1>你不是第一个离开的人</h1>
  </section>
  <section class="section">
    <h2>也不是我最后一道伤痕</h2>
  </section>
  <section class="section">
    <h2>夜来了谁也留不住白昼</h2>
  </section>
</template>

<script lang="ts" name="scrollBasedAnimation" setup>
</script>

<style scoped>
.section
{
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    font-family: 'Cabin', sans-serif;
    color: #ffeded;
    text-transform: uppercase;
    font-size: 7vmin;
    padding-left: 10%;
    padding-right: 10%;
}
.section h2,.section h1 {
  font-size: 7vmin;
}
section:nth-child(odd)
{
    justify-content: flex-end;
}
</style>
