<template lang="pug">
TheChessboard(
  reactive-config
  :board-config="boardConfig"
  @board-created="(api) => (boardAPI = api)"
)
button.button.is-small(@click="boardConfig.coordinates = !boardConfig.coordinates" ) coords
</template>

<script setup>
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { getCurrentChallenge } from './study.js'
import { ref } from 'vue'
import { chess_notation } from '@/lib/chess.js'


const emits = defineEmits(['submitAnswer']);
defineExpose({
  next,
  showAnswer,
})

// const CLEAR_BOARD = '8/8/8/8/8/8/8/8'
const boardAPI = ref(null)
const boardConfig = ref({
  // fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  // fen: CLEAR_BOARD,
  coordinates: false,
  // autoCastle: false,
  // orientation: 'black',
  turnColor: 'white',
  movable: {
    free: true,
    color: 'both',
  },
  events: {
    move: onMove,
    // change () {
    //   console.log('change', arguments)
    // },
    select: onSquareSelect,
  },
  drawable: {
    brushes: {
      thinGrey: { key: 'pgr', color: '#4a4a4a', opacity: 0.35, lineWidth: 10 },
      green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
      red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
    }
  },
})
let answerPath = []

function next (nextChallenge) {
  answerPath = []
  answerPath.push(chess_notation(nextChallenge.start_coords))

  boardAPI.value.clearBoard()
  boardAPI.value.putPiece({ type: "n", color: "w" }, chess_notation(nextChallenge.start_coords))
  boardAPI.value.putPiece({ type: "k", color: "b" }, chess_notation(nextChallenge.end_coords))
  // boardAPI.value.setShapes([
  //   { orig: chess_notation(nextChallenge.start_coords), brush: 'red'  },
  //   { orig: chess_notation(nextChallenge.end_coords)  , brush: 'blue' },
  // ])
  // stopTimerRef.value.restart()
}

function path2shape (path, brush) {
  return path.map((orig, i) => {
    return { orig, dest: path[i + 1], brush }
  }).slice(0, -1)
}

function onSquareSelect (square) {
  console.log('onSquareSelect', square)
}

function onMove (from, to, metadata) {
  answerPath.push(to)
  const currentChallenge = getCurrentChallenge()

  const traveledPathShapes = path2shape(answerPath, 'thinGrey')
  boardAPI.value.setShapes(traveledPathShapes)

  if (to === chess_notation(currentChallenge.end_coords)) {
    emits('submitAnswer', answerPath)
  }
  // else {
  //   // const startAndEndShapes = [
  //   //   { orig: chess_notation(currentChallenge.start_coords), brush: 'red'  },
  //   //   { orig: chess_notation(currentChallenge.end_coords)  , brush: 'blue' },
  //   // ]
  //   // boardAPI.value.setShapes(startAndEndShapes.concat(traveledPathShapes))
  //   const traveledPathShapes = path2shape(answerPath, 'thinGrey')
  //   boardAPI.value.setShapes(traveledPathShapes)
  // }
}

function showAnswer (currentChallenge, path) {
  if (currentChallenge.answer_is_correct) {
    console.log('Correct!', path)
    const traveledPathShapes = path2shape(path, 'green')
    boardAPI.value.setShapes(traveledPathShapes)
  } else {
    console.log('Inorrect!', path)
    const traveledPathShapes = path2shape(path, 'red')
    const solutionPath = currentChallenge.solution_path.map(coords => chess_notation(coords))
    const solutionPathShapes = path2shape(solutionPath, 'green')
    boardAPI.value.setShapes(traveledPathShapes.concat(solutionPathShapes))
    // boardAPI.value.setShapes(solutionPathShapes)
  }
}


</script>
