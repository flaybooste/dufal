<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SiegView from './components/SiegView.vue'
</script>

<template>
  <header>

    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/xml">XmlView</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
