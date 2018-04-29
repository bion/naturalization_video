import * as THREE from 'three'
import _ from 'lodash'

const DATA = {
  applicationsApproved: 716465,
  roundApplicationsApproved: 717
}

export default class NaturalizationMap {
  constructor(scene, camera, audioPlayer) {
    this.scene = scene
    this.camera = camera
    this.audioPlayer = audioPlayer
    this.runnning = false

    this.init()
  }

  elapsedTime() {
    return (Date.now() - this.timeZero) / 1000
  }

  init() {
    this.peopleMeshes = _.times(DATA.roundApplicationsApproved, i =>
      this.makePerson(i)
    )
  }

  start() {
    _.forEach(this.peopleMeshes, person => this.scene.add(person))

    this.running = true

    this.audioPlayer.audio.setLoop(true)
    this.audioPlayer.audio.setBuffer(this.audioPlayer.audioBuffers.tick)
    this.audioPlayer.audio.play()

    this.timeZero = Date.now()
  }

  done() {
    this.audioPlayer.audio.stop()
    this.running = false
  }

  update() {
    if (!this.running) return

    const revealedCount = Math.min(
      Math.round(this.elapsedTime() * 300),
      DATA.roundApplicationsApproved
    )

    let willReveal = false

    for (let i = 0; i < revealedCount; i++) {
      willReveal = !willReveal && this.peopleMeshes[i].material.opacity === 0
      this.peopleMeshes[i].material.opacity = 1
    }

    if (revealedCount === DATA.roundApplicationsApproved) {
      this.done()
    }
  }

  personGeometry = new THREE.CircleGeometry(0.3, 16)

  makePerson(i) {
    const person = new THREE.Mesh(
      this.personGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0
      })
    )

    const position = this.startingPosition(i)

    person.position.x = position.x
    person.position.y = position.y
    person.position.z = position.z

    return person
  }

  startingPosition(i) {
    const rowWidth = 15
    const scaler = 1

    const x = i % rowWidth
    const y = Math.floor(i / rowWidth) + 1

    return new THREE.Vector3(x * scaler, y * scaler, 0)
  }
}
