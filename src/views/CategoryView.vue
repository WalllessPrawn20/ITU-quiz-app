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

  <div class="header-buttons">
    <router-link to="/stats">
      <button class="header-btn" aria-label="Statistics">
        <img src="../assets/stats3.png" alt="Statistics"/>
      </button>
    </router-link>
    <router-link to="/settings">
      <button class="header-btn" aria-label="Settings">
                <img src="../assets/settings2.png" alt="Settings"/>
      </button>
    </router-link>
  </div>
</div>


  <div class="categories-category">
    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Africa</h3>
        <img src="../assets/africa.png" alt="Africa" class="filter2" @click="selectRegion('africa')" />
      </button>
    <!-- </router-link> -->

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocked">
        <h3>Americas</h3>
        <img src="../assets/americas.png" class="filter" alt="Americas" @click="selectRegion('americas')" />
      </button>
    <!-- </router-link> -->

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

    <router-link to="/themes" class="category">
      <button class="img-button">
        <h3>Europe</h3>
        <img src="../assets/europe.png" alt="Europe" class="filter" @click="selectRegion('europe')" />
      </button>
    </router-link>

    <!-- <router-link to="/themes" class="category"> -->
      <button class="img-button blocekd">
        <h3>Whole World</h3>
        <img src="../assets/home.png" alt="World" @click="selectRegion('earth')" />
      </button>
    <!-- </router-link> -->
  </div>
</div>
</template>

<style>
/* .header-buttons img {
  scale: 0.4;
  } */
.header-buttons {
  display: flex;
  flex-direction: row; /* tlačidlá vedľa seba */
  align-items: center; /* vertikálne vycentrované voči okoliu */
  gap: 1rem; /* medzera medzi tlačidlami */
}



.header-btn {
  display: flex;            /* Flex layout v tlačidle */
  flex-direction: column;   /* Vertikálne usporiadanie: obrázok hore, text dole */
  align-items: center;      /* Centrovanie horizontálne */
  justify-content: flex-start; /* Obrázok hore */
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
  margin-bottom: 0.3rem; /* medzera medzi obrázkom a textom, ak je */
}

.header-category {
  display: flex;
  justify-content: space-between; /* tituly vľavo, tlačidlá vpravo */
  align-items: flex-start; /* tlačidlá hore */
  width: 95vw;
  margin: 2rem;
}

.header-btn:hover {
  color: #ccc; /* jemný hover efekt */
  transform: scale(1.1); /* jemné zväčšenie pri hover, podobne ako obrázky */
}

.filter{
  filter: brightness(1.4);

}
.filter2{
  filter: brightness(1.2);

}
 h3{
  z-index: 999;
}
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

.categories-category{
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
  transition: 0.3s all;
}

.img-button:hover img {
  box-shadow:
    0 0 5px #ccc,
    0 0 10px #ccc,
    0 0 15px #ccc;
  transform: scale(1.05); /* mierne zväčšenie */
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
