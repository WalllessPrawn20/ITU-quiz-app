<!----------------------------->
<!-- Author: Lukas Choleva ---->
<!-- Login: xcholel00 --------->
<!-- Date: 8.12.2025 ---------->
<!----------------------------->

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sfxManager } from '../utils/SfxManager'

const router = useRouter()

// default values for settings
const defaultSettings = {
  region: 'europe',
  sets: {
    History: true,
    Society: true,
    Geography: true,
    Sport: false,
  },
  difficulty: 'Medium',
  timer: 15,
  rounds: 25,
}

const settings = ref({ ...defaultSettings })
const showHelp = ref(false) 

// loads saved settings if they exist
onMounted(() => {
  const saved = localStorage.getItem('gameSettings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }

  const savedRegion = localStorage.getItem('region')
  if (savedRegion) {
    settings.value.region = savedRegion
  }
})

// play click sound if sfx enabled
function Click() {
  sfxManager.playClick()
}

//watches changes to settings and stores them
watch(
  settings,
  (newVal) => { localStorage.setItem('gameSettings', JSON.stringify(newVal)) },
  { deep: true },
)

//start the quiz
async function playQuiz() {
  localStorage.setItem('gameSettings', JSON.stringify(settings.value))

  //sends settings to server(backend) to start the game
  const response = await fetch('http://localhost:5000/game/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' },
    body: JSON.stringify({
      continent: settings.value.region,
      categories: settings.value.sets,
      difficulty: settings.value.difficulty,
      timer: settings.value.timer,
      turns: settings.value.rounds
    })
  })

  //response from server
  const data = await response.json()

  if (!data.success) {
    console.error('Server odmietol nastavenia:', data)
    return
  }

  //navigates to game view
  router.push('/game')
}

//helper function to get image source based on name
function getImgSrc(key) {
  return new URL(`../assets/${key.toLowerCase()}.png`, import.meta.url).href
}

//helper function that toggles quiz sets (at least one must be set)
function toggleSet(key) {
  const activeCount = Object.values(settings.value.sets).filter(Boolean).length

  //doesnt allow to disable last active set
  if (activeCount === 1 && settings.value.sets[key]) {
    return
  }

  settings.value.sets[key]= !settings.value.sets[key]
}
</script>

<template>
  <div class="settings-wrapper-settings">
    <div class="header-category">
      <div class="titles">
        <router-link to="/" class="back-link">
          <h1 class="tomenu">World Conquest</h1>
        </router-link>
        <h2>Choose settings for your game:</h2>
      </div>

      <div class="header-buttons">
        <button class="header-btn" @click="showHelp = true">?</button>
        <router-link to="/stats">
          <button class="header-btn" aria-label="Statistics">
            <img src="../assets/stats3.png" alt="Statistics" />
          </button>
        </router-link>
        <router-link to="/settings">
          <button class="header-btn" aria-label="Settings">
            <img src="../assets/settings2.png" alt="Settings" />
          </button>
        </router-link>
      </div>
    </div>

    <div class="settings-page">
      <div class="block">
        <h2>Quiz sets</h2>
        <div class="block-content">
          <!-- cycle thourgh all sets -->
          <div class="row" v-for="(value, key) in settings.sets" :key="key" @click="toggleSet(key)">
            <div class="circle-img">
              <img :src="getImgSrc(key)" :alt="key" />
            </div>
            <span class="label">{{ key }}</span>
            <div class="checkbox" :class="{ active: settings.sets[key] }"></div>
          </div>
        </div>
      </div>

      <div class="block">
        <h2>Difficulty</h2>
        <div class="difficulty-rows">
          <!-- cycle through difficulties -->
          <div
            class="row diff"
            v-for="level in ['Easy', 'Medium', 'Hard']"
            :key="level"
            @click="settings.difficulty = level"
          >
            <div class="square-img"><img :src="getImgSrc(level)" :alt="level" /></div>
            <span class="label">{{ level }}</span>
            <div class="checkbox" :class="{ active: settings.difficulty === level }"></div>
          </div>
        </div>
      </div>

      <div class="block">
        <h2>Additional</h2>
        <div class="block-content">
          <div class="slider-group">
            <label>Timer</label>
            <input type="range" min="5" max="25" v-model="settings.timer" />
            <span class="value">{{ settings.timer }}s</span>
          </div>

          <div class="slider-group">
            <label>Turns</label>
            <input type="range" min="1" max="50" v-model="settings.rounds" />
            <span class="value">{{ settings.rounds }}</span>
          </div>

          <div class="action-buttons">
            <!-- user can create custom abcd questions -->
            <div class="custom-section">
              <p class="custom-label">Create question</p>
              <button class="custom-btn" @click="router.push('/custom')">+</button>
            </div>

            <button class="play-btn" @click="playQuiz(); Click()">
              <img src="../assets/play.png" alt="Play" class="play-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
  <div class="modal-content">
    <h2>How to Play</h2>
    <p>
      Welcome to World Conquest!<br />
      - Choose your quiz sets (at least one must be active).<br />
      - Select difficulty, timer, and number of rounds.<br />
      - Click "Play" to start the game.<br />
      - During the quiz, click on the country on the map and anser it's question.<br />
      - You are fighting against a bot.<br />
      - Have fun and try to conquer the world!
    </p>
    <button class="close-btn" @click="showHelp = false">Close</button>
  </div>
</div>
</template>

<style>

  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #222;
  padding: 2rem;
  border-radius: 1rem;
  width: 80%;
  max-width: 600px;
  font-family: 'Press Start 2P', monospace;
  color: white;
  text-align: center;
  position: relative;
    border: 3px solid #00cc66;
  border-radius: 10px;
  box-shadow: 0 0 20px #00cc66;
}

.close-btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
}


.settings-wrapper-settings {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Press Start 2P', monospace;
  color: white;
  margin: 0;
  padding: 0;
}

.settings-wrapper-settings::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/home.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5;
  z-index: -1;
}

.header-category {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95vw;
  margin: 2rem;
}

.titles h1 {
  font-size: 4rem;
  margin: 0;
}

.titles h2 {
  font-size: 1.8rem;
  margin: 0.5rem 0 0 0;
}

.back-link {
  color: white;
  text-decoration: none;
}

.header-buttons {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.header-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Press Start 2P', monospace;
  font-size: 5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: 0.2s all;
}

.header-btn img {
  object-fit: contain;
  margin-bottom: 0.3rem;
}

.header-btn:hover {
  color: #ccc;
  transform: scale(1.1);
}

.settings-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4vw;
  width: 100%;
  flex-wrap: wrap;
}

.block {
  background: rgba(0, 0, 0, 0.7);
  width: 22vw;
  padding: 2rem;
  border-radius: 2vw;
  text-align: center;
  backdrop-filter: blur(0.5vw);
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
}

.block h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  flex-shrink: 0;
}
.categories {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  gap: 1rem;
  width: 100%;
}

.slider-group, .play-btn {
  margin-top: 0;
}

.block.additional {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  width: 100%;
  cursor: pointer;
}

.difficulty-rows {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.label {
  font-size: 1.4rem;
  flex-grow: 1;
  text-align: center;
}

.circle-img,
.square-img {
  background: gray;
}

.circle-img {
  border-radius: 50%;
  width: 6vw;
  height: 6vw;
}

.square-img {
  border-radius: 1vw;
  width: 6vw;
  height: 6vw;
}

.checkbox {
  width: 2vw;
  height: 2vw;
  border: 0.3vw solid white;
  border-radius: 0.5vw;
}

.checkbox.active {
  position: relative;
  background: none;
}

.checkbox.active::before, .checkbox.active::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2vw;
  height: 0.35vw;
  background: white;
  transform-origin: center;
}

.checkbox.active::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.checkbox.active::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1vh;
}

input[type='range'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 1.2vw;
  background: black;
  border: 0.4vw solid white;
  image-rendering: pixelated;
}

input[type='range']::-moz-range-track {
  height: 1.2vw;
  background: black;
  border: 0.4vw solid white;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
  margin-top: -0.5vw;
}

input[type='range']::-moz-range-thumb {
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
}

input[type='range']::-webkit-slider-thumb:hover, input[type='range']::-moz-range-thumb:hover {
  background: yellow;
}

.slider-group .value {
  font-size: 1.2rem;
}

.play-btn {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.08);
}

.play-icon {
  width: 10vw;
  height: 10vw;
  object-fit: contain;
  display: block;
}

.block-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
}
.circle-img {
  border-radius: 50%;
  width: 6vw;
  height: 6vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 0.2vw solid white;
  transition:
    transform 0.2s,
    background 0.2s;
}
.square-img img {
  background: rgba(255, 255, 255, 0.1);
  border: 0.2vw solid white;
  transition:
    transform 0.2s,
    background 0.2s;
}

.circle-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.square-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.row:hover .circle-img {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}
.row:hover .square-img {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.row:hover .label {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  width: 100%;
  margin-top: 2vh;
}

.custom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
}

.custom-label {
  font-size: 1.75rem;
  color: white;
  text-align: center;
  margin: 1rem;
}

.custom-btn {
  width: 4vw;
  height: 4vw;
  border: 0.3vw solid white;
  background: transparent;
  color: white;
  font-size: 2rem;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  transition:
    transform 0.2s,
    background 0.2s;
}

.custom-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}
.circle-img, .square-img, .checkbox {
  flex-shrink: 0;
}

.label {
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  font-size: clamp(0.8rem, 1.2vw, 1.4rem);
  white-space: nowrap;
}
/* .tomenu{
  text-decoration: underline;
} */
</style>
