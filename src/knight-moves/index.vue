<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { study, visibleResults, getCurrentChallenge, challenges, answerCurrentChallenge } from './study.js'
import { chess_notation } from '@/lib/chess.js'
import ResultsTable from '../knight-moves/results-table.vue'
import StopTimer from '@/lib/stop-timer.vue'

const $route = useRoute()
const currentChallenge = computed(() => getCurrentChallenge())
const stopTimerRef = ref(null);
const exerciseRef = ref(null);

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

function isActiveTab (tabName) {
  return $route.path.endsWith(tabName)
}


function next () {
  const nextChallenge = study()
  exerciseRef.value.next(nextChallenge)
  stopTimerRef.value.restart()
}

function submitAnswer (path) {
  stopTimerRef.value.pause()
  const currentChallenge = answerCurrentChallenge(path.join(' '))
  exerciseRef.value.showAnswer(currentChallenge, path)
}
</script>

<template lang="pug">
.tabs.is-toggle.is-toggle-rounded.is-small.is-fullwidth
  ul
    li(:class="{ 'is-active': isActiveTab('easy') }")
      RouterLink(to="/knight-moves/easy") Easy
    li(:class="{ 'is-active': isActiveTab('medium') }")
      RouterLink(to="/knight-moves/medium") Medium
    li(:class="{ 'is-active': isActiveTab('hard') }")
      RouterLink(to="/knight-moves/hard") Hard



.fixed-grid.has-4-cols.has-12-cols-mobile
  .grid
    .cell.is-col-span-3.is-col-span-10-mobile
      //- RouterView(ref="exerciseRef" @submitAnswer="submitAnswer")
      RouterView(v-slot="{ Component }")
        component(:is="Component" ref="exerciseRef" @submitAnswer="submitAnswer")

    .cell.is-col-span-2-mobile
      button.button.is-small.is-rounded(@click="next()") next
      StopTimer.stop-timer(ref="stopTimerRef" :class="{'stop-timer--red': isBadTiming}")
      div(v-if="currentChallenge && !!currentChallenge.answer_timestamp").has-text-centered
        span(v-if="currentChallenge.answer_is_correct") ✅
        span(v-else="currentChallenge.answer_is_correct") ❌

hr
ResultsTable(:results="visibleResults()")
</template>


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