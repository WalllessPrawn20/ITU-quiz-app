////////////////////////////////
//// Author: Matej Melchiory ///
//// Login: xmelchm00 //////////
//// Date: 9.12.2025 ///////////
////////////////////////////////
class AudioManager {
  constructor() {
    // Preload audio tracks
    this.tracks = {
      synthwave: new Audio(new URL('./synthwave.mp3', import.meta.url).href),
      chill: new Audio(new URL('./chill.mp3', import.meta.url).href),
      retro: new Audio(new URL('./retro.mp3', import.meta.url).href),
    }

    this.current = this.tracks.synthwave
    this.last = this.tracks.synthwave
    this.current.loop = true
    this.current.volume = 0.5

    // Enable from the start
    this.enabled = true
  }

  // Playing music
  play() {
    if (!this.current) return
    this.current.play()
  }

  // Pausing music
  pause() {
    this.current.pause()
  }

  // Toggle music
  toggle() {
    this.enabled = !this.enabled
    this.enabled ? this.current.play() : this.current.pause()
  }

  // Switch track to the new chosen
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

  // Set volume
  setVolume(v) {
    this.current.volume = v
  }
}

export const audioManager = new AudioManager()
