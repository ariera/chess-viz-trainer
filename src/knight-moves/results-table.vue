<template>
  <table class="table">
    <thead>
      <tr>
        <th>Challenge</th>
        <th colspan="2">Solution</th>
        <th colspan="2">Your Answer</th>
        <th colspan="2">Timing</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, index) in results" :key="index">
        <td>{{ chessNotation(result.start_coords) }} - {{ chessNotation(result.end_coords) }}</td>
        <td>{{ result.solution_length }}</td>
        <td v-if="result.solution_path && result.solution_path.length">
          {{ result.solution_path.map(coords => chessNotation(coords)).join(' ') }}
        </td>
        <td :class="{ 'correct': result.answer_is_correct, 'incorrect': !result.answer_is_correct }">{{ result.answer_length }}</td>
        <td v-if="result.answer_path && result.answer_path.length > 0" :class="{ 'correct': result.answer_is_correct, 'incorrect': !result.answer_is_correct }">
          {{ result.answer_path.map(coords => chessNotation(coords)).join(' ') }}
        </td>
        <td v-else></td>
        <td colspan="2">
          <small>
            {{ result.answer_time_spent.toFixed(0) }} s
            |
            {{ formatTimestamp(result.answer_timestamp) }}
          </small>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps } from 'vue';
import { chess_notation } from '@/lib/chess.js'


const props = defineProps({
  results: Array
});

const chessNotation = (coords) => {
  // Define or import the chessNotation function
  return chess_notation(coords)
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
.correct {
  background-color: lightgreen;
}
.incorrect {
  background-color: salmon;
}
</style>
