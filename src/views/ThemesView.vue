<template>
  <div class="game-settings">
    <div class="top-bar">
      <h2>GAME SETTINGS: {{ selectedRegion }}</h2>
    </div>

    <div class="settings-content">
      <div class="panels">
        <!-- LEFT PANEL: THEMES -->
        <div class="themes-panel">
          <h3>Themes</h3>
          <div v-for="theme in themes" :key="theme.name" class="theme-item">
            <div class="theme-image">
              <img :src="theme.image" :alt="theme.name" />
            </div>
            <label class="theme-label">
              <input type="checkbox" v-model="theme.selected" />
              {{ theme.name }}
            </label>
          </div>
        </div>

        <!-- RIGHT PANEL: OTHERS -->
        <div class="others-panel">
          <h3>Others</h3>

          <div class="setting-group">
            <p>Timer (seconds)</p>
            <input type="range" min="10" max="30" v-model="timer" />
            <p>{{ timer }}s</p>
          </div>

          <div class="setting-group">
            <p>Number of Players</p>
            <div class="button-group">
              <button
                v-for="n in 4"
                :key="'player-' + n"
                :class="{ active: players === n }"
                @click="players = n"
              >
                {{ n }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <p>Number of Rounds</p>
            <div class="button-group">
              <button
                v-for="n in 4"
                :key="'round-' + n"
                :class="{ active: rounds === n }"
                @click="rounds = n"
              >
                {{ n }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="ready-btn" @click="startGame">READY</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const selectedRegion = ref(route.query.region || 'Unknown')

// Themes
const themes = ref([
  { name: 'Medieval', image: '/images/theme1.jpg', selected: false },
  { name: 'Modern', image: '/images/theme2.jpg', selected: false },
  { name: 'Fantasy', image: '/images/theme3.jpg', selected: false },
  { name: 'Sci-Fi', image: '/images/theme4.jpg', selected: false },
])

// Timer
const timer = ref(20)

// Players and rounds
const players = ref(2)
const rounds = ref(3)

// Watch for route changes
watch(
  () => route.query.region,
  (newVal) => {
    selectedRegion.value = newVal || 'Unknown'
  },
)

// READY button logic
function startGame() {
  const gameSettings = {
    region: selectedRegion.value,
    themes: themes.value.filter((t) => t.selected).map((t) => t.name),
    timer: timer.value,
    players: players.value,
    rounds: rounds.value,
  }

  // Uloženie do localStorage
  localStorage.setItem('gameSettings', JSON.stringify(gameSettings))

  // Presmerovanie na herný view
  router.push('/game')
}
</script>

<style scoped>
.game-settings {
  font-family: 'Press Start 2P', monospace;
  color: white;
  background-image: url('@/assets/europe_back.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-bar {
  margin-bottom: 2rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  flex: 1;
}

.panels {
  display: flex;
  gap: 2rem;
  flex: 1;
}

/* LEFT PANEL */
.themes-panel {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 10px;
}

.theme-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.theme-image {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  overflow: hidden;
  border-radius: 5px;
  background: #333;
}

.theme-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* RIGHT PANEL */
.others-panel {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 10px;
}

.setting-group {
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.button-group button {
  padding: 0.5rem 1rem;
  background: #222;
  color: white;
  border: 2px solid #555;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'Press Start 2P', monospace;
}

.button-group button.active {
  background: #ffcc00;
  color: black;
  border-color: #ffcc00;
}

/* READY BUTTON */
.ready-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #00cc66;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  font-size: 1rem;
  transition: background 0.2s;
}

.ready-btn:hover {
  background: #00ff88;
}
</style>
