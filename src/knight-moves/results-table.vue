<template>
  <table>
    <thead>
      <tr>
        <th>Start</th>
        <th>End</th>
        <th>Solution Length</th>
        <th>Answer Length</th>
        <th>Solution Path</th>
        <th>Submitted Path</th>
        <th>Correct?</th>
        <th>Time Spent</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, index) in results" :key="index" :class="{ 'correct': result.correct_path, 'incorrect': !result.correct_path }">
        <td>{{ chessNotation(result.startCoords) }}</td>
        <td>{{ chessNotation(result.endCoords) }}</td>
        <td>{{ result.solution_length }}</td>
        <td>{{ result.answer_length }}</td>
        <td v-if="result.solution_path && result.solution_path.length">
          {{ result.solution_path.map(coords => chessNotation(coords)).join(' ') }}
        </td>
        <td v-if="result.submitted_path && result.submitted_path.length > 0">
          {{ result.submitted_path.map(coords => chessNotation(coords)).join(' ') }}
        </td>
        <td v-else>-</td>
        <td>{{ result.correct_path ? 'Yes' : 'No' }}</td>
        <td>{{ result.answer_time_spent.toFixed(2) }}</td>
        <td>{{ formatTimestamp(result.answer_timestamp) }}</td>
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
