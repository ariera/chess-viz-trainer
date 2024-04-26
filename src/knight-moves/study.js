import { chess_notation, knight_moves, is_valid_solution } from '@/lib/chess.js'

import { ref } from 'vue'

export const startTime = ref('')
export const startCoords = ref([])
export const endCoords = ref([])
export const userInput = ref('')
export const results = ref([])

export const challenges = ref([])

export function study () {
  function get_random_coords () {
    return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)]
  }
  // startTime.value = new Date().getTime()
  // startCoords.value = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)]
  // endCoords.value = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)]
  // const [solution_length, solution_path] = knight_moves(startCoords.value, endCoords.value)
  // userInput.value = ''
  // results.value.unshift({
  //   start_coords: startCoords,
  //   end_coords: endCoords,
  //   solution_length,
  //   solution_path,
  //   answer_is_correct: null,
  //   answer_length: null,
  //   answer_timestamp: null,
  //   answer_time_spent: null,
  //   answer_path: []
  // })

  const start_coords = get_random_coords()
  const end_coords = get_random_coords()
  const [solution_length, solution_path] = knight_moves(start_coords, end_coords)
  const nextChallenge = {
    start_time: new Date().getTime(),
    end_time: null,
    start_coords,
    end_coords,
    // start: chess_notation(start_coords),
    // end: chess_notation(end_coords),
    solution_length,
    solution_path,
    answer_is_correct: null,
    answer_length: null,
    answer_timestamp: null,
    answer_time_spent: null,
    answer_path: []
  }
  challenges.value.unshift(nextChallenge)
  console.log('study', challenges.value)
  return nextChallenge
}

export function answerCurrentChallenge (submittedAnswer) {
  function chess_notation_path_to_coords(path) {
    const ASCII_LOWERCASE_A = 'a'.charCodeAt(0); // ASCII value of lowercase 'a'
    return path.split(' ').map(coords => [coords.charCodeAt(0) - ASCII_LOWERCASE_A, parseInt(coords[1]) - 1]);
  }
  const currentChallenge = getCurrentChallenge()

  const end_time = new Date().getTime();
  const time_spent = (end_time - currentChallenge.start_time) / 1000;
  currentChallenge.answer_time_spent = time_spent;
  currentChallenge.answer_timestamp = new Date();

  // // const submittedAnswer = this.userInput.trim();
  // const submittedAnswer = '3'

  // If the submitted answer is an integer, assume it's the length
  if (!isNaN(submittedAnswer)) {
    currentChallenge.answer_length = parseInt(submittedAnswer, 10);
  } else {
    // If the submitted answer is not an integer, assume it's a path
    currentChallenge.answer_length = submittedAnswer.split(' ').length - 1;
    currentChallenge.answer_path = chess_notation_path_to_coords(submittedAnswer);
  }



  // Check if the length of the provided path matches the solution length and the path is valid
  if (
    (currentChallenge.answer_length === currentChallenge.solution_length &&
      is_valid_solution(currentChallenge.answer_path, currentChallenge.start_coords, currentChallenge.end_coords)) ||
    (!isNaN(submittedAnswer) && currentChallenge.answer_length === currentChallenge.solution_length)
  ) {
    currentChallenge.answer_is_correct = true;
  } else {
    currentChallenge.answer_is_correct = false;
  }

  return currentChallenge

  // // Generate the next study exercise
  // // this.study();
}

export function visibleResults() {
  // fileters results that have an answer timestamp
  return challenges.value.filter(result => result.answer_timestamp)
}

export function getCurrentChallenge() {
  return challenges.value[0]
}