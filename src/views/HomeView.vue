<template>
  <div class="homepage">
    <router-link to="/settings">
      <button class="header-btn settings" aria-label="Settings">
        <img src="../assets/settings2.png" alt="Settings"/>
      </button>
    </router-link>

    <h1 class="title">World Conquest</h1>

    <router-link to="/category">
      <button class="start" aria-label="Start quiz">
        <img src="../assets/play.png" alt="Play" class="play-icon"/>
      </button>
    </router-link>
  </div>
</template>

<style>
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
