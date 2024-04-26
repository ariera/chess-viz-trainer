<script>
import { chess_notation, knight_moves, is_valid_solution } from '@/lib/chess.js'
import ResultsTable from '../knight-moves/results-table.vue'

export default {
  components: {
    ResultsTable
  },
  data() {
    return {
      startTime: null,
      startCoords: [],
      endCoords: [],
      challengeText: '',
      userInput: '',
      results: []
    };
  },
  computed: {
    visibleResults() {
      // fileters results that have an answer timestamp
      return this.results.filter(result => result.answer_timestamp);
    },
  },
  methods: {
    chess_notation: chess_notation,
    knight_moves: knight_moves,
    is_valid_solution: is_valid_solution,
    study() {
      this.startTime = new Date().getTime();
      this.startCoords = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
      this.endCoords = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
      const start_notation = this.chess_notation(this.startCoords);
      const end_notation = this.chess_notation(this.endCoords);
      const [solution_length, solution_path] = this.knight_moves(this.startCoords, this.endCoords);
      this.challengeText = `What is the shortest path length from ${start_notation} to ${end_notation}?`;
      this.userInput = '';
      this.results.unshift({
        startCoords: this.startCoords,
        endCoords: this.endCoords,
        solution_length,
        solution_path,
        answer_is_correct: false,
        answer_length: null,
        answer_timestamp: null,
        answer_time_spent: null,
        submitted_path: []
      });
      this.$refs.answerInput.focus();
    },
    debug() {
      this.startTime = new Date().getTime();
      this.startCoords = [0, 0];
      this.endCoords = [1, 2];
      const start_notation = this.chess_notation(this.startCoords);
      const end_notation = this.chess_notation(this.endCoords);
      const [solution_length, solution_path] = this.knight_moves(this.startCoords, this.endCoords);
      this.challengeText = `What is the shortest path length from ${start_notation} to ${end_notation}?`;
      this.userInput = '';
      this.results.unshift({
        startCoords: this.startCoords,
        endCoords: this.endCoords,
        solution_length,
        solution_path,
        answer_is_correct: false,
        answer_length: null,
        answer_timestamp: null,
        answer_time_spent: null,
        submitted_path: []
      });
      this.$refs.answerInput.focus();
    },
    submitAnswer() {
      const endTime = new Date().getTime();
      const time_spent = (endTime - this.startTime) / 1000;
      const currentResult = this.results[0];

      const submittedAnswer = this.userInput.trim();

      // If the submitted answer is an integer, assume it's the length
      if (!isNaN(submittedAnswer)) {
        currentResult.answer_length = parseInt(submittedAnswer, 10);
      } else {
        // If the submitted answer is not an integer, assume it's a path
        currentResult.answer_length = submittedAnswer.split(' ').length - 1;
        currentResult.submitted_path = this.chess_notation_path_to_coords(submittedAnswer);
      }

      currentResult.answer_timestamp = new Date();
      currentResult.answer_time_spent = time_spent;

      // Check if the length of the provided path matches the solution length and the path is valid
      if (
        (currentResult.answer_length === currentResult.solution_length &&
          this.is_valid_solution(currentResult.submitted_path, this.startCoords, this.endCoords)) ||
        (!isNaN(submittedAnswer) && currentResult.answer_length === currentResult.solution_length)
      ) {
        currentResult.answer_is_correct = true;
      } else {
        currentResult.answer_is_correct = false;
      }

      // Generate the next study exercise
      this.study();
    },
    chess_notation_path_to_coords(path) {
      const ASCII_LOWERCASE_A = 'a'.charCodeAt(0); // ASCII value of lowercase 'a'
      return path.split(' ').map(coords => [coords.charCodeAt(0) - ASCII_LOWERCASE_A, parseInt(coords[1]) - 1]);
    },
    // formatTimestamp(timestamp) {
    //   const date = new Date(timestamp);
    //   return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    // }
  },
  mounted() {
    this.study();
  }
}
</script>

<template lang="pug">

p {{ challengeText }}
.field.is-grouped
  .control
    input.input(type="text" v-model="userInput" placeholder="Enter your answer" @keyup.enter="submitAnswer" ref="answerInput")
  .control
    button.button(@click="submitAnswer") Submit
  .control
    button.button(@click="study") Restart
  .control
    button.button(@click="debug") Debug
ResultsTable(:results="visibleResults")

</template>
