export default class Base {
  constructor(scene, camera, audioPlayer, meshStore) {
    this.scene = scene
    this.camera = camera
    this.audioPlayer = audioPlayer
    this.meshStore = meshStore

    this.runnning = false
    this.done = false

    this.doneCallbacks = []
  }

  onDone(fn) {
    this.doneCallbacks.push(fn)
  }

  finish() {
    this.running = false
    this.done = true

    this.doneCallbacks.forEach(fn => fn())
  }

  elapsedTime(timeZero) {
    timeZero = timeZero || this.timeZero
    return (Date.now() - timeZero) / 1000
  }

  init() {
    throw new Error('init not implemented')
  }

  start() {
    throw new Error('start not implemented')
  }

  update() {
    throw new Error('update not implemented')
  }
}
