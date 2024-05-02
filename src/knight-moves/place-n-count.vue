<script setup>
import { ref, defineEmits } from 'vue';
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { getCurrentChallenge } from './study.js';
import { chess_notation } from '@/lib/chess.js';

const boardAPI = ref(null);
const challenge = ref(getCurrentChallenge());
const knightPlaced = ref(false);
const kingPlaced = ref(false);
const answerInput = ref(null);
const isError = ref(false);  // State to control the flash effect
const emits = defineEmits(['submitAnswer']);

const boardConfig = ref({
  coordinates: false,
  turnColor: 'white',
  movable: {
    free: false,
    color: 'both',
  },
  events: {
    select: handleSquareSelect,
  }
});

function handleSquareSelect(square) {
  console.log('handleSquareSelect', square)

  if (knightPlaced.value && kingPlaced.value) return;

  if (!knightPlaced.value && square === chess_notation(challenge.value.start_coords)) {
    boardAPI.value.putPiece({ type: "n", color: "w" }, square);
    knightPlaced.value = true;
  } else if (knightPlaced.value && !kingPlaced.value && square === chess_notation(challenge.value.end_coords)) {
    boardAPI.value.putPiece({ type: "k", color: "b" }, square);
    kingPlaced.value = true;
    answerInput.value.focus();
  } else {
    // Trigger the flash effect for a wrong selection
    isError.value = true;
    setTimeout(() => isError.value = false, 300);  // Flash red for 300 milliseconds
  }
}

function submitAnswer(answer) {
  emits('submitAnswer', [answer])
}

function showAnswer (currentChallenge, path) {
  function path2shape (path, brush) {
    return path.map((orig, i) => {
      return { orig, dest: path[i + 1], brush }
    }).slice(0, -1)
  }

  const solutionPath = currentChallenge.solution_path.map(coords => chess_notation(coords))
  const solutionPathShapes = path2shape(solutionPath, 'green')
  boardAPI.value.setShapes(solutionPathShapes)
}

defineExpose({ next, showAnswer });

function next() {
  challenge.value = getCurrentChallenge();
  knightPlaced.value = false;
  kingPlaced.value = false;
  boardAPI.value.clearBoard();
}
</script>

<template lang="pug">
div.knight-moves-study(:class="{ 'error-flash': isError }")
  h1.is-size-3.has-text-centered(v-if="challenge") {{ chess_notation(challenge.start_coords) }} - {{ chess_notation(challenge.end_coords) }}
  div.buttons.has-addons.is-centered
      button.button(@click="submitAnswer(1)") 1
      button.button(@click="submitAnswer(2)") 2
      button.button(@click="submitAnswer(3)") 3
      button.button(@click="submitAnswer(4)") 4
      button.button(@click="submitAnswer(5)") 5
  TheChessboard(:board-config="boardConfig" @board-created="api => boardAPI = api")
</template>

<style scoped>
.error-flash {
  animation: flashRed .5s;
}

@keyframes flashRed {
  from {
    background-color: red;
  }
  to {
    background-color: transparent;
  }
}
</style>
