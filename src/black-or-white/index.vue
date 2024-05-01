<template lang="pug">
div.black-or-white
  .fixed-grid.has-4-cols.has-12-cols-mobile
    .grid
      .cell.is-col-span-3.is-col-span-10-mobile
        h2.is-4.has-text-centered Guess the color of the square
        h2.title.is-4.has-text-centered {{ currentSquare }}
        div.buttons.has-text-centered
          button.button.is-small(@click="submitGuess('black')")
            span Black
          button.button.is-small(@click="submitGuess('white')")
            span White

      .cell.is-col-span-2-mobile
        button.button.is-small.is-rounded(@click="nextSquare") next
        StopTimer.stop-timer(ref="stopTimerRef" :class="{'is-danger': isBadTiming}")
        div(v-if="feedback").has-text-centered
          span(v-if="isCorrect") ✅
          span(v-else="isCorrect") ❌
      .cell.is-col-span-12
        div(v-if="feedback" :class="{ 'notification': true, 'is-success': isCorrect, 'is-danger': !isCorrect }")
          p {{ feedbackMessage }}
</template>

<script setup>
import { ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'
import StopTimer from '@/lib/stop-timer.vue' // Import path might need adjustment based on your project structure

const squares = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].flatMap(col => Array.from({ length: 8 }, (_, i) => `${col}${i + 1}`));

function getRandomSquare() {
  return squares[Math.floor(Math.random() * squares.length)];
}

function getSquareColor(square) {
  // Extract the file (column letter) and rank (row number) from the square notation
  const file = square.charAt(0);  // 'a', 'b', ..., 'h'
  const rank = parseInt(square.charAt(1), 10); // 1, 2, ..., 8

  // Convert the file from letter to number (e.g., 'a' to 1, 'b' to 2, ..., 'h' to 8)
  const fileNumber = file.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

  // Determine the color of the square based on the sum of its file and rank numbers
  // Chessboard coloring rule: If the sum of the file and rank numbers is even, the square is black; if odd, it's white.
  const isEven = (fileNumber + rank) % 2 === 0;
  return isEven ? 'black' : 'white';
}


const emits = defineEmits(['submitAnswer']);

const currentSquare = ref(getRandomSquare());
const feedback = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref('');
const stopTimerRef = ref(null);
const GOOD_TIMING = 10; // Adjust the timing threshold as per your needs
const isBadTiming = ref(false);

function submitGuess(guess) {
  stopTimerRef.value.pause();
  const correctColor = getSquareColor(currentSquare.value);
  isCorrect.value = guess === correctColor;
  feedback.value = true;
  feedbackMessage.value = isCorrect.value ? 'Correct!' : 'Incorrect!';
  isBadTiming.value = stopTimerRef.value.elapsedTime > GOOD_TIMING;
  emits('submitAnswer', { square: currentSquare.value, guess, correct: isCorrect.value });
}

function nextSquare() {
  currentSquare.value = getRandomSquare();
  feedback.value = false;
  stopTimerRef.value.restart();
}

onMounted(() => {
  stopTimerRef.value.start();
})

onBeforeUnmount(() => {
  stopTimerRef.value.stop();
})

</script>

<style scoped>
.correct {
  color: green;
}
.incorrect {
  color: red;
}
.stop-timer--red {
  color: red;
}
</style>
