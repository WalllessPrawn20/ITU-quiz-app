<template>
  <div class="homepage">
    <router-link to="/settings">
      <button class="header-btn settings" aria-label="Settings">
        <img src="../assets/settings2.png" alt="Settings" />
      </button>
    </router-link>

    <h1 class="title">World Conquest</h1>

    <input
      type="text"
      v-model="username"
      placeholder="Enter your username"
      class="username-input"
    />

    <router-link :to="username ? '/category' : '#'" custom v-slot="{ navigate }">
      <button
        class="start"
        aria-label="Start quiz"
        :disabled="!username"
        @click="username && navigate()"
      >
        <img src="../assets/play.png" alt="Play" class="play-icon" />
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
</script>

<style>
.username-input {
  margin: 1rem 0 2rem 0;
  padding: 0.8rem 1rem;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', monospace;
  border: 2px solid #00ff88;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  outline: none;
  width: 500px;
  max-width: 80%;
  transition: 0.2s all;
}

.username-input::placeholder {
  color: #ccc;
}

.username-input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 10px #ffcc00;
}

.homepage {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Press Start 2P', monospace;
  background-image: url('../assets/home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  text-align: center;
  position: relative;
}

.settings {
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 3rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  transition: 0.2s all;
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings:hover {
  color: #ccc;
  transform: scale(1.1);
}

.settings:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
}

.title {
  font-size: 6rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  border-radius: 12px;
}

.start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.start .play-icon {
  width: 120px;
  height: 120px;
  object-fit: contain;
  display: block;
}

.start:focus {
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.25);
}

.start:hover {
  transform: scale(1.06);
}
</style>
