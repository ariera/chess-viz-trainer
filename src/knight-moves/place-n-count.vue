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
const userInput = ref('');
const answerInput = ref(null);
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
  if (!knightPlaced.value && square === chess_notation(challenge.value.start_coords)) {
    boardAPI.value.putPiece({ type: "n", color: "w" }, square);
    knightPlaced.value = true;
  } else if (knightPlaced.value && !kingPlaced.value && square === chess_notation(challenge.value.end_coords)) {
    boardAPI.value.putPiece({ type: "k", color: "b" }, square);
    kingPlaced.value = true;
    answerInput.value.focus();
  }
}

function submitAnswer() {
  console.log('submitAnswer', userInput.value)
  if (knightPlaced.value && kingPlaced.value && userInput.value) {
    emits('submitAnswer', userInput.value.split(' '));  // Emit only the userInput value
  }
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
  userInput.value = '';
  boardAPI.value.clearBoard();
}
</script>

<template lang="pug">
div.knight-moves-study
  .field.has-addons
    .control
      h1.is-size-3.has-text-centered(v-if="challenge") {{ chess_notation(challenge.start_coords) }} - {{ chess_notation(challenge.end_coords) }}
    .control
      input.input(type="text" v-model="userInput" placeholder="Enter number of moves" ref="answerInput" @keyup.enter="submitAnswer")
    .control
      button.button(@click="submitAnswer" :disabled="!knightPlaced || !kingPlaced") Submit
  TheChessboard(:board-config="boardConfig" @board-created="api => boardAPI = api")
  //- button.button.is-small(@click="boardConfig.coordinates = !boardConfig.coordinates" ) coords
</template>

<style scoped>
/* Add any specific styles needed */
</style>
