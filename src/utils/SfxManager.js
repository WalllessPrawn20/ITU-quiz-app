////////////////////////////////
//// Author: Matej Melchiory ///
//// Login: xmelchm00 //////////
//// Date: 9.12.2025 ///////////
////////////////////////////////

import clickSfx from './button.mp3'

class SfxManager {
  constructor() {
    // Enable sound effects from the start
    this.enabled = true
    this.click = new Audio(clickSfx)
    this.click.volume = 0.5

    const stored = sessionStorage.getItem('sfx')
    if (stored !== null) {
      this.enabled = stored === 'true'
    }
  }

  // Enable or disable sound effects
  setEnabled(val) {
    this.enabled = val
    sessionStorage.setItem('sfx', val)
  }

  // Play click sound effect
  playClick() {
    if (!this.enabled) return
    this.click.currentTime = 0
    this.click.play()
  }
}

export const sfxManager = new SfxManager()
