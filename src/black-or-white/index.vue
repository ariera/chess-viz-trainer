<template lang="pug">
  div.black-or-white
    .fixed-grid.has-4-cols.has-12-cols-mobile
      .grid
        .cell.is-col-span-3.is-col-span-10-mobile
          h2.title.is-1.has-text-centered {{ currentSquare }}
          .chess-tiles
            .chess-tile-wrapper
              .chess-tile.black-tile(@click="submitGuess('black')" aria-label="Guess dark") dark
            .chess-tile-wrapper
              .chess-tile.white-tile(@click="submitGuess('white')" aria-label="Guess light") light

        .cell.is-col-span-2-mobile
          button.button.is-small.is-rounded(@click="nextSquare") next
          StopTimer.stop-timer(ref="stopTimerRef" :class="{'is-danger': isBadTiming}")
          div(v-if="feedback").has-text-centered
            span(v-if="isCorrect") ✅
            span(v-else="isCorrect") ❌
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'

import StopTimer from '@/lib/stop-timer.vue'

const emits = defineEmits(['submitAnswer'])
const currentSquare = ref('a1')
const feedback = ref(false)
const isCorrect = ref(false)
const feedbackMessage = ref('')
const stopTimerRef = ref(null)
const isBadTiming = ref(false)

function getRandomSquare() {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8]
  const file = files[Math.floor(Math.random() * files.length)]
  const rank = ranks[Math.floor(Math.random() * ranks.length)]
  return file + rank
}

function submitGuess(guess) {
  const correctColor = currentSquare.value.charCodeAt(0) % 2 === currentSquare.value.charAt(1) % 2 ? 'black' : 'white'
  isCorrect.value = guess === correctColor
  feedback.value = true
  feedbackMessage.value = isCorrect.value ? 'Correct!' : 'Incorrect!'
  emits('submitAnswer', { square: currentSquare.value, guess, correct: isCorrect.value })
  stopTimerRef.value.pause()
}

function nextSquare() {
  currentSquare.value = getRandomSquare()
  feedback.value = false
  stopTimerRef.value.restart()
}

onMounted(() => {
  stopTimerRef.value.start()  // Ensures the timer starts when the component loads
})
</script>

<style scoped>

.stop-timer {
font-weight: bold;
font-size: 1.5rem;
text-align: center;
}
.chess-tiles {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.chess-tile-wrapper {
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 10px 10px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.chess-tile {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.black-tile {
  background-color: #b58863;
  color: #ffbd88;
}

.white-tile {
  background-color: #f0d9b5;
  color: #716757;
}
</style>
