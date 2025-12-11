<!----------------------------->
<!-- Author: Lukas Choleva ---->
<!-- Login: xcholel00 --------->
<!-- Date: 8.12.2025 ---------->
<!----------------------------->

<script setup>
//stores selected region
const selectRegion = (region) => {
  localStorage.setItem('region', region)
  // when changing regione removes saved incomplete custom question
  localStorage.removeItem('customQuestionDraft')

}
</script>

<template>
  <div class="background">
    <div class="header-category">
      <div class="titles">
        <router-link to="/" class="back-link">
          <h1 class="tomenu">World Conquest</h1>
        </router-link>
        <h2>Choose region you want to play:</h2>
      </div>

      <!-- header of buttons that lead to statistics and settings -->
      <div class="header-buttons">
        <router-link to="/stats">
          <button class="header-btn" aria-label="Statistics">
            <img src="../assets/stats3.png" alt="Statistics" />
          </button>
        </router-link>
        <router-link to="/settings">
          <button class="header-btn" aria-label="Settings">
            <img src="../assets/settings2.png" alt="Settings" />
          </button>
        </router-link>
      </div>
    </div>

    <!-- only europe and americas regions are currently playable -->
    <div class="categories-category">
      <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Africa</h3>
        <img
          src="../assets/africa.png"
          alt="Africa"
          class="filter2"
          @click="selectRegion('africa')"
        />
      </button>
      <!-- </router-link> -->

      <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Americas</h3>
        <img
          src="../assets/americas.png"
          class="filter"
          alt="Americas"
          @click="selectRegion('americas')"
        />
      </button>
      </router-link>

      <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Asia</h3>
        <img src="../assets/asia.png" class="filter" alt="Asia" @click="selectRegion('asia')" />
      </button>
      <!-- </router-link> -->

      <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Australia & Oceania</h3>
        <img src="../assets/oceania.png" alt="Oceania" @click="selectRegion('oceania')" />
      </button>
      <!-- </router-link> -->

      <!-- routes to quiz settings -->
      <router-link to="/themes" class="category">
        <button class="img-button">
          <h3>Europe</h3>
          <img
            src="../assets/europe.png"
            alt="Europe"
            class="filter"
            @click="selectRegion('europe')"
          />
        </button>
      </router-link>

      <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Whole World</h3>
        <img src="../assets/home.png" alt="World" @click="selectRegion('earth')" />
      </button>
      <!-- </router-link> -->
    </div>
  </div>
</template>

<style>
.header-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Press Start 2P', monospace;
  font-size: 3rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: 0.2s all;
}

.header-btn img {
  object-fit: contain;
  margin-bottom: 0.3rem;
}

.header-category {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95vw;
  margin: 2rem;
}

.header-btn:hover {
  color: #ccc;
  transform: scale(1.1);
}

.filter {
  filter: brightness(1.4);
}
.filter2 {
  filter: brightness(1.2);
}
h3 {
  z-index: 999;
}
.background {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Press Start 2P', monospace;
  color: white;
}

.background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/home.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5;
  z-index: -1;
}

.header-category {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95vw;
  margin: 2rem;
}

.categories-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.categories-category {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: center;
}

.img-button {
  border: none;
  font-family: 'Press Start 2P', monospace;
  background: none;
  cursor: pointer;
  position: relative;
}

.img-button img {
  width: 18vw;
  object-fit: cover;
  border-radius: 12px;
  aspect-ratio: 1 / 1;
  transition: 0.3s all;
}

.img-button:hover:not(.blocked) img {
  box-shadow:0 0 5px #ccc,0 0 10px #ccc,0 0 15px #ccc;
  transform: scale(1.05);
}

.img-button h3 {
  position: absolute;
  bottom: 10px;
  left: 10px;
  margin: 0;
  color: white;
  font-size: 1.1rem;
  text-shadow: 0 0 6px black;
}
.titles h1 {
  font-size: 4rem;
  margin: 0;
}
.back-link {
  color: white;
  text-decoration: none;
}

.back-link:hover {
  color: #00ff88;
}
.blocked{
filter: grayscale(100%) brightness(70%);

}
</style>
