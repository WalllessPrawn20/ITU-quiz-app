<!----------------------------->
<!-- Author: Lukas Choleva ---->
<!-- Login: xcholel00 --------->
<!-- Date: 8.12.2025 ---------->
<!----------------------------->

<template>
  <div class="question-view">
    <h2>{{ question.title }}</h2>

    <!-- input for user answer -->
    <div class="input-box">
      <input
        type="number"
        v-model.number="playerValue"
        class="number-input"
        :disabled="answered"
      />
      <!-- sends said answer -->
      <button class="submit-btn" @click="sendAnswer" :disabled="answered">Submit</button>
    </div>

    <p>Time left: {{ remainingTime }}s</p>
    <!-- shows result -->
    <div v-if="showResult" class="result-box">
      <p>Correct answer: <strong>{{ question.correct }}</strong></p>
      <!-- if user answered shows his value -->
      <p v-if="playerValue">Your answer: <strong>{{ playerValue }}</strong></p>
      <p>Bot answer: <strong>{{ botValue.toFixed(1) }}</strong></p>

      <!-- win/lose -->
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

//data inserted
const props = defineProps({
  question: Object,
  duration: Number,
  difficulty: String
})

//gives back this
const emit= defineEmits(['answered', 'score'])

//initialization of umportant values
const remainingTime =ref(props.duration)
let interval = null

const playerValue= ref(null)
const answered = ref(false)

const botValue =ref(0)
const playerPoint = ref(0)
const botPoint = ref(0)

const showResult = ref(false)

let startTime= performance.now()

function startTimer() {
  clearInterval(interval)
  remainingTime.value = props.duration
  //start time
  startTime = performance.now()

  interval = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      clearInterval(interval)
      sendAnswer()
    }
  }, 1000)
}

//sends anwser to server(backend)
async function sendAnswer() {
  if (answered.value){ return
  }
  answered.value= true
  clearInterval(interval)

  //reaction time of user
  const reactionTime = performance.now() - startTime
  const value= Number(playerValue.value ?? NaN)

  //sending parametres to server
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

  //data from server
  const data = await res.json()

  botValue.value = data.botValue
  playerPoint.value =data.playerPoint
  botPoint.value = data.botPoint

  showResult.value =true

  //timeout to show results
  setTimeout(() => {
    //sends parent
    emit('score', { playerPoint: data.playerPoint, botPoint: data.botPoint })
    emit('answered', true)

    answered.value = false
    showResult.value = false
    playerValue.value= null
  }, 3000)
}

onMounted(() => {
  startTimer()
})

//new question
watch(
  () => props.question,
  () => {
    playerValue.value= null
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
  padding: 1.4rem;
  border: 2px solid #00cc66;
  border-radius: 10px;
  color: white;
  box-shadow: 0 0 12px #00cc66;
  width: 360px;
  text-align: center;
  overflow: hidden;
}

.input-box {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin: 1rem 0 0.6rem;
  flex-wrap: wrap;
}

.number-input {
  padding: 0.4rem 0.6rem;
  width: 95px;
  font-size: 16px;
  border: 2px solid #555;
  border-radius: 6px;
  background: #222;
  color: white;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: #00cc66;
}

.submit-btn {
  padding: 0.4rem 1rem;
  font-size: 16px;
  background: #222;
  border: 2px solid #555;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.submit-btn:hover:not(:disabled) {
  background: #00cc66;
  border-color: #00cc66;
  color: black;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.result-box {
  margin-top: 1rem;
  padding: 0.6rem 0.4rem;
  border-top: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 14px;
}

.you-win, .bot-win {
  margin-top: 3px;
  font-size: 15px;
  padding: 0.3rem;
  border-radius: 6px;
  font-weight: bold;
}

.you-win {
  background: #00cc66;
  color: black;
}

.bot-win {
  background: #ff4444;
  color: white;
}
</style>
