<template lang="pug">
.fixed-grid.has-4-cols.has-12-cols-mobile
  .grid
    .cell.is-col-span-3.is-col-span-10-mobile
      TheChessboard(
        reactive-config
        :board-config="boardConfig"
        @board-created="(api) => (boardAPI = api)"
      )
    .cell.is-col-span-2-mobile
      //- button.button(@click="boardConfig.coordinates = !boardConfig.coordinates") Toggle Coordinates

      button.button.is-small.is-rounded(@click="next()") next
      StopTimer.stop-timer(ref="stopTimerRef" :class="{'stop-timer--red': isBadTiming}")
      div(v-if="currentChallenge && !!currentChallenge.answer_timestamp").has-text-centered
        span(v-if="currentChallenge.answer_is_correct") ✅
        span(v-else="currentChallenge.answer_is_correct") ❌
hr
ResultsTable(:results="visibleResults()")
</template>

<script setup>
import { TheChessboard } from 'vue3-chessboard'
import ResultsTable from '../knight-moves/results-table.vue'
import 'vue3-chessboard/style.css'
import { study, visibleResults, getCurrentChallenge, challenges, answerCurrentChallenge } from './study.js'
import { ref, computed } from 'vue'
import { chess_notation } from '@/lib/chess.js'
import StopTimer from '@/lib/stop-timer.vue'

const stopTimerRef = ref(null);
const currentChallenge = computed(() => getCurrentChallenge())
const GOOD_TIMING = 8

const isBadTiming = computed(() => {
  if (!currentChallenge.value || !currentChallenge.value.answer_timestamp) {
    return false
  }
  if (!currentChallenge.value.answer_is_correct) {
    // don't bother highlighting that the timing was suboptimal if the answer was wrong
    return false
  }
  // only highlight if the answer was correct and the timing was bad
  const isBadTiming = currentChallenge.value.answer_time_spent > GOOD_TIMING
  return isBadTiming
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

function getSquare () {
  console.log(this.boardAPI.getSquare('d1'))
}
function putPiece () {
  this.boardAPI.putPiece({ type: "p", color: "w" }, 'e4')
  this.boardAPI.putPiece({ type: "n", color: "w" }, 'e5')
  // this.boardAPI.putPiece({ type: "K", color: "w" }, 'd5')
  this.boardAPI.putPiece({ type: "q", color: "w" }, 'f4')
  this.boardAPI.putPiece({ type: "r", color: "w" }, 'g4')
  this.boardAPI.putPiece({ type: "b", color: "w" }, 'h4')
}

function next () {
  const nextChallenge = study()

  answerPath = []
  answerPath.push(chess_notation(nextChallenge.start_coords))

  boardAPI.value.clearBoard()
  boardAPI.value.putPiece({ type: "n", color: "w" }, chess_notation(nextChallenge.start_coords))
  boardAPI.value.putPiece({ type: "k", color: "b" }, chess_notation(nextChallenge.end_coords))
  // boardAPI.value.setShapes([
  //   { orig: chess_notation(nextChallenge.start_coords), brush: 'red'  },
  //   { orig: chess_notation(nextChallenge.end_coords)  , brush: 'blue' },
  // ])
  stopTimerRef.value.restart()
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
  // const currentChallenge = getCurrentChallenge()

  if (to === chess_notation(currentChallenge.value.end_coords)) {
    submitPath(answerPath)
  }
  else {
    // const startAndEndShapes = [
    //   { orig: chess_notation(currentChallenge.start_coords), brush: 'red'  },
    //   { orig: chess_notation(currentChallenge.end_coords)  , brush: 'blue' },
    // ]
    const traveledPathShapes = path2shape(answerPath, 'thinGrey')
    // boardAPI.value.setShapes(startAndEndShapes.concat(traveledPathShapes))
    boardAPI.value.setShapes(traveledPathShapes)
  }
}

function submitPath (path) {
  stopTimerRef.value.pause()
  const currentChallenge = answerCurrentChallenge(path.join(' '))
  if (currentChallenge.answer_is_correct) {
    console.log('Correct!')
    const traveledPathShapes = path2shape(path, 'green')
    boardAPI.value.setShapes(traveledPathShapes)
  } else {
    console.log('Inorrect!')
    const traveledPathShapes = path2shape(path, 'red')
    const solutionPath = currentChallenge.solution_path.map(coords => chess_notation(coords))
    const solutionPathShapes = path2shape(solutionPath, 'green')
    boardAPI.value.setShapes(traveledPathShapes.concat(solutionPathShapes))
    // boardAPI.value.setShapes(solutionPathShapes)
  }
}
</script>
<style>
.stop-timer {
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
}
.stop-timer--green {
  color: darkkhaki ;
}
.stop-timer--red {
  color: red;
  text-decoration: underline;
}
</style>