<template>
  <div class="question-view">
    <h2>{{ question.title }}</h2>

    <div class="input-box">
      <input
        type="number"
        v-model.number="playerValue"
        class="number-input"
        placeholder="Your answer"
        :disabled="answered"
      />
      <button class="submit-btn" @click="sendAnswer" :disabled="answered">Submit</button>
    </div>

    <p>Time left: {{ remainingTime }}s</p>

    <div v-if="showResult" class="result-box">
      <p>Correct answer: <strong>{{ question.correct }}</strong></p>
      <p v-if="playerValue">Your answer: <strong>{{ playerValue }}</strong></p>
      <p>Bot answer: <strong>{{ botValue.toFixed(1) }}</strong></p>

      <p
        v-if="playerPoint > botPoint"
        class="you-win"
      >
        You win the round!
      </p>
      <p
        v-else
        class="bot-win"
      >
        Bot wins the round!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  question: Object,
  duration: Number,
  difficulty: String
})

const emit = defineEmits(['answered', 'score'])

const remainingTime = ref(props.duration)
let interval = null

const playerValue = ref(null)
const answered = ref(false)

const botValue = ref(0)
const playerPoint = ref(0)
const botPoint = ref(0)

const showResult = ref(false)

let startTime = performance.now()

function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  startTime = performance.now()

  interval = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      clearInterval(interval)
      sendAnswer()
    }
  }, 1000)
}

async function sendAnswer() {
  if (answered.value) return
  answered.value = true
  clearInterval(interval)

  const reactionTime = performance.now() - startTime
  const value = Number(playerValue.value ?? NaN)

  const res = await fetch('http://localhost:5000/game/answer2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: props.question,
      playerValue: value,
      reactionTime,
      difficulty: props.difficulty
    })
  })

  const data = await res.json()

  botValue.value = data.botValue
  playerPoint.value = data.playerPoint
  botPoint.value = data.botPoint

  showResult.value = true

  setTimeout(() => {
    emit('score', { playerPoint: data.playerPoint, botPoint: data.botPoint })
    emit('answered', true)

    answered.value = false
    showResult.value = false
    playerValue.value = null
  }, 3000)
}

onMounted(() => {
  startTimer()
})

watch(
  () => props.question,
  () => {
    playerValue.value = null
    answered.value = false
    showResult.value = false
    startTimer()
  }
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
  width: 400px;
  text-align: center;
}

.input-box {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.number-input {
  padding: 0.5rem 1rem;
  width: 120px;
  font-size: 18px;
  border: 2px solid #555;
  border-radius: 8px;
  background: #222;
  color: white;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: #00cc66;
  box-shadow: 0 0 10px #00cc66;
}

.submit-btn {
  padding: 0.5rem 1.2rem;
  font-size: 18px;
  background: #00cc66;
  border: 2px solid #00aa55;
  border-radius: 8px;
  cursor: pointer;
  color: black;
  font-weight: bold;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #00ff88;
  box-shadow: 0 0 10px #00ff88;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.timer {
  margin-top: 1rem;
  font-weight: bold;
}

.result-box {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.round-result {
  font-size: 20px;
  font-weight: bold;
}

.you-win {
  color: #00ff88;
}

.bot-win {
  color: #ff5555;
}

.tie {
  color: #ffff66;
}
</style>
