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
<div class="header">
    <div class="titles">
      <router-link to="/" class="back-link">
      <h1>World Conquest</h1>
    </router-link>
      <h2>Choose settings for your game:</h2>
    </div>

    <router-link to="/settings">
      <button class="settings" aria-label="Settings">
        ⚙️
      </button>
    </router-link>
  </div>
    <!-- Panely s nastaveniami -->
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
      <div class="block">
        <h2>Additional</h2>
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

        <button class="play-btn" @click="playQuiz">▶</button>
      </div>
    </div>
  </div>
</template>

<style>
.settings-wrapper-settings {
  position: relative; /* dôležité pre pseudo-element */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Press Start 2P', monospace;
  color: white;
  margin:0;
  padding:0;
  /* odstránime opacity odtiaľto */
}

.settings-wrapper-settings::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/home.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5; /* iba pozadie je priehľadné */
  z-index: -1; /* aby bolo pod obsahom */
}
.settings-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  font-family: 'Press Start 2P', monospace;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95vw;
  margin: 2rem; /* top, bottom, horizontálne centrovanie */
}

.back-link {
  text-decoration: none;
  color: inherit;
}

/* Panely */
.settings-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4vw;
  width: 100%;
  flex-wrap: wrap;
}

/* Každý block */
/* Každý block */
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

  /* Vertikálne rozloženie */
  justify-content: flex-start;
  align-items: center;

  gap: 1.5rem;
  /* pridať vnútorný flex pre riadky */
  position: relative;
}

/* H2 všetkých blokov bude hore, rovnaká výška */
.block h2 {
  font-size: 2rem;
  margin-bottom: 2rem; /* väčší margin, aby bol priestor pod h2 rovnaký */
  flex-shrink: 0;
}

/* Obsah blokov (riadky + sliders + tlačidlo) */
.block-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* rovnomerné rozloženie */
  flex-grow: 1;
  width: 100%;
}

/* Rows */
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  cursor: pointer;
  width: 100%;
}
/* Zabalené riadky difficulty */
.difficulty-rows {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.row.diff {
  margin-top: 0;
}
.label {
  font-size: 1.4rem;
  flex-grow: 1;
  text-align: center;
}

/* Image placeholders */
.circle-img,
.square-img {
  width: 6vw;
  height: 6vw;
  background: gray;
}

.circle-img {
  border-radius: 50%;
}

.square-img {
  border-radius: 1vw;
}

/* Checkbox */
.checkbox {
  width: 2vw;
  height: 2vw;
  border: 0.3vw solid white;
  border-radius: 0.5vw;
}

.checkbox.active {
  background: white;
}

/* Sliders */
/* === RETRO PIXEL SLIDER === */
.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1vh;
}

.slider-group label {
  font-size: 1.2rem;
}

/* Base slider */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
}

/* Track (dráha) */
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

/* Thumb (jazdec) */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
  image-rendering: pixelated;
  margin-top: -0.5vw; /* centrovanie */
}

input[type="range"]::-moz-range-thumb {
  width: 2vw;
  height: 2vw;
  background: white;
  border: 0.4vw solid black;
}

/* Hover efekt – old school “bright” */
input[type="range"]::-webkit-slider-thumb:hover {
  background: yellow;
}

input[type="range"]::-moz-range-thumb:hover {
  background: yellow;
}

/* Value text */
.slider-group .value {
  font-size: 1.2rem;
}


/* Play Button */
.play-btn {
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  font-size: 3rem;
  cursor: pointer;
  transition: 0.2s;
  align-self: center;
}

.play-btn:hover {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.6);
}
</style>
