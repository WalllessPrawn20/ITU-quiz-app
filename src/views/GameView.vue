<template>
  <div class="game-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <h1>Europe Conquest</h1>
    </div>

    <div class="content">
      <!-- Left Info Panel -->
      <div class="info-panel">
        <p><strong>Time left:</strong> {{ timer }}s</p>
        <p><strong>Command:</strong> {{ command }}</p>
        <p><strong>Turns:</strong> {{ turn }}/{{ totalRounds }}</p>
        <!-- pridané -->
        <p><strong>Score</strong></p>
        <p>You: {{ scores.you }}</p>
        <p>Enemy: {{ scores.enemy }}</p>
      </div>

      <!-- SVG Map -->
      <div class="map-container" ref="mapContainer" v-html="europeSvg"></div>
    </div>

    <!-- Question View -->
    <QuestionView
      v-if="currentQuestion"
      :question="currentQuestion"
      :duration="questionDuration"
      @answered="handleAnswer"
      @timeout="handleTimeout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import europeSvg from '@/assets/europe.svg?raw'
import QuestionView from './QuestionABCDView.vue'

const mapContainer = ref(null)

const gameSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}')
const initialTimer = gameSettings.timer || 20
const timer = ref(initialTimer)
let gameInterval = null
const command = ref('Select a country')
const scores = ref({ you: 0, enemy: 0 })

// otázky - teraz načítané z backendu
const questions = ref([])
const currentQuestion = ref(null)
const questionDuration = 15
let selectedCountryId = null
const countryResults = ref({})

// klik na štát
async function handleCountryClick(countryId) {
  if (currentQuestion.value) return

  selectedCountryId = countryId
  command.value = `Loading question for ${countryId}...`

  // fetch otázok pre daný štát
  const countryQuestions = await fetchQuestions(countryId)

  if (countryQuestions.length) {
    // náhodná otázka zo zoznamu
    const randomIndex = Math.floor(Math.random() * countryQuestions.length)
    currentQuestion.value = countryQuestions[randomIndex]
    questionTimer.value = questionDuration
    command.value = `Question for ${countryId}`
  } else {
    command.value = `No question for ${countryId}`
  }

  // zvýraznenie kliknutého štátu
  const path = mapContainer.value.querySelector(`#${countryId}`)
  if (path) path.style.fill = '#00cc66'
}

const totalRounds = ref(gameSettings.rounds || 10) // z localStorage
const turn = ref(0) // aktuálne odohrané kolo

// každý krát po odpovedi zvýšiť turn
async function handleAnswer(correct) {
  if (correct) scores.value.you += 1
  else scores.value.enemy += 1

  countryResults.value[selectedCountryId] = correct ? 'correct' : 'wrong'

  const path = mapContainer.value.querySelector(`#${selectedCountryId}`)
  if (path) path.style.fill = correct ? '#00ff00' : '#ff3333'

  await updateStats('Europe', correct)

  turn.value++ // <-- pridané

  currentQuestion.value = null
  command.value = 'Select a country'

  startGameTimer()
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

// vypršal čas otázky
function handleTimeout() {
  countryResults.value[selectedCountryId] = 'wrong'

  const path = mapContainer.value.querySelector(`#${selectedCountryId}`)
  if (path) path.style.fill = '#ff3333'

  currentQuestion.value = null
  command.value = 'Select a country'

  startGameTimer()
}

// timer
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
    return data // vrátime otázky, neukladáme do questions.value
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
  height: 100vh;
  width: 100vw;
  font-family: 'Press Start 2P', monospace;
  color: white;
  background: #111;
}

.top-bar {
  background: #333;
  padding: 1rem;
  text-align: center;
}

.content {
  display: flex;
  flex: 1;
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
}

.map-container svg {
  width: 100%;
  height: 100%;
  max-width: 900px;
  max-height: 700px;
  border: 2px solid #555;
  background: #222;
}

.map-container path:hover {
  fill: #00ff88;
  transition: fill 0.2s;
}
</style>
