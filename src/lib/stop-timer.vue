<!--
/**
 * Timer Component
 * -----------------
 * The Timer component is a precise and versatile tool for measuring time in Vue 3 applications.
 * It displays time in seconds and milliseconds and provides direct method access for control, making it highly integrable in various contexts.
 *
 * Functionalities Exposed:
 * - start(): Starts or resumes the timer.
 * - stop(): Stops the timer and resets the time to zero.
 * - pause(): Pauses the timer, maintaining the current time.
 * - restart(): Resets the timer to zero and continues running if it was active.
 *
 * Usage:
 * <template>
 *   <div>
 *     <Timer ref="timerRef" />
 *     <button @click="timerRef.start()">Start</button>
 *     <button @click="timerRef.pause()">Pause</button>
 *     <button @click="timerRef.stop()">Stop</button>
 *     <button @click="timerRef.restart()">Reset</button>
 *   </div>
 * </template>
 *
 * <script setup>
 * import Timer from './Timer.vue';
 * import { ref } from 'vue';
 * const timerRef = ref(null);
 * </script>
 *
 * This component updates every 10 milliseconds to ensure accuracy. The design utilizes Vue 3's Composition API features,
 * including refs, computed properties, and lifecycle hooks, for efficient and reactive state management.
 * The component's methods are exposed to the parent using Vue 3's defineExpose, allowing direct interaction.
 */

 -->

<template>
  <div>
    <span>{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, defineEmits } from 'vue';

// Define props and emits
const props = defineProps({
  command: String,
});


const emits = defineEmits(['update:command', 'timerRestart', 'timerStart', 'timerStop', 'timerPause']);

const timer = ref(null);
const time = ref(0);
const running = ref(false);

const formattedTime = computed(() => {
  const milliseconds = time.value % 1000;
  const centiseconds = Math.round(milliseconds / 10);  // Rounds to nearest centisecond
  const seconds = Math.floor(time.value / 1000);
  return `${seconds}.${centiseconds}`; // Displays time with one centisecond
});

function start() {
  if (!running.value) {
    running.value = true;
    const startTime = Date.now() - time.value;
    timer.value = setInterval(() => {
      time.value = Date.now() - startTime;
    }, 10); // Update every 10 ms for milliseconds accuracy
    emits('timerStart');
  }
}

function pause() {
  if (running.value) {
    clearInterval(timer.value);
    running.value = false;
    emits('timerPause');
  }
}

function stop() {
  clearInterval(timer.value);
  time.value = 0;
  running.value = false;
  emits('timerStop');
}

function restart() {
  stop()
  start()
  emits('timerRestart')
}

watch(() => props.command, (newVal) => {
  if (newVal === 'start') start();
  else if (newVal === 'stop') stop();
  else if (newVal === 'pause') pause();
  else if (newVal === 'restart') restart();
});

onBeforeUnmount(() => {
  clearInterval(timer.value); // Clean up to prevent memory leaks
});


defineExpose({
  start,
  pause,
  stop,
  restart,
})

</script>
