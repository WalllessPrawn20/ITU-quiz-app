<template>
  <div class="game-view">
    <div class="top-bar">
      <router-link to="/" class="title-link">World Conquest</router-link>
      <button class="pause-button" @click="togglePause">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
    </div>

    <div class="content" v-if="!gameOver">
      <div class="info-panel">
        <p><strong>Time left:</strong> {{ timer }}s</p>
        <p><strong>Command:</strong> {{ command }}</p>
        <p><strong>Turns:</strong> {{ turn }}/{{ totalRounds }}</p>
        <p><strong>Score</strong></p>
        <p>You: {{ scores.you }}</p>
        <p>Enemy: {{ scores.bot }}</p>
      </div>

      <
      <div class="map-container" ref="mapContainer" v-html="europeSvg" @wheel="handleZoom"></div>
    </div>

    <QuestionView
      v-if="currentQuestion && !gameOver"
      :question="currentQuestion"
      :duration="questionDuration"
      :difficulty="difficulty"
      @answered="handleAnswer"
      @timeout="handleTimeout"
      @score="handleScore"
    />

    <GameOverView v-if="gameOver" :scores="scores" :totalRounds="totalRounds" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import europeSvg from '@/assets/europe.svg?raw'
import QuestionView from './QuestionABCDView.vue'
import GameOverView from './GameOverView.vue'
import svgPanZoom from 'svg-pan-zoom'

const mapContainer = ref(null)

const gameSettings = ref({
  playerScore: 0,
  botScore: 0,
  turn: 0,
  continent: '',
  categories: {},
  difficulty: '',
  timer: 0,
  completed_turns: 0,
})
const initialTimer = gameSettings.timer || 20
const timer = ref(initialTimer)
let gameInterval = null
const command = ref('Select a country')

const scores = ref({ you: 0, bot: 0 })

const currentQuestion = ref(null)
const questionDuration = gameSettings.timer || 15
let selectedCountryId = null
const countryResults = ref({})

const totalRounds = ref(0)
const turn = ref(0)
const gameOver = ref(false)

const difficulty = gameSettings.difficulty || 'Medium'
let categories = ref({})

const isPaused = ref(false)

function togglePause() {
  isPaused.value = !isPaused.value
  let time = timer.value
  if (isPaused.value) {
    clearInterval(gameInterval) // pozastaví timer
    command.value = 'Game Paused'
  } else {
    command.value = 'Select a country'
    startGameTimer(time) // spustí timer znova
  }
}

async function handleCountryClick(countryId) {
  if (countryResults.value[countryId] || currentQuestion.value || gameOver.value) return

  clearInterval(gameInterval)

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
  await updateStats('Europe', correct)

  if (turn.value >= totalRounds.value) {
    endGame()
    return
  }

  currentQuestion.value = null
  command.value = 'Select a country'

  startGameTimer(10)
}

function handleScore({ playerPoint, botPoint }) {
  if (!selectedCountryId) return

  // Zober prvé dva znaky ID
  const prefix = selectedCountryId.slice(0, 2)

  // Všetky cesty, ktorých id začína na prefix
  const paths = mapContainer.value.querySelectorAll(`path[id^="${prefix}"]`)

  paths.forEach((path) => {
    if (playerPoint) {
      path.style.fill = '#00ff00' // hráč správne
      countryResults.value[path.id] = 'correct'
    } else if (botPoint) {
      path.style.fill = '#ff3333' // bot správne
      countryResults.value[path.id] = 'wrong'
    }
  })
}

function endGame() {
  clearInterval(gameInterval)
  gameOver.value = true
  command.value = 'Game Over!'
}

//TODO

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
  startGameTimer(10)
}

function startGameTimer(time) {
  clearInterval(gameInterval)
  timer.value = time
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
    console.log('Current categories:', categories.value)
    const categoryParam = categories.value.join(',')
    console.log('Fetching questions for ID:', capitalizedId, 'Categories:', categories)
    const res = await fetch(
      `http://localhost:5000/questions/filter?id=${capitalizedId}&category=${categoryParam}`,
    )

    if (!res.ok) throw new Error('Failed to fetch questions')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Error loading questions:', err)
    return []
  }
}
onMounted(async () => {
  // 🔁 Najprv vynuluj skóre na serveri
  try {
    const res = await fetch('http://localhost:5000/game/load')
    const data = await res.json()
    console.log('Game settings from server:', data)
    gameSettings.value = data
    categories.value = Object.keys(gameSettings.value?.categories || {}).filter(
      (key) => gameSettings.value.categories[key] === true,
    )
    totalRounds.value = gameSettings.value.turns || 25
    turn.value = 0
    console.log('✅ Game settings loaded')
  } catch (err) {
    console.error('❌ Failed to load game score:', err)
  }

  const svg = mapContainer.value.querySelector('svg')
  if (!svg) return

  // odstrániť predvolené width/height, aby sa bral viewBox
  svg.removeAttribute('width')
  svg.removeAttribute('height')

  // nastav CSS štýl, aby zabral celý kontajner
  svg.style.width = '100%'
  svg.style.height = '100%'

  svgPanZoom(svg, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    minZoom: 0.5,
    maxZoom: 5,
    zoomScaleSensitivity: 0.2,
  })

  // 🔹 Pridaj klikateľnosť pre krajiny na mape
  const paths = mapContainer.value.querySelectorAll('path')
  paths.forEach((path) => {
    path.style.cursor = 'pointer'
    path.addEventListener('click', (e) => {
      e.stopPropagation()
      handleCountryClick(path.id)
    })
  })

  startGameTimer(10)

  updateScoresFromServer() // hneď načíta prvé hodnoty
  setInterval(updateScoresFromServer, 1500) // každú sekundu
})

onUnmounted(() => {
  clearInterval(gameInterval)
})

// ===== Funkcia na sťahovanie skóre zo servera =====
async function updateScoresFromServer() {
  try {
    const res = await fetch('http://localhost:5000/game/score')
    if (!res.ok) throw new Error('Failed to fetch score')
    const data = await res.json()
    scores.value.you = data.playerScore
    scores.value.bot = data.botScore
    turn.value = data.completed_turns
  } catch (err) {
    console.error('Error fetching scores:', err)
  }
}
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  font-family: 'Press Start 2P', monospace;
  color: white;
  background: #111;
  overflow: hidden;
}

.top-bar {
  background: #333;
  text-align: center;
  font-size: 25px;
  padding: 1rem 0;
}

.title-link {
  color: white;
  text-decoration: none;
  font-size: 40px;
}

.title-link:hover {
  color: #00ff88;
}

.content {
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
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
  align-items: flex-start;
  padding: 1rem;
  overflow: hidden;
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

.pause-button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 16px;
  background: #555;
  color: white;
  border: 2px solid #00cc66;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.pause-button:hover {
  background: #00cc66;
  color: black;
}
</style>
