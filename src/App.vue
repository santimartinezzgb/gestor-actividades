<script setup>
  import Login from './components/Login.vue'
  import MainImage from './components/MainImage.vue'
</script>

<template>
  <div class="app">
    <Login />
    <MainImage />
  </div>
</template>

<style>
body {
  background-color: #565656;
  height: 100vh;
  margin: 0;
}
.app {
  background-color: aqua;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 2rem;
}
</style>
