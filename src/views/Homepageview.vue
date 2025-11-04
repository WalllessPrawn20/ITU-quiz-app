<template>
  <div class="homepage">
    <router-link to="/settings">
      <button class="settings" aria-label="Settings">
        ⚙️
      </button>
    </router-link>

    <h1 class="title">Ultimate Country Quiz</h1>

    <router-link to="/category">
      <button class="start" aria-label="Start quiz">
        <span class="play-icon" aria-hidden="true"></span>
      </button>
    </router-link>
  </div>
</template>

<style>
/* reset */
body {
  padding: 0;
  margin: 0;
}

/* layout */
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
  position: relative; /* dôležité pre absolute button */
}

/* SETTINGS BUTTON (vpravo hore) */
.settings {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    transform 0.18s ease,
    background 0.18s ease;
}

/* hover efekt */
.settings:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.06);
}

/* focus pre prístupnosť */
.settings:focus {
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.25);
}

/* label za textom */
.title {
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  border-radius: 12px;
}

/* TLAČIDLO - biely kruh s miernou priehľadnosťou */
.start {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition:
    transform 0.18s ease,
    background 0.18s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

/* focus pre prístupnosť */
.start:focus {
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.25);
}

/* Trojuholník (play) */
.play-icon {
  width: 0;
  height: 0;
  border-left: 28px solid black;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  display: inline-block;
  transform: translateX(2px);
}

/* Hover efekt */
.start:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.06);
}
</style>
