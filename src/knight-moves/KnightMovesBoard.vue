<template>
  <chessboard :position="currentPosition" :options="boardOptions"/>
</template>

<script setup>
import { Chessboard } from 'vue3-chessboard';
import { ref } from 'vue';

const props = defineProps({
  initialSquare: String,
  destinationSquare: String
});

const currentPosition = ref(`N@${props.initialSquare}`);
const boardOptions = {
  draggable: false,
  sparePieces: false,
  pieceTheme: 'path/to/chess/pieces/images', // Adjust path as necessary
  markers: [
    { square: props.destinationSquare, type: 'circle', color: 'blue' }
  ]
};

</script>

<style scoped>
/* Add any additional styling for your board here */
</style>
