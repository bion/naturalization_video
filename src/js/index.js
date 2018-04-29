import * as THREE from 'three'
import asyncLib from 'async'
import Mousetrap from 'mousetrap'

import sections from './sections'

require('../sass/home.sass')

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth - 20
    this.height = window.innerHeight - 20

    if (opts.container) {
      this.container = opts.container
      this.init(this.render)
    } else {
      throw new Error('missing container')
    }
  }

  init(done) {
    this.scene = new THREE.Scene()

    this.setupRenderer()
    this.setupCamera()
    this.setupHelpers()
    this.setupAudio(() => {
      const firstSection = sections[0]

      this.currentSection = new firstSection(
        this.scene,
        this.camera,
        this.audioPlayer
      )

      Mousetrap.bind('space', this.next)

      done()
    })
  }

  next = () => {
    this.currentSection.start()
  }

  render = () => {
    this.currentSection.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(new THREE.Color(0xeeeeee))
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
    const listener = new THREE.AudioListener()
    this.camera.add(listener)

    const audio = new THREE.Audio(listener)
    const audioBuffers = {}

    const loaderFuncs = ['tick'].map(filename => callback => {
      const audioLoader = new THREE.AudioLoader()

      audioLoader.load(`public/${filename}.wav`, buffer => {
        audio.setBuffer(buffer)
        audioBuffers[filename] = buffer
        callback()
      })
    })

    this.audioPlayer = {
      audioBuffers,
      audio
    }

    asyncLib.parallelLimit(loaderFuncs, 6, done)
  }
}

new Application({
  container: document.getElementById('canvas-container')
})
