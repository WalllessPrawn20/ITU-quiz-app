<!----------------------------->
<!-- Author: Matej Melchiory -->
<!-- Login: xmelchm00 --------->
<!-- Date: 3.12.2025 ---------->
<!----------------------------->

<template>
  <div class="game-view">
    <div class="top-bar">
      <!-- Route to go back home through the reacting logo -->
      <router-link to="/" class="title-link">World Conquest</router-link>
      <!-- Pause button to pause the game -->
      <button class="pause-button" @click="togglePause">
        {{ is_paused ? 'Resume' : 'Pause' }}
      </button>
    </div>

    <!-- A panel with all information necessary, all variables loaded from the server -->
    <div class="content" v-if="!game_over">
      <div class="info-panel">
        <p><strong>Time left:</strong> {{ timer }}s</p>
        <p><strong>Action:</strong> {{ command }}</p>
        <p><strong>Turns:</strong> {{ turn }}/{{ totalRounds }}</p>
        <p><strong>Score</strong></p>
        <p>You: {{ scores.you }}</p>
        <p>Enemy: {{ scores.bot }}</p>
      </div>
      <div class="map-container" ref="mapContainer" v-html="americaSvg" @wheel="handleZoom"></div>
    </div>

    <!-- Mounting the QuestionABCD when the question is loaded and the type is abcd -->
    <QuestionView
      v-if="currentQuestion && currentQuestion.type === 'abcd' && !game_over"
      :question="currentQuestion"
      :duration="questionDuration"
      :difficulty="difficulty"
      @answered="handleAnswer"
      @timeout="handleTimeout"
      @score="handleScore"
    />

    <!-- Mounting the QuestionNumber when the question is loaded and the type is numeric -->
    <QuestionNumberView
      v-if="currentQuestion && currentQuestion.type === 'numeric' && !game_over"
      :question="currentQuestion"
      :duration="questionDuration"
      @answered="handleAnswer"
      @score="handleScore"
    />

    <!-- Mounting the GameOverView when the game is over -->
    <GameOverView v-if="game_over" :scores="scores" :totalRounds="totalRounds" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import europeSvg from '@/assets/europe.svg?raw'
import americaSvg from '@/assets/americas.svg?raw'
import QuestionView from './QuestionABCDView.vue'
import GameOverView from './GameOverView.vue'
import svgPanZoom from 'svg-pan-zoom'
import QuestionNumberView from './QuestionNumberView.vue'

const mapContainer = ref(null)

// Game settings loaded from the server to configure the game
const game_settings = ref({
  playerScore: 0,
  player_country: [],
  botScore: 0,
  bot_country: [],
  turn: 0,
  continent: '',
  categories: {},
  difficulty: '',
  timer: 0,
  completed_turns: 0,
})

// Game settings variables
const initial_timer = game_settings.value.timer || 20
let game_interval = null
let continent = ref('Europe')
let categories = ref({})
const difficulty = game_settings.value.difficulty || 'Medium'

// Checks
const is_paused = ref(false)
const game_over = ref(false)

// Country question variables
const currentQuestion = ref(null)
const questionDuration = ref(15)
let selectedCountryId = null
const countryResults = ref({})

// Info panel variables
const timer = ref(initial_timer)
const totalRounds = ref(0)
const turn = ref(0)
const scores = ref({ you: 0, bot: 0 })
const command = ref('Select a country')


// Function to toggle pause state, freeze the game
function togglePause() {
  is_paused.value = !is_paused.value
  let time = timer.value

  if (is_paused.value) {
    clearInterval(game_interval)  // Pause the timer
    command.value = 'Game Paused'
  }
  else {
    command.value = 'Select a country'
    startGameTimer(time)  // Resume with remaining time
  }
}

// Function to handle the click on a country, continues to load a random question from the server with country ID
async function handleCountryClick(countryId) {

  // Prevent clicking on already answered countries or during a question or after game over
  if (countryResults.value[countryId] || currentQuestion.value || game_over.value) return

  clearInterval(game_interval)

  selectedCountryId = countryId
  command.value = `Loading question for ${countryId}...`

  // Fetch questions for the clicked country
  let countryQuestions = await fetchQuestions(countryId)
  countryQuestions = countryQuestions.filter((q) => q.type === 'abcd')

  // If there is a question, pick a random one
  if (countryQuestions.length) {
    const randomIndex = Math.floor(Math.random() * countryQuestions.length)
    currentQuestion.value = countryQuestions[randomIndex]
    command.value = `Answer a question for ${countryId}`
  }
  else {
    command.value = `No question for ${countryId} found`
  }
}

// Function to handle the answer result for the abcd question or if the result was a tie getting numeric question
async function handleAnswer(result) {
  if (result.tie) {

    const numeric = await fetchQuestions(selectedCountryId)
    const numOnly = numeric.filter((q) => q.type === 'numeric')

    if (numOnly.length > 0) {
      currentQuestion.value = numOnly[Math.floor(Math.random() * numOnly.length)]
      return
    }
  }

  // Update the stats on the server
  console.log('Updating stats for continent:', continent.value, 'Correct:', result.playerCorrect)
  await updateStats(continent, result.playerCorrect)

  // Go to the next turn or end the game if all rounds are completed
  if (turn.value >= totalRounds.value) {
    endGame()
    return
  }

  currentQuestion.value = null
  command.value = 'Select a country'

  startGameTimer(10)
}

// Function to handle scoring and coloring the country based on who got it right
function handleScore({ playerPoint, botPoint }) {
  if (!selectedCountryId) return

  // A differrent type of svgs magic, if the id isnt on a group, try to find id on path directly
  let countryGroup = mapContainer.value.querySelector(`g[id="${selectedCountryId}"]`)
  let paths = []

  if (countryGroup) {
    paths = countryGroup.querySelectorAll('path')
  } else {
    const singlePath = mapContainer.value.querySelector(`path[id="${selectedCountryId}"]`)
    if (singlePath) paths = [singlePath]
  }

  // Color the country based on who got it right and update the server to know what continent is correct/wrong for the site refresh
  paths.forEach(async (path) => {
    if (playerPoint) {
      path.style.fill = '#00ff00' // hráč správne
      countryResults.value[path.id || selectedCountryId] = 'correct'

      await fetch('http://localhost:5000/game/country/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'player',
          countryId: selectedCountryId,
        }),
      })
    }
    else if (botPoint) {
      path.style.fill = '#ff3333'
      countryResults.value[path.id || selectedCountryId] = 'wrong'

      await fetch('http://localhost:5000/game/country/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'bot',
          countryId: selectedCountryId,
        }),
      })
    }
  })
}

// Function to end the game, stop the timer and show game over screen
function endGame() {
  clearInterval(game_interval)
  game_over.value = true
  command.value = 'Game Over!'
}

//TODO hm?

// Function to update statistics json with the chosen continent on the server
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
  }
  catch (err) {
    console.error('Error updating stats:', err)
  }
}

// Function to handle timeout when no answer is given in time
function handleTimeout() {
  countryResults.value[selectedCountryId] = 'wrong'
  currentQuestion.value = null
  command.value = 'Select a country'
  startGameTimer(10)
}

// Function to start the game timer for each question or turn
function startGameTimer(time) {
  clearInterval(game_interval)
  timer.value = time

  // Start the countdown
  game_interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1
    }
    else {
      clearInterval(game_interval)
      const paths = mapContainer.value.querySelectorAll('path')
      const unselected = Array.from(paths).filter((p) => !countryResults.value[p.id])
      if (unselected.length > 0) {
        const randomPath = unselected[Math.floor(Math.random() * unselected.length)]
        handleCountryClick(randomPath.id)
      }
      else {
        command.value = 'Time is up! No more countries left.'
      }
    }
  }, 1000)
}

// Function to fetch questions for a given country ID from the server
async function fetchQuestions(id) {
  try {
    // Change of the ID to match server expectations
    const capitalizedId = id.slice(0, 2).toUpperCase()
    const categoryParam = categories.value.join(',')

    // Fetch both types of questions
    const res1 = await fetch(
      `http://localhost:5000/questions/filter?id=${capitalizedId}&category=${categoryParam}`,
    )
    const abcd = res1.ok ? await res1.json() : []

    const res2 = await fetch(`http://localhost:5000/questions2/filter?id=${capitalizedId}`)
    const numericRaw = res2.ok ? await res2.json() : []

    // Add type to each question
    const numeric = numericRaw.map((q) => ({ ...q, type: 'numeric' }))
    const abcdTyped = abcd.map((q) => ({ ...q, type: 'abcd' }))

    // Combine both types and return
    return [...abcdTyped, ...numeric]
  } catch (err) {
    console.error('Error loading questions:', err)
    return []
  }
}

// An actual function to get all paths for a country, whether in a group or single path, part of the coloring fuinction when the site is refreshed
function getCountryPaths(countryId) {
  let group = mapContainer.value.querySelector(`g[id="${countryId}"]`)
  if (group) return group.querySelectorAll('path')

  let single = mapContainer.value.querySelector(`path[id="${countryId}"]`)
  return single ? [single] : []
}

// Function to color a country on the map based on who got it right before the site refresh
function colorCountry(countryId, who) {
  const paths = getCountryPaths(countryId)
  paths.forEach((path) => {
    if (who === 'player') {
      path.style.fill = '#00ff00'
      countryResults.value[path.id || countryId] = 'correct'
    } else if (who === 'bot') {
      path.style.fill = '#ff3333'
      countryResults.value[path.id || countryId] = 'wrong'
    }
  })
}

// On component mount, load game settings and initialize the map and timer
onMounted(async () => {
  try {
    // Load game settings from the server
    const res = await fetch('http://localhost:5000/game/load')
    const data = await res.json()
    game_settings.value = data

    // Set up game parameters based on loaded settings
    categories.value = Object.keys(game_settings.value?.categories || {}).filter(
      (key) => game_settings.value.categories[key] === true,
    )
    totalRounds.value = +game_settings.value.turns || 25
    turn.value = 0
    questionDuration.value = +game_settings.value.timer || 15
    continent.value = game_settings.value.continent
  } catch (err) {
    console.error('Failed to load game score:', err)
  }

  // Choosing the correct SVG based on the continent
  if (continent.value === 'americas') {
    mapContainer.value.innerHTML = americaSvg
  } else {
    mapContainer.value.innerHTML = europeSvg
  }

  const svg = mapContainer.value.querySelector('svg')
  if (!svg) return

  // Forcing the SVG to take full container size for pan and zoom
  svg.removeAttribute('width')
  svg.removeAttribute('height')
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

  // Adding click listeners to all paths representing countries
  const paths = mapContainer.value.querySelectorAll('path')
  paths.forEach((path) => {
    path.style.cursor = 'pointer'
    path.addEventListener('click', (e) => {
      e.stopPropagation()

      let countryId
      if (continent.value === 'americas') {
        countryId = path.parentElement?.id // ID from the americas svg is on parent g element
        if (countryId === 'two_planets') {
          countryId = path.id
        }
        console.log('Clicked country ID:', countryId)
      } else {
        countryId = path.id
      }

      if (countryId){
        handleCountryClick(countryId)
      }
    })
  })

  // Coloring already answered countries based on loaded game settings using custom functions
  if (game_settings.value.player_country) {
    console.log('Coloring player countries:', game_settings.value.player_country)
    game_settings.value.player_country.forEach((id) => colorCountry(id, 'player'))
  }
  if (game_settings.value.bot_country) {
    game_settings.value.bot_country.forEach((id) => colorCountry(id, 'bot'))
  }

  startGameTimer(10)

  updateScoresFromServer()
  setInterval(updateScoresFromServer, 1500)
})

// Clear the interval on component unmount to prevent errors
onUnmounted(() => {
  clearInterval(game_interval)
})

// Function to download the latest scores from the server
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
