<!----------------------------->
<!-- Author: Matej Melchiory -->
<!-- Login: xmelchm00 --------->
<!-- Date: 9.12.2025 ---------->
<!----------------------------->

<template>
  <div class="game-over-overlay">
    <div class="game-over-card">
      <!-- Overview of the final results -->
      <h2>
        <span v-if="scores.you > scores.bot">You Win!👍</span>
        <span v-else-if="scores.you < scores.bot">You Lost!👎</span>
        <span v-else>It's a tie!</span>
      </h2>
      
      <p>You finished all {{ totalRounds }} turns!</p>
      <!-- Final score -->
      <div class="score">
        <p><strong>You:</strong> {{ scores.you }}</p>
        <p><strong>Enemy:</strong> {{ scores.bot }}</p>
      </div>

      <div class="message">
        <p v-if="scores.you > scores.bot">You conquered Europe!</p>
        <p v-else-if="scores.you === scores.bot">It's a draw - Europe remains divided!</p>
        <p v-else>Better luck next time, commander.</p>
      </div>
      <!-- Buttons to continue in the app -->
      <div class="buttons">
        <button @click="restartGame">Restart</button>
        <button @click="exitGame">Exit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Defining props for scores and total rounds
const props = defineProps({
  scores: Object,
  totalRounds: Number,
})

const router = useRouter()

// Function to restart the game
function restartGame() {
  window.location.reload()
  fetch('http://localhost:5000/game/reset', {
    method: 'POST',
  })
}

// Function to exit the game and go back to home page
function exitGame() {
  router.push('/')
}
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Press Start 2P', monospace;
  z-index: 9999;
}

.game-over-card {
  background: rgba(40, 40, 40, 0.95);
  padding: 2rem;
  border: 3px solid #00cc66;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 20px #00cc66;
}

.score {
  margin: 1.5rem 0;
  font-size: 1.2rem;
}

.message {
  margin: 1rem 0;
  font-size: 1rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  background: #00cc66;
  border: 2px solid #008844;
  color: black;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
}

button:hover {
  background: #00ff88;
}
</style>
