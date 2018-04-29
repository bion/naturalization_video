import * as THREE from 'three'

import sections from './sections'

require('../sass/home.sass')

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth
    this.height = window.innerHeight

    if (opts.container) {
      this.container = opts.container
      this.init()
      this.render()
    } else {
      throw new Error('missing container')
    }
  }

  init() {
    this.scene = new THREE.Scene()
    this.timeZero = Date.now()

    this.setupRenderer()
    this.setupCamera()
    this.setupHelpers()

    const firstSection = sections[0]

    this.currentSection = new firstSection(
      this.scene,
      this.camera,
      this.timeZero
    )

    this.currentSection.start()
  }

  elapsedTime() {
    return Date.now() - this.timeZero
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

  setupHelpers() {
    this.scene.add(new THREE.GridHelper(200, 16))
    this.scene.add(new THREE.AxisHelper(75))
  }
}

new Application({
  container: document.getElementById('canvas-container')
})
