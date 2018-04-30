import * as THREE from 'three'
import asyncLib from 'async'

export default class AudioPlayer {
  static soundFilenames = ['tick']

  constructor(camera) {
    this.camera = camera
    this.audioBuffers = {}

    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener)
  }

  loadBuffers(done) {
    const loaderFuncs = AudioPlayer.soundFilenames.map(filename => callback => {
      const audioLoader = new THREE.AudioLoader()

      audioLoader.load(`public/${filename}.wav`, buffer => {
        this.audioBuffers[filename] = buffer
        callback()
      })
    })

    asyncLib.parallelLimit(loaderFuncs, 6, done)
  }

  playTicks() {
    this.ticksAudio = this.ticksAudio || new THREE.Audio(this.listener)

    this.ticksAudio.setLoop(true)
    this.ticksAudio.setBuffer(this.audioBuffers.tick)
    this.ticksAudio.play()
  }

  stopTicks() {
    this.ticksAudio.stop()
  }
}
