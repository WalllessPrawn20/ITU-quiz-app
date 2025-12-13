import clickSfx from './button.mp3'

class SfxManager {
  constructor() {
    this.enabled = true
    this.click = new Audio(clickSfx)
    this.click.volume = 0.5

    const stored = sessionStorage.getItem('sfx')
    if (stored !== null) {
      this.enabled = stored === 'true'
    }
  }

  setEnabled(val) {
    this.enabled = val
    sessionStorage.setItem('sfx', val)
  }

  playClick() {
    if (!this.enabled) return
    this.click.currentTime = 0
    this.click.play()
  }
}

export const sfxManager = new SfxManager()
