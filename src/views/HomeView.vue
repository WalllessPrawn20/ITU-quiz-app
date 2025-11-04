<template>
  <div class="menu-screen">
    <div class="top-right">
      <button class="settings-btn" @click="goToSettings">⚙️</button>
    </div>

    <div class="menu-content">
      <h1 class="title">Europe<br />Conquest</h1>
      <button class="play-btn" @click="startGame">PLAY</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function startGame() {
  router.push('/choose-region') // neskôr zmeníš na router.push('/game')
}

function goToSettings() {
  router.push('/settings')
}
</script>

<style>
.menu-screen {
  background-image: url('@/assets/europe_back.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
}

.top-right {
  position: absolute;
  top: 10px;
  right: 15px;
}

.settings-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

.menu-content {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 2rem 4rem;
  border-radius: 8px;
  text-align: center;
}

.title {
  font-family: 'Press Start 2P', monospace;
  font-size: 32px;
  text-align: center;
  margin-bottom: 2rem;
}

.play-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
}

.play-btn:hover {
  background-color: white;
}
</style>
