<script setup>
const selectRegion = (region) => {
  localStorage.setItem('region', region)
}
</script>

<template>
  <div class="header">
    <div class="titles">
      <h1>Ultimate Country Quiz</h1>
      <h2>Play:</h2>
    </div>

    <router-link to="/" class="back-link">← Back</router-link>
  </div>

  <div class="categories">
    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Africa</h3>
        <img src="../assets/africa.jpg" alt="Africa" @click="selectRegion('africa')" />
      </button>
    </router-link>

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Americas</h3>
        <img src="../assets/america.jpg" alt="Americas" @click="selectRegion('americas')" />
      </button>
    </router-link>

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Asia</h3>
        <img src="../assets/asia.png" alt="Asia" @click="selectRegion('asia')" />
      </button>
    </router-link>

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Australia & Oceania</h3>
        <img src="../assets/oceania.png" alt="Oceania" @click="selectRegion('oceania')" />
      </button>
    </router-link>

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Europe</h3>
        <img src="../assets/europe.png" alt="Europe" @click="selectRegion('europe')" />
      </button>
    </router-link>

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Whole World</h3>
        <img src="../assets/earth.jpg" alt="World" @click="selectRegion('earth')" />
      </button>
    </router-link>
  </div>
</template>

<style>
/* Header layout */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 92vw;
  padding: 20px 40px;
}

.titles h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
}

.titles h2 {
  font-size: 1.6rem;
  margin: 0;
}

.back-link {
  text-decoration: underline;
  color: blue;
  font-size: 1.2rem;
  margin-top: 5px;
}

.categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center; /* horizontálne centrovanie gridu */
  justify-items: center; /* centrovanie obsahu v každej bunke */
}

/* Buttons */
.img-button {
  border: none;
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
  font-size: 1.4rem;
  text-shadow: 0 0 6px black;
}
</style>
