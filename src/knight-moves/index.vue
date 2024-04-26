<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'

const $route = useRoute()

function isActiveTab (tabName) {
  return $route.path.endsWith(tabName)
}
</script>

<template lang="pug">
.tabs.is-toggle.is-toggle-rounded.is-small.is-fullwidth
  ul
    li(:class="{ 'is-active': isActiveTab('easy') }")
      RouterLink(to="/knight-moves/easy") Easy
    li(:class="{ 'is-active': isActiveTab('medium') }")
      RouterLink(to="/knight-moves/medium") Medium
    li(:class="{ 'is-active': isActiveTab('hard') }")
      RouterLink(to="/knight-moves/hard") Hard

RouterView
</template>
