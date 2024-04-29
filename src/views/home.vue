<script setup>
import { RouterLink, RouterView } from 'vue-router'
import KnightMoves from '../knight-moves/index.vue'
// import Baoard from '../knight-moves/board.vue'
</script>

<template lang="pug">
.fixed-grid.has-2-cols-mobile.has-5-cols
  .grid
    .cell
      .card.is-clickable(@click="$router.push('/knight-moves')")
        .card-image
          figure.image
            img(src='@/assets/knight-moves.webp' alt='Knight Moves')
        .card-content
          p.title.is-4 Knight Moves
          p.subtitle.is-6

    .cell
      .card.is-clickable(@click="$router.push('/checks-n-captures')")
        .card-image
          figure.image
            img(src='@/assets/checks-n-captures.webp' alt='Checks and Captures')
        .card-content
          p.title.is-4 Checks & Captures
          p.subtitle.is-6

</template>

<style scoped>

.card {
  max-width: 25rem;
}

@media screen and (max-width: 768px) {
  .card {
    max-width: none;
  }
}
</style>