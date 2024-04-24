<template lang="pug">
  TheChessboard(
    reactive-config
    :board-config="boardConfig"
    @board-created="(api) => (boardAPI = api)"
  )

  button(@click="boardConfig.coordinates = !boardConfig.coordinates") Toggle Coordinates

  button(@click="boardAPI.clearBoard()") Clear board
  button(@click="getSquare()") getSquare
  button(@click="putPiece()") putPiece

</template>

<script>
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

const CLEAR_BOARD = '8/8/8/8/8/8/8/8'


export default {
  components: {
    TheChessboard
  },
  data () {
    return {
      boardAPI: null,
      boardConfig: {
        // fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        // fen: CLEAR_BOARD,
        coordinates: false,
        // autoCastle: false,
        // orientation: 'black',
      }
    }
  },
  methods: {
    // clearBoard () {
    //   this.boardAPI.clearBoard()
    // }
    getSquare () {
      console.log(this.boardAPI.getSquare('d1'))
    },
    putPiece () {
      this.boardAPI.putPiece({ type: "p", color: "w" }, 'e4')
      this.boardAPI.putPiece({ type: "n", color: "w" }, 'e5')
      // this.boardAPI.putPiece({ type: "K", color: "w" }, 'd5')
      this.boardAPI.putPiece({ type: "q", color: "w" }, 'f4')
      this.boardAPI.putPiece({ type: "r", color: "w" }, 'g4')
      this.boardAPI.putPiece({ type: "b", color: "w" }, 'h4')
    },
  },


}
</script>