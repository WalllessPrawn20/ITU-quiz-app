<!----------------------------->
<!-- Author: Matej Melchiory -->
<!-- Login: xmelchm00 --------->
<!-- Date: 3.12.2025 ---------->
<!----------------------------->

<template>
  <div class="question-view">

    <!-- Getting the question title -->
    <h2>{{ question.title }}</h2>
    <div class="answers">
      <!-- Going through all available answers and setting classes for the final picking -->
      <button
        v-for="answer in shuffledAnswers"
        :key="answer"
        @click="selectAnswer(answer)"
        :disabled="answered"
        :class="{
          selected: selectedAnswer === answer,
          correct: showResult && answer === question.correct && botAnswer,
          botSelected: showResult && botAnswer === answer,
        }"
      >
        {{ answer }}
      </button>
    </div>

    <!-- Remaining time loaded from the server and ticking down using timeout -->
    <p>Time left: {{ remainingTime }}s</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// Deffining variables getting from the Gameview
const props = defineProps({
  question: Object,
  duration: Number,
  difficulty: String,
})
const emit = defineEmits(['answered', 'timeout', 'score'])

const remainingTime = ref(props.duration)
let interval = null

const shuffledAnswers = ref([])

const selectedAnswer = ref(null)
const botAnswer = ref(null)
const answered = ref(false)
const showResult = ref(false)

// Function to shuffle the answers array
function shuffleAnswers(answers) {
  answers.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
  return answers
}

// Function to start the countdown timer 
function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  interval = setInterval(async () => {
    remainingTime.value -= 1

    if (remainingTime.value <= 0) {
      clearInterval(interval)

      await selectAnswer(null)
    }
  }, 1000)
}

// Function to select an answer and send it to the server for evaluation
async function selectAnswer(answer) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = answer
  clearInterval(interval)

  const res = await fetch('http://localhost:5000/game/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: props.question,
      playerAnswer: answer,
      difficulty: props.difficulty,
    }),
  })

  const data = await res.json()

  botAnswer.value = data.botAnswer
  showResult.value = true
  console.log("data:", data.playerCorrect)
  // Emitting the results after a short delay to show the correct and picked answers
  setTimeout(() => {
    emit('score', { playerPoint: data.playerPoint, botPoint: data.botPoint })
    emit('answered', {
      playerCorrect: data.playerCorrect,
      botCorrect: data.botCorrect,
      tie: data.playerPoint === 0 && data.botPoint === 0,
    })

    showResult.value = false
    selectedAnswer.value = null
    botAnswer.value = null
    answered.value = false
  }, 1500)
}

// On component load, shuffle answers and start the timer
onMounted(() => {
  shuffledAnswers.value = shuffleAnswers(props.question.answers)
  startTimer()
})

// Watching for changes in the question prop to reshuffle answers and restart timer
watch(
  () => props.question,
  () => {
    shuffledAnswers.value = shuffleAnswers(props.question.answers)
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
  box-shadow: 0 0 20px #00cc66;
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

.answers button:hover:not(:disabled) {
  background: #00cc66;
}

.answers button:disabled {
  opacity: 0.7;
  cursor: default;
}

.answers button.selected {
  border-color: #ffcc00;
  box-shadow: 0 0 10px #ffcc00;
}

.answers button.correct {
  background: #00cc66 !important;
  color: black;
  font-weight: bold;
}

.answers button.botSelected {
  box-shadow: 0 0 15px 3px #ff4444;
  border-color: #ff4444;
}
</style>
