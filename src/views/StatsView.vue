<template>
  <div class="stats-overlay">
    <div class="stats-card">
      <button class="close-btn" @click="closeStats">✖</button>
      <h1 class="stats-title">STATS</h1>

      <table class="stats-table">
        <thead>
          <tr>
            <th>Continent</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th>Success rate</th>
          </tr>
        </thead>
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

const router = useRouter()

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

function calcRate(correct, incorrect) {
  const total = correct + incorrect
  if (total === 0) return '-'
  return `${Math.round((correct / total) * 100)}%`
}

async function fetchStats() {
  try {
    const res = await fetch('http://localhost:5000/stats')
    if (!res.ok) throw new Error('Failed to fetch stats')
    const data = await res.json()

    stats.value = stats.value.map((s) => {
      const cont = s.name
      if (data[cont]) {
        const correct = data[cont].correct
        const incorrect = data[cont].wrong
        return {
          ...s,
          correct,
          incorrect,
          successRate: calcRate(correct, incorrect),
        }
      }
      return s
    })
  } catch (err) {
    console.error('Error loading stats:', err)
  }
}

onMounted(() => {
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
  image-rendering: pixelated;
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
  content: "";
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

/* thead fix – nech je malý a nech ho nepohlcuje flex */
.stats-table thead {
  height: 12%; /* môžeš doladiť */
}

.stats-table tbody {
  height: 88%;
}

/* rovnomerné rozloženie riadkov v tbody */
.stats-table tbody tr {
  height: calc(100% / 6); /* 6 = počet riadkov */
}

/* cells */
.stats-table th,
.stats-table td {
  background: black;
  border: 4px solid white;
  border-radius: 4px;
  padding: 0.6rem 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


</style>
