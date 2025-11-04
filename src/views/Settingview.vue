<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// všetko uložené v jednom objekte
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
  <div class="header">
    <div class="titles">
      <h1>Ultimate Country Quiz</h1>
    </div>

    <router-link to="../category" class="back-link">← Back</router-link>
  </div>
  <div class="settings-page">
    <!-- QUIZ SETS -->
    <div class="block">
      <h2>Quiz sets</h2>

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

    <!-- DIFFICULTY -->
    <div class="block">
      <h2>Difficulty</h2>

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
</template>

<style>
.settings-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6vw;
  color: white;
  font-family: sans-serif;
}

/* Panels */
.block {
  background: rgba(0, 0, 0, 0.4);
  width: 22vw;
  height: 80vh;
  padding: 3vh 2vw;
  border-radius: 2vw;
  text-align: center;
  backdrop-filter: blur(0.5vw);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.block h2 {
  font-size: 2rem;
  margin-bottom: 2vh;
}

/* Rows */
.row {
  display: flex;
  align-items: center;
  gap: 1vw;
  margin: 2vh 0;
  cursor: pointer;
}

.label {
  font-size: 1.4rem;
  flex-grow: 1;
  text-align: left;
}

/* Image placeholders */
.circle-img,
.square-img {
  width: 6vw;
  height: 6vw;
  background: gray;
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
.slider-group {
  text-align: center;
  margin: 3vh 0;
}

.slider-group label {
  font-size: 1.4rem;
  display: block;
}

.slider-group input {
  width: 100%;
  margin-top: 1vh;
}

.slider-group .value {
  font-size: 1.2rem;
  margin-top: 0.5vh;
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
