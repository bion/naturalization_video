import * as THREE from 'three'
import _ from 'lodash'

import Base from './base'

const DATA = {
  applicationsApproved: 716465,
  roundApplicationsApproved: 717
}

// meshStore adds:
//   acceptedNaturalizationDots: []
export default class NaturalizationMap extends Base {
  init() {
    this.meshStore.acceptedNaturalizationDots = []

    for (let i = 0; i < DATA.roundApplicationsApproved; i++) {
      this.meshStore.acceptedNaturalizationDots.push(this.makePerson(i))
    }
  }

  start() {
    _.forEach(this.meshStore.acceptedNaturalizationDots, person =>
      this.scene.add(person)
    )

    this.running = true
    this.audioPlayer.playTicks()

    this.timeZero = Date.now()

    this.onDone(() => this.audioPlayer.stopTicks())
  }

  update() {
    if (!this.running) return

    const revealedCount = Math.min(
      Math.round(this.elapsedTime() * 300),
      DATA.roundApplicationsApproved
    )

    let willReveal = false

    for (let i = 0; i < revealedCount; i++) {
      willReveal =
        !willReveal &&
        this.meshStore.acceptedNaturalizationDots[i].material.opacity === 0

      this.meshStore.acceptedNaturalizationDots[i].material.opacity = 1
    }

    if (revealedCount === DATA.roundApplicationsApproved) {
      this.finish()
    }
  }

  // private

  personGeometry = new THREE.CircleGeometry(0.3, 16)

  makePerson = i => {
    const person = new THREE.Mesh(
      this.personGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x5c7ae5,
        transparent: true,
        opacity: 0
      })
    )

    const position = this.personStartingPosition(i)

    person.position.x = position.x
    person.position.y = position.y
    person.position.z = position.z

    return person
  }

  personStartingPosition(i) {
    const rowWidth = 15
    const scaler = 1

    const x = i % rowWidth
    const y = Math.floor(i / rowWidth) + 1

    return new THREE.Vector3(x * scaler, y * scaler, 0)
  }
}
