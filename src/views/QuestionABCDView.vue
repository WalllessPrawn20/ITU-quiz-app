<template>
  <div class="question-view">
    <h2>{{ question.title }}</h2>
    <div class="answers">
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
    <p>Time left: {{ remainingTime }}s</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

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

const botAccuracy = {
  Easy: 0.5,
  Medium: 0.65,
  Hard: 0.8,
}

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function botSelectAnswer() {
  const random = Math.random()
  const chance = botAccuracy[props.difficulty] ?? 0.5
  const correctAnswer = props.question.correct
  const answers = shuffledAnswers.value

  if (random < chance) {
    botAnswer.value = correctAnswer
  } else {
    const wrongAnswers = answers.filter((a) => a !== correctAnswer)
    botAnswer.value = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)]
  }
}

function selectAnswer(answer = null) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = answer // môže byť null, ak hráč nestihol odpovedať
  clearInterval(interval)

  // Počkáme 1,5s pred zobrazením botovej odpovede a výsledku
  setTimeout(() => {
    botSelectAnswer()

    const playerCorrect = selectedAnswer.value === props.question.correct
    const botCorrect = botAnswer.value === props.question.correct

    showResult.value = true

    // 🧮 Vyhodnotenie bodov
    let playerPoint = 0
    let botPoint = 0

    if (playerCorrect && !botCorrect) {
      playerPoint = 1
    } else if (!playerCorrect && botCorrect) {
      botPoint = 1
    }

    // Po ďalších 1,5 sekundách reset
    setTimeout(() => {
      emit('score', { playerPoint, botPoint })
      emit('answered', playerCorrect)
      showResult.value = false
      selectedAnswer.value = null
      botAnswer.value = null
      answered.value = false
    }, 1500)
  }, 1500)
}

// Upravený timer
function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  interval = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(interval)
      // ak hráč nestihol odpovedať, vyvolá sa selectAnswer bez hráčovej odpovede
      selectAnswer(null)
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

/* žltý outline pre hráča */
.answers button.selected {
  border-color: #ffcc00;
  box-shadow: 0 0 10px #ffcc00;
}

/* zelené zvýraznenie správnej odpovede */
.answers button.correct {
  background: #00cc66 !important;
  color: black;
  font-weight: bold;
}

/* červený glow pre odpoveď bota */
.answers button.botSelected {
  box-shadow: 0 0 15px 3px #ff4444;
  border-color: #ff4444;
}
</style>
