import * as THREE from 'three'
import Mousetrap from 'mousetrap'

import sections from './sections'
import AudioPlayer from './audio_player'

require('../sass/home.sass')

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth - 20
    this.height = window.innerHeight - 20
    this.meshStore = {}
    this.sectionIndex = -1

    if (opts.container) {
      this.container = opts.container
      this.init(this.render)
    } else {
      throw new Error('missing container')
    }
  }

  nextSection = () => {
    const sectionClass = sections[++this.sectionIndex]

    if (!sectionClass) return

    this.currentSection = new sectionClass(
      this.scene,
      this.camera,
      this.audioPlayer,
      this.meshStore
    )

    this.currentSection.init()
    this.currentSection.onDone(this.nextSection)
  }

  init(done) {
    this.scene = new THREE.Scene()

    this.setupRenderer()
    this.setupCamera()
    this.setupHelpers()

    Mousetrap.bind('space', this.next)

    this.setupAudio(() => {
      this.nextSection()
      done()
    })
  }

  next = () => {
    if (this.currentSection.running) return

    if (!this.currentSection.done) {
      this.currentSection.start()
    }
  }

  render = () => {
    this.currentSection.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(new THREE.Color(0xffffff))

    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.renderer.setSize(this.width, this.height)
    this.container.appendChild(this.renderer.domElement)
  }

  setupCamera() {
    const fov = 75
    const aspect = this.width / this.height
    const near = 0.1
    const far = 10000

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(25, 25, 50)
    this.camera.lookAt(new THREE.Vector3(25, 25, 0))
  }

  inDevMode() {
    return false
  }

  setupHelpers() {
    if (this.inDevMode()) {
      this.scene.add(new THREE.GridHelper(200, 16))
      this.scene.add(new THREE.AxisHelper(75))
    }
  }

  setupAudio(done) {
    this.audioPlayer = new AudioPlayer(this.camera)
    this.audioPlayer.loadBuffers(done)
  }
}

new Application({
  container: document.getElementById('canvas-container')
})
