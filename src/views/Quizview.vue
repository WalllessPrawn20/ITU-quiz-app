<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import europe from '../assets/europe.svg?raw'
import asia from '../assets/asia.svg?raw'
import oceania from '../assets/oceania.svg?raw'
import world from '../assets/world.svg?raw'
import africa from '../assets/africa.svg?raw'
import americas from '../assets/americas.svg?raw'
import { useRouter } from 'vue-router'

const router = useRouter()

const stored = JSON.parse(localStorage.getItem('quizSettings') || '{}')
const defaultTimer = stored.timer ?? 15
const defaultTurns = stored.turns ?? 25
const continent = localStorage.getItem('region')

// --- Select map svg ---
const map = ref(world)
if (continent === 'europe') map.value = europe
if (continent === 'asia') map.value = asia
if (continent === 'africa') map.value = africa
if (continent === 'americas') map.value = americas
if (continent === 'oceania') map.value = oceania
if (continent === 'world') map.value = world

// --- Game state ---
const initialTurns = parseInt(defaultTurns, 10)
const maxTime = parseInt(defaultTimer, 10)

const timeLeft = ref(maxTime)
const turnsLeft = ref(initialTurns)
const playerScore = ref(0)
const enemyScore = ref(0)
const selectedCountry = ref(null)
const isGameOver = ref(false)

// timer interval handle
let intervalId = null

// Start or restart timer
function startTimer() {
  clearTimer()
  timeLeft.value = maxTime
  intervalId = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// When time runs out -> enemy +1, next turn
function handleTimeout() {
  clearTimer()
  if (isGameOver.value) return
  enemyScore.value++
  // zmenit na po otazke
  nextTurn()
}

// Called after a successful click (or when you want to go to next)
function nextTurn() {
  // mark used country visually kept by .selected class
  if (turnsLeft.value > 0) turnsLeft.value--
  if (turnsLeft.value <= 0) {
    endGame()
    return
  }
  // reset selected country for the next question (optional keep)
  selectedCountry.value = null
  // restart timer
  timeLeft.value = maxTime
  startTimer()
}

function endGame() {
  isGameOver.value = true
  clearTimer()
}

// Handle click on SVG countries (we get event from v-html container)
function handleClick(e) {
  const id = e.target.id
  if (!id) return
  // extract prefix for multi-part ids like "ru-main"
  const prefix = id.split('-')[0]
  selectedCountry.value = prefix
  // visually mark all parts with that prefix
  const parts = document.querySelectorAll(`[id^="${prefix}-"], #${prefix}`)
  parts.forEach((el) => el.classList.add('selected'))

  // scoring behaviour for demo: increment player score on click
  playerScore.value++

  // advance turns and reset timer
  nextTurn()
}

// Hover highlight (temporary color while hovering)
function handleHover(e, enter) {
  const id = e.target.id
  if (!id) return
  const prefix = id.split('-')[0]
  const parts = document.querySelectorAll(`[id^="${prefix}-"], #${prefix}`)
  parts.forEach((el) => {
    if (!el.classList.contains('selected')) {
      el.style.fill = enter ? 'orange' : ''
    }
  })
}

// Start timer when component mounts
onMounted(() => {
  startTimer()
})

// Cleanup
onBeforeUnmount(() => {
  clearTimer()
})

// computed values for UI
const currentTurnText = computed(() => {
  const done = initialTurns - turnsLeft.value + 1
  return `${done}/${initialTurns}`
})
</script>

<template>
  <div class="quiz-root">
    <!-- Top left info box -->
    <div class="info-box">
      <div class="info-title">Click on any country on the map</div>
      <div class="time-row">
        <div class="time-icon">⏳</div>
        <div class="time-text">
          Time remaining: <strong>{{ timeLeft }}s</strong>
        </div>
      </div>
      <div class="selected-row" v-if="selectedCountry">
        Selected: <strong>{{ selectedCountry }}</strong>
      </div>
    </div>

    <!-- Left score panel -->
    <div class="score-panel">
      <div class="turns">Turn: {{ currentTurnText }}</div>
      <div class="score-title">SCORE</div>
      <div class="score-item">
        Player: <span class="score-num">{{ playerScore }}</span>
      </div>
      <div class="score-item">
        Enemy: <span class="score-num">{{ enemyScore }}</span>
      </div>

      <button class="back-btn" @click="$router.push('/category')">← Back</button>
    </div>

    <!-- Map area -->
    <div
      class="map-wrap"
      v-html="map"
      @click="handleClick"
      @mouseover="(e) => handleHover(e, true)"
      @mouseout="(e) => handleHover(e, false)"
    ></div>

    <!-- Game Over overlay -->
    <div class="game-over" v-if="isGameOver">
      <div class="game-over-box">
        <div class="go-title">Game Over</div>
        <div class="final-score">Player: {{ playerScore }} — Enemy: {{ enemyScore }}</div>
        <button class="restart" @click="$router.push('/category')">Restart</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Layout root */
.quiz-root {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 20%, #051627 0%, #021020 70%);
  overflow: hidden;
  font-family: sans-serif;
  color: white;
}

/* Info box top-left */
.info-box {
  position: absolute;
  left: 2vw;
  top: 2vh;
  width: 20vw;
  min-height: 10vh;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1.2vw;
  padding: 1.2vh 1.2vw;
  border: 0.25vw solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1vh;
  backdrop-filter: blur(0.6vw);
}

.info-title {
  font-size: 1.1rem;
  opacity: 0.95;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 1vw;
  font-size: 1rem;
  margin-top: 0.5vh;
}

.time-icon {
  width: 3vh;
  height: 3vh;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Left score panel */
.score-panel {
  position: absolute;
  left: 2vw;
  bottom: 6vh;
  width: 18vw;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 2vw;
  padding: 2vh 1.4vw;
  text-align: left;
  box-shadow: 0 0 6vw rgba(0, 0, 0, 0.2);
}

.turns {
  font-size: 1.2rem;
  margin-bottom: 1.5vh;
}

.score-title {
  font-size: 2.4rem;
  letter-spacing: 0.2rem;
  margin-bottom: 1.4vh;
}

.score-item {
  font-size: 1.4rem;
  margin: 0.8vh 0;
}
.score-num {
  float: right;
  font-weight: 700;
}

/* Back button small */
.back-btn {
  margin-top: 2vh;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  padding: 0.8vh 1.2vw;
  border-radius: 0.8vw;
  color: white;
  cursor: pointer;
}

/* Map wrapper */
.map-wrap {
  width: 70vw;
  height: 82vh;
  max-width: 90vw;
  max-height: 90vh;
  display: block;
  border-radius: 0.8vw;
  overflow: hidden;
  box-shadow: 0 0 2vw rgba(0, 0, 0, 0.6);
}

/* SVG styling inside the map */
.map-wrap svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Default paths */
.map-wrap svg path,
.map-wrap svg g {
  fill: #ffffff; /* base fill - you can change */
  stroke: rgba(0, 0, 0, 0.45);
  stroke-width: 0.06vw;
  transition: fill 0.15s ease;
  cursor: pointer;
}

/* hover (only applies when not already selected) */
.map-wrap svg path:hover:not(.selected),
.map-wrap svg g:hover:not(.selected) {
  fill: orange;
}

/* selected country */
.map-wrap svg path.selected,
.map-wrap svg g.selected {
  fill: crimson !important;
}

/* Game over overlay */
.game-over {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(0.6vw);
}

.game-over-box {
  width: 40vw;
  min-height: 18vh;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 2vw;
  border: 0.2vw solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
}

.go-title {
  font-size: 2.4rem;
  font-weight: 700;
}

.final-score {
  font-size: 1.6rem;
}

/* small screens scaling */
@media (max-width: 600px) {
  .map-wrap {
    width: 90vw;
    height: 70vh;
  }
  .info-box {
    width: 40vw;
    left: 4vw;
    top: 2vh;
  }
  .score-panel {
    width: 32vw;
    left: 4vw;
    bottom: 2vh;
  }
  .game-over-box {
    width: 80vw;
  }
}
</style>
