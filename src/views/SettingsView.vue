<!----------------------------->
<!-- Author: Matej Melchiory -->
<!-- Login: xmelchm00 --------->
<!-- Date: 3.12.2025 ---------->
<!----------------------------->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { audioManager } from '../utils/AudioManager'

const router = useRouter()
const music = ref(true)
const sfx = ref(true)
const currentTrack = ref('synthwave')

//showing credits ,,window,,
const showCredits = ref(false)

function openCredits() {
  showCredits.value = true
}

function closeCredits() {
  showCredits.value = false
}

// Going back to the previous page
function goBack() {
  router.back()
}

// Toggle music on/off
function toggleMusic() {
  music.value = !music.value
  audioManager.toggle()
  sessionStorage.setItem('music', music.value) // uložiť stav hudby
}

// Change the current track
function changeTrack(trackName) {
  currentTrack.value = trackName
  audioManager.switchTrack(trackName)
  sessionStorage.setItem('track', trackName) // uložiť zvolenú pesničku
}

// Load settings about sound from sessionStorage on loading
onMounted(() => {
  const storedMusic = sessionStorage.getItem('music')
  if (storedMusic !== null) {
    music.value = storedMusic === 'true'
    if (!music.value && audioManager.isPlaying()) audioManager.toggle()
  }

  const storedTrack = sessionStorage.getItem('track')
  if (storedTrack && storedTrack !== currentTrack.value) {
    currentTrack.value = storedTrack
    audioManager.switchTrack(storedTrack) // prepni len ak je iná
  }
})
</script>

<template>
  <div class="menu-screen">
    <!--  Button for going back -->
    <button class="close-btn" @click="goBack">✖</button>

    <div class="menu-content">
      <h1 class="title">WORLD<br />CONQUEST</h1>

      <!-- A menu with all settings available -->
      <div class="settings-box">
        <div class="setting-item">
          <span>MUSIC:</span>
          <div class="pixel-checkbox" @click="toggleMusic" :class="{ active: music }"></div>
        </div>

        <div class="setting-item">
          <span>TRACK:</span>
          <select v-model="currentTrack" @change="changeTrack(currentTrack)">
            <option value="synthwave">Synthwave</option>
            <option value="chill">Chill</option>
            <option value="retro">Retro</option>
          </select>
        </div>

        <div class="setting-item">
          <span>SFX:</span>
          <div class="pixel-checkbox" @click="sfx = !sfx" :class="{ active: sfx }"></div>
        </div>

        <button class="credits-btn" @click="openCredits">CREDITS</button>
      </div>
    </div>
  </div>
  <div v-if="showCredits" class="credits-overlay">
    <div class="credits-window">
      <button class="credits-close" @click="closeCredits">✖</button>

      <h2>CREDITS</h2>
      <p>Author: Lukas Choleva</p>
      <p>Author: Matej Melchiory</p>
      <p>Date: 12.12.2025</p>
    </div>
  </div>
</template>

<style scoped>
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

.menu-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../assets/home.png');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  z-index: -1;
}

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

.menu-content {
  padding: 3rem 5rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.75);
  border: 6px solid white;
  image-rendering: pixelated;
  box-shadow: 0 0 0 6px black;
}

.title {
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 3rem;
  text-shadow: 4px 4px black;
}

.settings-box {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
.credits-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.credits-window {
  background: rgba(0, 0, 0, 0.9);
  border: 6px solid white;
  padding: 2rem 3rem;
  text-align: left;
  font-family: 'Press Start 2P', monospace;
  color: white;
  box-shadow: 0 0 0 6px black;
  position: relative;
}

.credits-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 32px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.credits-window h2 {
  margin-bottom: 1.5rem;
}

.credits-window p {
  margin: 0.5rem 0;
  margin-left: 0.5rem;

}

</style>
