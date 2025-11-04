<template>
  <div class="choose-region">
    <div class="top-bar">
      <button class="stats-btn" @click="goToStats">📊</button>
      <button class="settings-btn" @click="goToSettings">⚙️</button>
    </div>

    <h1>CHOOSE THE REGION:</h1>

    <div class="regions">
      <div
        v-for="region in regions"
        :key="region.name"
        class="region-card"
        @click="selectRegion(region)"
      >
        <img :src="region.image" :alt="region.name" />
        <p>{{ region.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const regions = [
  { name: 'Whole World', image: '/images/world.jpg' },
  { name: 'Europe', image: '/images/europe.jpg' },
  { name: 'Asia', image: '/images/asia.jpg' },
  { name: 'America', image: '/images/america.jpg' },
  { name: 'Australia and Oceania', image: '/images/australia.jpg' },
  { name: 'Africa', image: '/images/africa.jpg' },
]

function goToSettings() {
  router.push('/settings')
}

function goToStats() {
  router.push('/stats')
}

function selectRegion(region) {
  // Presun na stránku nastavení hry + odoslanie názvu regiónu
  router.push({ name: 'themes', query: { region: region.name } })
}
</script>

<style scoped>
.choose-region {
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  color: white;
  background-image: url('@/assets/europe_back.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  padding-top: 40px;
  position: relative;
}

.top-bar {
  position: absolute;
  top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}

.stats-btn,
.settings-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  transition:
    transform 0.2s,
    color 0.2s;
}

.stats-btn:hover,
.settings-btn:hover {
  transform: scale(1.2);
  color: #ffea00;
}

.regions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-content: center;
  max-width: 1000px;
  margin: 80px auto;
}

.region-card {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.region-card:hover {
  transform: scale(1.05);
}

.region-card img {
  width: 100%;
  border-radius: 8px;
}
</style>
