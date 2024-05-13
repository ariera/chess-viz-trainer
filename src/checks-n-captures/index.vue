<script setup>
import { ref, computed } from 'vue'
import { Chess } from 'chess.js'
import { parse } from '@mliebelt/pgn-parser'
import { TheChessboard } from 'vue3-chessboard'
import { GAMES } from './games'
import 'vue3-chessboard/style.css'
const boardAPI = ref(null)


const boardConfig = ref({
  coordinates: false,
  turnColor: 'white',
  // movable: false,
  // movable: {
  //   free: true,
  //   color: 'both',
  // },
  // events: {
  //   move: onMove,
  //   // change () {
  //   //   console.log('change', arguments)
  //   // },
  //   select: onSquareSelect,
  // },
  drawable: {
    brushes: {
      thinGrey: { key: 'pgr', color: '#4a4a4a', opacity: 0.35, lineWidth: 10 },
      green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
      red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
    }
  },
})

const gamePGN = ref(GAMES[0].pgn)
const numberOfMovesPerExercise = ref(1)
const currentMove = ref(0)
const answerInput = ref(null)
const currentChallenge = computed( function () {
  const plys = getMovesFrom({ pgn: gamePGN.value, offset: currentMove.value, limit: numberOfMovesPerExercise.value })
  return convertPlysToPGN({plys: plys, offset: currentMove.value})
})
const currentChallengeAnswered = ref(false)

// console.log(getPlys(gamePGN.value))
function getPlys (pgn) {
  // parses a PGN string and returns an array of plys in standard algebraic notation

  let game = parse(pgn, {startRule: "game"})

  // converts the parsed plys into an array of strings
  // each parsed move follows this json structure
  //   {
  //    "moveNumber": 1,
  //    "notation": {
  //      "fig": null,
  //      "strike": null,
  //      "col": "d",
  //      "row": "4",
  //      "check": null,
  //      "promotion": null,
  //      "notation": "d4"
  //    },
  //    "variations": [],
  //    "nag": null,
  //    "commentDiag": null,
  //    "turn": "w"
  //  }
  // we are only interested in the "notation" property
  return game.moves.map(move => move.notation.notation)
}

function getMovesFrom ({ pgn, offset, limit }) {
  // returns an array of plys from a PGN string
  // starting from the offset and counting the number of moves specified but `limit`
  // and taking into account that one move is two plys (one for white and one for black)

  offset = offset || 0
  limit = limit || 1
  const plys =  getPlys(pgn).slice(offset * 2, offset * 2 + limit * 2)
  return plys
}

function convertPlysToPGN ({plys, offset}) {
  // converts an array of plys into a PGN string
  // offset is used as the starting move number
  // group the plys into pairs of two to represent a white and black move
  offset = offset || 0
  return plys.reduce((acc, ply, index) => {
    if (index % 2 === 0) {
      acc.push(`${index/2 + offset + 1}. ${ply} ${plys[index + 1]}`)
    }
    return acc
  }, [])
}


function submitAnswer () {
  if (answerInput.value === null) return
  currentChallengeAnswered.value = true
  const plys = getMovesFrom({ pgn: gamePGN.value, offset: currentMove.value, limit: numberOfMovesPerExercise.value })
  updateBoardPosition(plys)
  const currentPosition = boardAPI.value.getFen()
  const { checks, captures } = countChecksAndCaptures(currentPosition)
  console.log({ checks, captures })
  displayChecksAndCaptures({ checks, captures })
}

function updateBoardPosition (plys) {
  // updates the board with the given plys
  // plys is an array of strings in standard algebraic notation
  // each ply is a move that is played on the board
  plys.forEach(ply => {
    // chess.move(ply)
    boardAPI.value.move(ply)
  })
}

function displayChecksAndCaptures ({ checks, captures }) {
  // displays checks and captures on the board with arrows
  // checks and captures are arrays of moves
  // each move is an object with the following properties
  //   {
  //     color: 'w',
  //     from: 'e2',
  //     to: 'e4',
  //     flags: 'b',
  //     piece: 'p',
  //     san: 'e4',
  //     captured: 'p',
  //     promotion: null
  //   }

  const checksPaths = checks.map(move => {
    return { orig: move.from, dest: move.to, brush: 'red' }
  })
  const capturePaths = captures.map(move => {
    return { orig: move.from, dest: move.to, brush: 'green' }
  })
  boardAPI.value.setShapes(checksPaths.concat(capturePaths))
}

function countChecksAndCaptures (fen) {
  // returns an object with the number of checks and captures

  const chess = new Chess(fen)
  const moves = chess.moves({ verbose: true })

  const checks = moves.filter(move => move.san.includes('+'))
  const captures = moves.filter(move => move.san.includes('x'))
  return { checks, captures }
}

function next () {
  currentMove.value = currentMove.value + numberOfMovesPerExercise.value
  answerInput.value = null
  currentChallengeAnswered.value = false
  boardAPI.value.setShapes([]) // clear paths on the board
}

function resetGame (index) {
  gamePGN.value = GAMES[index].pgn
  currentMove.value = 0
  answerInput.value = null
  currentChallengeAnswered.value = false
  // reset the board
  boardAPI.value.resetBoard()
}


</script>

<template lang="pug">
.fixed-grid.has-4-cols.has-12-cols-mobile
  .grid
    .cell.is-col-span-3.is-col-span-8-mobile

      TheChessboard(
        reactive-config
        :board-config="boardConfig"
        @board-created="(api) => (boardAPI = api)"
      )
      .field
        .control
          .select.is-small
            select(@change="resetGame($event.target.value)")
              option(v-for="(game, index) in GAMES" :key="index" :value="index") {{ game.title }}
      .field.is-horizontal
        .field-label.is-small
          label.label Difficulty
        .field-body
          .field
            .control
              .select.is-small
                select(v-model="numberOfMovesPerExercise")
                  option(v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="n" :value="n") {{ n }}
          .field
            .control
              button.button.is-small(@click="boardConfig.coordinates = !boardConfig.coordinates" ) coords

    .cell.is-col-span-4-mobile
      .field.has-addons
        .control
          input.input(type="number" placeholder="Your answer" inputmode="numeric" v-model="answerInput")
        .control
          button.button(@click="submitAnswer") ➡️
      .content
        p.is-family-monospace.is-size-7(v-for="(move, index) in currentChallenge" :key="index") {{ move }}
      .field(v-if="currentChallengeAnswered")
        button.button.is-small(@click="next") Next

        .content
h1 Checks & Captures
p
  | You are provided with a sequence of moves in standard algebraic notation and a starting board position. Without physically moving the pieces on the board, you must visualize the resulting position after these moves have been played. The challenge then is to identify and count the number of captures and checks available to the player whose turn is next.
p Work in Progress...


</template>

<style scoped>
</style>
