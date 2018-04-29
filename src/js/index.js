import * as THREE from 'three'

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

    this.setupRenderer()
    this.setupCamera()
    this.setupHelpers()
  }

  render = () => {
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
    this.camera.position.set(0, 100, 100)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  setupHelpers() {
    this.scene.add(new THREE.GridHelper(200, 16))
    this.scene.add(new THREE.AxisHelper(75))
  }
}

new Application({
  container: document.getElementById('canvas-container')
})
