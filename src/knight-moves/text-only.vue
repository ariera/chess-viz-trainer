<script setup>
import { ref } from 'vue'
import { chess_notation } from '@/lib/chess.js'


const emits = defineEmits(['submitAnswer']);

const start = ref(null)
const end = ref(null)
const userInput = ref('')
const answerInput = ref(null);

function next (nextChallenge) {
  start.value = chess_notation(nextChallenge.start_coords);
  end.value = chess_notation(nextChallenge.end_coords);
  userInput.value = '';
  answerInput.value.focus();
}

function submitAnswer() {
  const submittedAnswer = userInput.value.trim();
  if (submittedAnswer === '') {
    return;
  }
  const lastSquare = submittedAnswer.split(' ')[-1]
  if (lastSquare !== chess_notation(end.value)) {
    emits('submitAnswer', submittedAnswer.split(' '))
  }
}

function showAnswer () {
  return
}

defineExpose({
  next,
  showAnswer,
})

</script>

<template lang="pug">
p What is the shortest path length from {{ start }} to {{ end }}?
.field.is-grouped
  .control
    input.input(type="text" v-model="userInput" placeholder="Enter your answer" @keyup.enter="submitAnswer" ref="answerInput")
  .control
    button.button(@click="submitAnswer") Submit
</template>
