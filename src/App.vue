<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isActive = ref(false)

function toggleMenu() {
  isActive.value = !isActive.value
}
</script>

<template lang="pug">
section
  .container
    nav.navbar(role="navigation" aria-label="main navigation")
      .navbar-brand
        RouterLink.navbar-item(to="/")
          img(src="@/assets/chess-viz-trainer-logo-v2-L.jpg" alt="Chess Viz Trainer Logo")
        .navbar-burger(data-target="navbarMenu" @click="toggleMenu" :class="{ 'is-active': isActive }")
          span
          span
          span
      .navbar-menu(:class="{ 'is-active': isActive }")
        .navbar-start
          RouterLink.navbar-item(to="/knight-moves") Knight Moves
          RouterLink.navbar-item(to="/checks-n-captures") Checks & Captures
          RouterLink.navbar-item(to="/black-or-white") Black or White
        .navbar-end
          RouterLink.navbar-item(to="/about") About

section
  .container
    RouterView

</template>

<style scoped>

</style>
