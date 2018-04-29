import * as THREE from 'three'
import _ from 'lodash'

const DATA = {
  applicationsApproved: 716465,
  roundApplicationsApproved: 717
}

export default class NaturalizationMap {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.started = false

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
    this.started = true
    this.timeZero = Date.now()
  }

  update() {
    if (!this.started) return

    const revealed = Math.min(
      Math.round(this.elapsedTime() * 300),
      DATA.roundApplicationsApproved - 1
    )

    for (let i = 0; i < revealed; i++) {
      this.peopleMeshes[i].material.opacity = 1
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
