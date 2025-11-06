<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const settings = ref({
  region: 'europe',
  sets: {
    History: false,
    Society: false,
    Geography: true,
    Sport: false,
  },
  difficulty: 'Medium',
  timer: 15,
  rounds: 25,
})

function playQuiz() {
  localStorage.setItem('gameSettings', JSON.stringify(settings.value))
  router.push('/game')
}
</script>

<template>
  <div class="settings-wrapper-settings">
    <!-- HEADER -->
    <div class="header-category">
      <div class="titles">
        <router-link to="/" class="back-link">
          <h1>World Conquest</h1>
        </router-link>
        <h2>Choose settings for your game:</h2>
      </div>

      <div class="header-buttons">
        <router-link to="/stats">
          <button class="header-btn" aria-label="Statistics">
            <img src="../assets/stats3.png" alt="Statistics"/>
          </button>
        </router-link>
        <router-link to="/settings">
          <button class="header-btn" aria-label="Settings">
            <img src="../assets/settings2.png" alt="Settings"/>
          </button>
        </router-link>
      </div>
    </div>

    <!-- SETTINGS CONTENT -->
    <div class="settings-page">
      <!-- QUIZ SETS -->
      <div class="block">
        <h2>Quiz sets</h2>
        <div class="block-content">
          <div
            class="row"
            v-for="(value, key) in settings.sets"
            :key="key"
            @click="settings.sets[key] = !settings.sets[key]"
          >
            <div class="circle-img"></div>
            <span class="label">{{ key }}</span>
            <div class="checkbox" :class="{ active: settings.sets[key] }"></div>
          </div>
        </div>
      </div>

      <!-- DIFFICULTY -->
      <div class="block">
        <h2>Difficulty</h2>
        <div class="difficulty-rows">
          <div
            class="row diff"
            v-for="level in ['Easy', 'Medium', 'Hard']"
            :key="level"
            @click="settings.difficulty = level"
          >
            <div class="square-img"></div>
            <span class="label">{{ level }}</span>
            <div class="checkbox" :class="{ active: settings.difficulty === level }"></div>
          </div>
        </div>
      </div>

      <!-- ADDITIONAL -->
<!-- ADDITIONAL -->
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

<button class="play-btn" @click="playQuiz">
  <img src="../assets/play.png" alt="Play" class="play-icon"/>
</button>
  </div>
</div>

    </div>
  </div>
</template>

<style>
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
  content: "";
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

/* HEADER - rovnaký ako region selection */
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
  font-size: 3rem;
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

/* SETTINGS PAGE */
.settings-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4vw;
  width: 100%;
  flex-wrap: wrap;
}

/* Blocks */
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
/* Pre categories v settings (rovnaké ako difficulty) */
.categories {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* rozložené vertikálne */
  flex-grow: 1;
  gap: 1rem;
  width: 100%;
}

/* Pre additional sliders + play button */
.slider-group,
.play-btn {
  margin-top: 0;
}

/* Celý additional block */
.block.additional {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
}

/* Rows / sliders / play button - zachované */
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
  background: white;
}

.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1vh;
}

input[type="range"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 1.2vw;
  background: black;
  border: 0.4vw solid white;
  image-rendering: pixelated;
}

input[type="range"]::-moz-range-track {
  height: 1.2vw;
  background: black;
  border: 0.4vw solid white;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
  margin-top: -0.5vw;
}

input[type="range"]::-moz-range-thumb {
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
}

input[type="range"]::-webkit-slider-thumb:hover,
input[type="range"]::-moz-range-thumb:hover {
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
  width: 10vw;        /* nastav veľkosť podľa bloku */
  height: 10vw;
  object-fit: contain; /* zachová proporcie obrázka */
  display: block;
}


/* Spoločný obsah blokov */
.block-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* rovnomerné rozloženie riadkov/sliders/tlačidla */
  flex-grow: 1;
  width: 100%;
}

</style>
