// src/utils/audioManager.js
class AudioManager {
  constructor() {
    this.tracks = {
      synthwave: new Audio(new URL('./synthwave.mp3', import.meta.url).href),
      chill: new Audio(new URL('./chill.mp3', import.meta.url).href),
      retro: new Audio(new URL('./retro.mp3', import.meta.url).href),
    }

    this.current = this.tracks.synthwave
    this.last = this.tracks.synthwave
    this.current.loop = true
    this.current.volume = 0.5

    this.enabled = true
  }
  play() {
    if (!this.current) return
    this.current.play()
  }

  pause() {
    this.current.pause()
  }

  toggle() {
    this.enabled = !this.enabled
    this.enabled ? this.current.play() : this.current.pause()
  }

  switchTrack(name) {
    if (!this.tracks[name]) return
    if (this.current === this.tracks[name]) return
    const wasPlaying = !this.current.paused
    this.last = this.current
    this.current.pause()
    this.current.currentTime = 0
    this.current = this.tracks[name]
    this.current.loop = true
    this.current.volume = 0.5
    if (this.enabled && wasPlaying) this.current.play()
  }

  setVolume(v) {
    this.current.volume = v
  }
}

export const audioManager = new AudioManager()
