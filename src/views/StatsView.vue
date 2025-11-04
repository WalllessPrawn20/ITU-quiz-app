<template>
  <div class="stats-overlay">
    <div class="stats-card">
      <button class="close-btn" @click="closeStats">✕</button>
      <h2 class="stats-title">Stats</h2>

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
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = [
  { name: 'Whole world', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Europe', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Asia', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'America', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Australia', correct: 0, incorrect: 0, successRate: '-' },
  { name: 'Africa', correct: 0, incorrect: 0, successRate: '-' },
]

function closeStats() {
  router.back() // alebo router.push('/') ak chceš ísť na hlavnú obrazovku
}
</script>

<style scoped>
.stats-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.stats-card {
  position: relative;
  background: rgba(220, 220, 220, 0.9);
  border: 4px solid #555;
  border-radius: 8px;
  padding: 1rem 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 600px;
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  color: black;
}

.stats-title {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: black;
  font-size: 1.5rem;
  cursor: pointer;
}

.stats-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.stats-table th {
  font-size: 0.7rem;
  font-weight: bold;
}

.stats-table td {
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #777;
  border-radius: 4px;
  padding: 0.5rem 0;
  font-size: 0.8rem;
}
</style>
