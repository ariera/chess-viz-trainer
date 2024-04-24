<script setup>
import { RouterLink, RouterView } from 'vue-router'
import KnightMoves from '../knight-moves/index.vue'
// import Baoard from '../knight-moves/board.vue'
</script>

<template lang="pug">
o-button(@click="$router.push('/knight-moves')") Knight Moves
o-button(@click="$router.push('/checks-n-captures')") Checks & Captures
RouterLink(to="/knight-moves") Knight Moves
RouterLink(to="/checks-n-captures") Checks & Captures
</template>
