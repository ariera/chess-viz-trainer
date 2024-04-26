<template lang="pug">
  TheChessboard(
    reactive-config
    :board-config="boardConfig"
    @board-created="(api) => (boardAPI = api)"
  )

  button.button(@click="boardConfig.coordinates = !boardConfig.coordinates") Toggle Coordinates

  //- button.button(@click="boardAPI.clearBoard()") Clear board
  //- button.button(@click="getSquare()") getSquare
  //- button.button(@click="putPiece()") putPiece
  button.button(@click="next()") next
  hr
  ResultsTable(:results="visibleResults()")
</template>

<script setup>
import { TheChessboard } from 'vue3-chessboard'
import ResultsTable from '../knight-moves/results-table.vue'
import 'vue3-chessboard/style.css'
import { study, visibleResults, getCurrentChallenge, challenges, answerCurrentChallenge } from './study.js'
import { ref } from 'vue'
import { chess_notation } from '@/lib/chess.js'


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
  boardAPI.value.setShapes([
    { orig: chess_notation(nextChallenge.start_coords), brush: 'red'  },
    { orig: chess_notation(nextChallenge.end_coords)  , brush: 'blue' },
  ])
}

function path2shape (path, brush) {
  return path.map((orig, i) => {
    return { orig, dest: path[i + 1], brush }
  }).slice(0, -1)
}

function onMove (from, to, metadata) {
  answerPath.push(to)
  const currentChallenge = getCurrentChallenge()

  if (to === chess_notation(currentChallenge.end_coords)) {
    submitPath(answerPath)
  } else {
    const startAndEndShapes = [
      { orig: chess_notation(currentChallenge.start_coords), brush: 'red'  },
      { orig: chess_notation(currentChallenge.end_coords)  , brush: 'blue' },
    ]
    const traveledPathShapes = path2shape(answerPath, 'thinGrey')
    boardAPI.value.setShapes(startAndEndShapes.concat(traveledPathShapes))
  }
}

function submitPath (path) {
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