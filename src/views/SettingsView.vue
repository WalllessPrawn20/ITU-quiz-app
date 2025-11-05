<template>
  <div class="menu-screen">
    <button class="close-btn" @click="goBack">✖</button>

    <div class="menu-content">
      <h1 class="title">WORLD<br />CONQUEST</h1>

      <div class="settings-box">
        <div class="setting-item">
          <span>MUSIC:</span>
          <div class="pixel-checkbox" @click="music = !music" :class="{ active: music }"></div>
        </div>

        <div class="setting-item">
          <span>SFX:</span>
          <div class="pixel-checkbox" @click="sfx = !sfx" :class="{ active: sfx }"></div>
        </div>

        <button class="credits-btn">CREDITS</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const music = ref(true)
const sfx = ref(true)

function goBack() {
  router.back()
}
</script>

<style scoped>
/* SCREEN CONTAINER */
.menu-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Press Start 2P', monospace;
  color: white;
}

/* BACKGROUND */
.menu-screen::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('../assets/home.png');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  z-index: -1;
}

/* CLOSE BUTTON */
.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 64px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

/* MAIN CONTENT BOX */
.menu-content {
  padding: 3rem 5rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.75);
  border: 6px solid white;
  image-rendering: pixelated;
  box-shadow: 0 0 0 6px black;
}

/* TITLE */
.title {
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 3rem;
  text-shadow: 4px 4px black;
}

/* SETTINGS LIST */
.settings-box {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 24px;
}

/* EACH ROW */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* PIXEL CHECKBOX */
.pixel-checkbox {
  width: 36px;
  height: 36px;
  border: 4px solid white;
  background: black;
  cursor: pointer;
  image-rendering: pixelated;
}

.pixel-checkbox.active {
  background: white;
}

/* CREDITS BUTTON */
.credits-btn {
  font-size: 22px;
  padding: 1rem 3rem;
  border: 4px solid white;
  background: black;
    font-family: 'Press Start 2P', monospace;
  color: white;
  cursor: pointer;
  transition: 0.15s;
  image-rendering: pixelated;
}

.credits-btn:hover {
  background: white;
  color: black;
  transform: scale(1.05);
}
</style>
