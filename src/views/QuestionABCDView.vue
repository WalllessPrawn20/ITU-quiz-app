<template>
  <div class="question-overlay" v-if="!tiebreakActive">
    <div class="question-card">
      <h2>{{ props.question.title }}</h2>
      <p class="question-timer">Time left: {{ remainingTime }}s</p>

      <div class="answers">
        <button
          v-for="(answer, index) in props.question.answers"
          :key="index"
          @click="selectAnswer(answer)"
          :disabled="answered"
        >
          {{ answer }}
        </button>
      </div>

      <div v-if="showResult" class="result">
        <p v-if="playerCorrect && !botCorrect">✅ You got it right!</p>
        <p v-else-if="!playerCorrect && botCorrect">🤖 Bot was right!</p>
        <p v-else-if="playerCorrect && botCorrect">😐 Both correct!</p>
        <p v-else>❌ Both wrong!</p>
      </div>
    </div>
  </div>

  <!-- 🔥 Rozstrel (tie-breaker) -->
  <div class="question-overlay" v-else>
    <div class="question-card">
      <h2>{{ tiebreakQuestion.title }}</h2>
      <input
        type="number"
        v-model.number="playerGuess"
        placeholder="Your guess..."
        :disabled="answered"
      />
      <button v-if="!answered" @click="submitTiebreak">Submit</button>

      <div v-if="tiebreakResult">
        <p>Correct answer: {{ tiebreakQuestion.correct }}</p>
        <p v-if="winner === 'player'">✅ You were closer! +1 point</p>
        <p v-else-if="winner === 'bot'">🤖 Bot was closer! +1 point</p>
        <p v-else>😐 It's a perfect tie!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  question: Object,
  duration: Number,
})
const emit = defineEmits(['answered', 'timeout'])

const remainingTime = ref(props.duration)
const interval = ref(null)
const answered = ref(false)
const selectedAnswer = ref(null)
const showResult = ref(false)
const botAnswer = ref(null)
const playerCorrect = ref(false)
const botCorrect = ref(false)

// 🔥 Rozstrel pre remízu
const tiebreakActive = ref(false)
const tiebreakQuestion = ref({
  title: 'Tie-breaker: How many countries are in Europe?',
  correct: 44,
})
const playerGuess = ref(null)
const botGuess = ref(null)
const tiebreakResult = ref(false)
const winner = ref(null)

// 🕒 Timer
function startTimer() {
  clearInterval(interval.value)
  remainingTime.value = props.duration
  interval.value = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(interval.value)
      emit('timeout')
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(interval.value)
}

// 🤖 Bot answer
function botSelectAnswer() {
  const randomIndex = Math.floor(Math.random() * props.question.answers.length)
  botAnswer.value = props.question.answers[randomIndex]
}

function selectAnswer(answer) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = answer

  botSelectAnswer()
  stopTimer()

  playerCorrect.value = answer === props.question.correct
  botCorrect.value = botAnswer.value === props.question.correct
  showResult.value = true

  // 🧮 Vyhodnotenie bodov
  let playerPoint = 0
  let botPoint = 0

  if (playerCorrect.value && !botCorrect.value) {
    playerPoint = 1
  } else if (!playerCorrect.value && botCorrect.value) {
    botPoint = 1
  } else {
    // 🟰 Remíza → aktivuj rozstrel
    setTimeout(() => {
      activateTiebreak()
    }, 2000)
  }

  emit('answered', { playerPoint, botPoint })
}

function activateTiebreak() {
  tiebreakActive.value = true
  showResult.value = false
  answered.value = false
  tiebreakResult.value = false
  playerGuess.value = null
  botGuess.value = null
}

// 🔢 Rozstrel logika
function submitTiebreak() {
  if (answered.value) return
  answered.value = true

  // Bot tipne náhodne +-10 od správnej odpovede
  botGuess.value = tiebreakQuestion.value.correct + Math.floor(Math.random() * 21 - 10)

  const playerDiff = Math.abs(playerGuess.value - tiebreakQuestion.value.correct)
  const botDiff = Math.abs(botGuess.value - tiebreakQuestion.value.correct)

  if (playerDiff < botDiff) {
    winner.value = 'player'
  } else if (botDiff < playerDiff) {
    winner.value = 'bot'
  } else {
    winner.value = 'tie'
  }

  tiebreakResult.value = true

  // 📤 Odošli výsledok po krátkej pauze
  setTimeout(() => {
    let playerPoint = winner.value === 'player' ? 1 : 0
    let botPoint = winner.value === 'bot' ? 1 : 0
    emit('answered', { playerPoint, botPoint })
    tiebreakActive.value = false
  }, 2000)
}

onMounted(() => startTimer())
onUnmounted(() => stopTimer())
</script>

<style scoped>
.question-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.question-card {
  background: #222;
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  width: 400px;
}
.answers button {
  margin: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
input {
  margin-top: 10px;
  padding: 6px;
  border-radius: 8px;
  border: none;
  text-align: center;
}
</style>
