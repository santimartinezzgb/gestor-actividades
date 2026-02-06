<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import WelcomeItem from './components/WelcomeItem.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Mensaje desde componente Hello world" />
    </div>
  </header>

  <main>
    <TheWelcome />
    <WelcomeItem title="Get Started" description="Edit src/App.vue to modify this page." />
  </main>
</template>

<style scoped></style>
