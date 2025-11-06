<template>
  <div class="game-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <h1>Europe Conquest</h1>
    </div>

    <div class="content" v-if="!gameOver">
      <!-- Left Info Panel -->
      <div class="info-panel">
        <p><strong>Time left:</strong> {{ timer }}s</p>
        <p><strong>Command:</strong> {{ command }}</p>
        <p><strong>Turns:</strong> {{ turn }}/{{ totalRounds }}</p>
        <p><strong>Score</strong></p>
        <p>You: {{ scores.you }}</p>
        <p>Enemy: {{ scores.bot }}</p>
      </div>

      <!-- SVG Map -->
      <div class="map-container" ref="mapContainer" v-html="europeSvg"></div>
    </div>

    <!-- Question View -->
    <QuestionView
      v-if="currentQuestion && !gameOver"
      :question="currentQuestion"
      :duration="questionDuration"
      :difficulty="difficulty"
      @answered="handleAnswer"
      @timeout="handleTimeout"
      @score="handleScore"
    />

    <!-- Game Over View -->
    <GameOverView v-if="gameOver" :scores="scores" :totalRounds="totalRounds" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import europeSvg from '@/assets/europe.svg?raw'
import QuestionView from './QuestionABCDView.vue'
import GameOverView from './GameOverView.vue'

const mapContainer = ref(null)

const gameSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}')
const initialTimer = gameSettings.timer || 20
const timer = ref(initialTimer)
let gameInterval = null
const command = ref('Select a country')

// ✅ pridáme bot skóre
const scores = ref({ you: 0, bot: 0 })

const questions = ref([])
const currentQuestion = ref(null)
const questionDuration = gameSettings.timer || 15
let selectedCountryId = null
const countryResults = ref({})

const totalRounds = ref(gameSettings.rounds)
const turn = ref(0)
const gameOver = ref(false)

const difficulty = gameSettings.difficulty || 'Medium'

// klik na štát
async function handleCountryClick(countryId) {
  if (currentQuestion.value || gameOver.value) return

  selectedCountryId = countryId
  command.value = `Loading question for ${countryId}...`

  const countryQuestions = await fetchQuestions(countryId)

  if (countryQuestions.length) {
    const randomIndex = Math.floor(Math.random() * countryQuestions.length)
    currentQuestion.value = countryQuestions[randomIndex]
    command.value = `Question for ${countryId}`
  } else {
    command.value = `No question for ${countryId}`
  }
}

async function handleAnswer(correct) {
  // ❌ tu už nepridávame body, riešime cez handleScore
  countryResults.value[selectedCountryId] = correct ? 'correct' : 'wrong'

  await updateStats('Europe', correct)

  turn.value++

  if (turn.value >= totalRounds.value) {
    endGame()
    return
  }

  currentQuestion.value = null
  command.value = 'Select a country'

  startGameTimer()
}

// ✅ handler pre bodovanie
function handleScore({ playerPoint, botPoint }) {
  scores.value.you += playerPoint
  scores.value.bot += botPoint

  const path = mapContainer.value.querySelector(`#${selectedCountryId}`)
  if (path && playerPoint) path.style.fill = '#00ff00'
  else if (path && botPoint) path.style.fill = '#ff3333'
}

function endGame() {
  clearInterval(gameInterval)
  gameOver.value = true
  command.value = 'Game Over!'
}

async function updateStats(continent, correct) {
  try {
    const res = await fetch('http://localhost:5000/stats/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        continent,
        correct: correct ? 1 : 0,
      }),
    })
    if (!res.ok) throw new Error('Failed to update stats')
  } catch (err) {
    console.error('Error updating stats:', err)
  }
}

function handleTimeout() {
  countryResults.value[selectedCountryId] = 'wrong'
  const path = mapContainer.value.querySelector(`#${selectedCountryId}`)
  currentQuestion.value = null
  command.value = 'Select a country'
  startGameTimer()
}

function startGameTimer() {
  clearInterval(gameInterval)
  timer.value = 10
  gameInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1
    } else {
      clearInterval(gameInterval)
      const paths = mapContainer.value.querySelectorAll('path')
      const unselected = Array.from(paths).filter((p) => !countryResults.value[p.id])
      if (unselected.length > 0) {
        const randomPath = unselected[Math.floor(Math.random() * unselected.length)]
        handleCountryClick(randomPath.id)
      } else {
        command.value = 'Time is up! No more countries left.'
      }
    }
  }, 1000)
}

async function fetchQuestions(id) {
  try {
    const capitalizedId = id.slice(0, 2).toUpperCase()
    const res = await fetch(`http://localhost:5000/questions/filter?id=${capitalizedId}`)
    if (!res.ok) throw new Error('Failed to fetch questions')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Error loading questions:', err)
    return []
  }
}

onMounted(async () => {
  const paths = mapContainer.value.querySelectorAll('path')
  paths.forEach((path) => {
    path.style.cursor = 'pointer'
    path.addEventListener('click', (e) => {
      e.stopPropagation()
      handleCountryClick(path.id)
    })
  })

  startGameTimer()
})
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  height: 100vh; /* ❌ nie auto, ale celá výška viewportu */
  width: 100vw;
  font-family: 'Press Start 2P', monospace;
  color: white;
  background: #111;
  overflow: hidden; /* zabráni scrollom ak náhodou presiahne */
}

.top-bar {
  background: #333;
  padding: 1rem;
  text-align: center;
  flex-shrink: 0; /* nech top-bar nemení veľkosť */
}

.content {
  display: flex;
  flex: 1 1 auto; /* zvyšok priestoru vyplní content */
  overflow: hidden; /* nech map-container nepridá scroll */
}

.info-panel {
  width: 250px;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  overflow: hidden; /* zabráni scrollu */
}

.map-container svg {
  max-width: 100%;
  max-height: 100%;
  border: 2px solid #555;
  background: #222;
  transform: scale(1.3);
  transform-origin: center;
}

.map-container path:hover {
  fill: #00ff88;
  transition: fill 0.2s;
}
</style>
