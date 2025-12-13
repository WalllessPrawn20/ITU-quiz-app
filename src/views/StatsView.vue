<!----------------------------->
<!-- Author: Lukas Choleva  --->
<!-- Login: xcholel00 --------->
<!-- Date: 8.12.2025 ---------->
<!----------------------------->

<template>
  <div class="stats-overlay">
    <!-- The whole stats info card -->
    <div class="stats-card">
      <button class="close-btn" @click="closeStats && Click()">✖</button>
      <button class="reset-btn" @click="resetStats && Click()">RST</button>
      <h1 class="stats-title">STATS</h1>

      <!-- All statistics headings -->
      <table class="stats-table">
        <thead>
          <tr>
            <th>continent</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th>Success rate</th>
          </tr>
        </thead>

        <!-- Stats from the server -->
        <tbody>
          <tr v-for="(stat, index) in stats" :key="index">
            <td>{{ stat.name }}</td>
            <td>{{ stat.correct }}</td>
            <td>{{ stat.incorrect }}</td>
            <td>{{ stat.successRate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sfxManager } from '../utils/SfxManager'

const router = useRouter()

// Statistics data to be downloaded from the server
const stats = ref([
  { name: 'Whole world', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Europe', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Asia', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'America', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Australia', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Africa', correct: 0, incorrect: 0, successRate: '-' },
])

function closeStats() {
  router.back()
}

// play click sound if sfx enabled
function Click() {
  if (sfx.value) sfxManager.playClick()
}

// Calculate success rate as a percentage
function calcRate(correct, incorrect) {
  const total= correct + incorrect
  if (total === 0) return '-'
  return `${Math.round((correct / total) * 100)}%`
}

// Fetch all statistics from the server
async function fetchStats() {
  try {
    const res = await fetch('http://localhost:5000/stats')
    if (!res.ok) throw new Error('Failed to fetch stats')
    const data =await res.json()

    // Changing the format for the stats display
    stats.value = stats.value.map((s) => {
      const continent = s.name
      if (data[continent]) {
        const correct = data[continent].correct
        const incorrect= data[continent].wrong
        return {
          ...s,
          correct,
          incorrect,
          successRate: calcRate(correct, incorrect),}
      }
      return s
    })
  } catch (err) {
    console.error('Error loading stats:', err)
  }
}

// Reset all statistics on the server
async function resetStats() {
  try {
    const res = await fetch('http://localhost:5000/stats/reset', { method: 'POST' })
    if (!res.ok) throw new Error('Failed to reset stats')

    // Load the fresh stats after resetting
    await fetchStats()
  } catch (err) {
    console.error('Error resetting stats:', err)
  }
}

// Load stats on component load
onMounted(() =>{
  fetchStats()
})
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 1vh;
  right: 1.5vw;
  width: 4vw;
  height: 4vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  border: 0.5vw solid white;
  background: black;
  color: white;
  cursor: pointer;
  box-shadow: 0 0 0 0.5vw black;
  transition: 0.15s;
}

.close-btn:hover {
  background: white;
  color: black;
}

.stats-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Press Start 2P', monospace;
  color: white;
  overflow: hidden;
}

.stats-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../assets/home.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: 0.5;
  z-index: -1;
}

.stats-card {
  position: relative;
  background: rgba(0, 0, 0, 0.75);
  border: 6px solid white;
  padding: 2rem 3rem;
  width: 80vw;
  height: 80vh;
  box-shadow: 0 0 0 6px black;
  image-rendering: pixelated;
  display: flex;
  flex-direction: column;
}

.stats-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0.5rem;
  table-layout: fixed;
  font-size: 1rem;
}

.stats-table thead {
  height: 12%;
}

.stats-table tbody {
  height: 88%;
}

.stats-table tbody tr {
  height: calc(100% / 6);
}

.stats-table th, .stats-table td {
  background: black;
  border: 4px solid white;
  border-radius: 4px;
  padding: 0.6rem 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-title {
  text-align: center;
}

.reset-btn {
  position: absolute;
  top: 1vh;
  left: 1.5vw;
  width: 4vw;
  height: 4vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: 0.5vw solid white;
  background: black;
  color: white;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  image-rendering: pixelated;
  box-shadow: 0 0 0 0.5vw black;
  transition: 0.15s;
}

.reset-btn:hover {
  background: white;
  color: black;
}
</style>
