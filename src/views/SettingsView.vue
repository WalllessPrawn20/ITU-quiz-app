<template>
  <div class="menu-screen">
    <button class="close-btn" @click="goBack">✖</button>

    <div class="menu-content">
      <h1 class="title">Europe<br />Conquest</h1>

      <div class="settings-box">
        <div class="setting-item">
          <span>MUSIC:</span>
          <input type="checkbox" />
        </div>
        <div class="setting-item">
          <span>SFX:</span>
          <input type="checkbox" />
        </div>
        <button class="credits-btn">CREDITS</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.push('/')
}
</script>

<style scoped>
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
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
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

.settings-box {
  background-color: rgba(100, 100, 100, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 18px;
  margin-bottom: 1rem;
  color: white;
}

.credits-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
}

.credits-btn:hover {
  background-color: white;
}
</style>
