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

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  interval = setInterval(async () => {
    remainingTime.value -= 1

    if (remainingTime.value <= 0) {
      clearInterval(interval)

      // Hráč nestihol odpovedať → pošli na server "wrong answer"
      await selectAnswer(null)
    }
  }, 1000)
}

async function selectAnswer(answer) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = answer
  clearInterval(interval)

  // Pošli dáta na server
  const res = await fetch('http://localhost:5000/game/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: props.question,
      playerAnswer: answer, // môže byť null = hráč nestihol
      difficulty: props.difficulty,
    }),
  })

  const data = await res.json()

  // data = { botAnswer, playerPoint, botPoint, playerCorrect, botCorrect }
  botAnswer.value = data.botAnswer
  showResult.value = true

  setTimeout(() => {
    // Emit skóre, front-end už nepotrebuje nič počítať
    emit('score', { playerPoint: data.playerPoint, botPoint: data.botPoint })
    emit('answered', data.playerCorrect)

    // Reset pre ďalšiu otázku
    showResult.value = false
    selectedAnswer.value = null
    botAnswer.value = null
    answered.value = false
  }, 1500)
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
