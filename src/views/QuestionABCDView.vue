<template>
  <div class="question-view">
    <h2>{{ question.title }}</h2>
    <div class="answers">
      <button v-for="answer in question.answers" :key="answer" @click="selectAnswer(answer)">
        {{ answer }}
      </button>
    </div>
    <p>Time left: {{ remainingTime }}s</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  question: Object,
  duration: Number,
})
const emit = defineEmits(['answered', 'timeout'])

const remainingTime = ref(props.duration)
let interval = null

function selectAnswer(answer) {
  const correct = answer === props.question.correct
  emit('answered', correct)
}

onMounted(() => {
  remainingTime.value = props.duration
  interval = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(interval)
      emit('timeout')
    }
  }, 1000)
})

watch(
  () => props.question,
  () => {
    clearInterval(interval)
    remainingTime.value = props.duration
    interval = setInterval(() => {
      remainingTime.value -= 1
      if (remainingTime.value <= 0) {
        clearInterval(interval)
        emit('timeout')
      }
    }, 1000)
  },
)
</script>

<style scoped>
.question-view {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border: 2px solid #555;
  border-radius: 10px;
  color: white;
}
.answers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.answers button {
  padding: 0.5rem 1rem;
  background: #222;
  color: white;
  border: 2px solid #555;
  cursor: pointer;
}
.answers button:hover {
  background: #00cc66;
}
</style>
