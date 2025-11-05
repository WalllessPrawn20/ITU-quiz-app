<script setup>
const selectRegion = (region) => {
  localStorage.setItem('region', region)
}
</script>

<template>
  <div class="background">
  <div class="header-category">
    <div class="titles">
      <router-link to="/" class="back-link">
      <h1>World Conquest</h1>
    </router-link>
      <h2>Choose region you want to play:</h2>
    </div>

    <router-link to="/settings">
      <button class="settings" aria-label="Settings">
        ⚙️
      </button>
    </router-link>
  </div>

  <div class="categories">
    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Africa</h3>
        <img src="../assets/africa.jpg" alt="Africa" @click="selectRegion('africa')" />
      </button>
    <!-- </router-link> -->

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Americas</h3>
        <img src="../assets/america.jpg" alt="Americas" @click="selectRegion('americas')" />
      </button>
    <!-- </router-link> -->

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Asia</h3>
        <img src="../assets/asia.png" alt="Asia" @click="selectRegion('asia')" />
      </button>
    <!-- </router-link> -->

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Australia & Oceania</h3>
        <img src="../assets/oceania.png" alt="Oceania" @click="selectRegion('oceania')" />
      </button>
    <!-- </router-link> -->

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Europe</h3>
        <img src="../assets/europe.png" alt="Europe" @click="selectRegion('europe')" />
      </button>
    </router-link>

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocekd">
        <h3>Whole World</h3>
        <img src="../assets/earth.jpg" alt="World" @click="selectRegion('earth')" />
      </button>
    <!-- </router-link> -->
  </div>
</div>
</template>

<style>
.background {
  position: relative; /* dôležité pre pseudo-element */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Press Start 2P', monospace;
  color: white;
  /* odstránime opacity odtiaľto */
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/home.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5; /* iba pozadie je priehľadné */
  z-index: -1; /* aby bolo pod obsahom */
}


.header-category {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95vw;
  margin: 2rem; /* top, bottom, horizontálne centrovanie */
}

.categories-wrapper {
  flex: 1; /* zabere zostávajúcu výšku */
  display: flex;
  justify-content: center;
  align-items: center;
}

.categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: center;
}



/* Buttons */
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
.titles h1{
  font-size: 4rem;
  margin: 0;
}
.back-link{
  color: white;
  text-decoration: none;
}
</style>
