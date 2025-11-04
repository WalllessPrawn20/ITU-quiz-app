<template>
  <div class="question-view">
    <h2>{{ question.title }}</h2>
    <div class="answers">
      <button v-for="answer in shuffledAnswers" :key="answer" @click="selectAnswer(answer)">
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

const shuffledAnswers = ref([])

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function selectAnswer(answer) {
  const correct = answer === props.question.correct
  emit('answered', correct)
}

function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  interval = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(interval)
      emit('timeout')
    }
  }, 1000)
}

onMounted(() => {
  shuffledAnswers.value = shuffleArray(props.question.answers)
  startTimer()
})

watch(
  () => props.question,
  () => {
    shuffledAnswers.value = shuffleArray(props.question.answers)
    startTimer()
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
  border: 3px solid #00cc66;
  border-radius: 10px;
  color: white;
  box-shadow: 0 0 20px #00cc66; /* 💚 glow efekt */
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
