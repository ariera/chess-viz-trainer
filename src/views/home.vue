<script setup>
import { RouterLink, RouterView } from 'vue-router'
import KnightMoves from '../knight-moves/index.vue'
// import Baoard from '../knight-moves/board.vue'
</script>

<template lang="pug">
.columns
  .column
    .card.is-clickable(@click="$router.push('/knight-moves')")
      .card-image
        figure.image
          img(src='@/assets/knight-moves.webp' alt='Knight Moves')
      .card-content
        p.title.is-4 Knight moves
        p.subtitle.is-6

  .column
    .card.is-clickable(@click="$router.push('/checks-n-captures')")
      .card-image
        figure.image
          img(src='@/assets/checks-n-captures.webp' alt='Checks and Captures')
      .card-content
        p.title.is-4 Checks & Captures
        p.subtitle.is-6

</template>
