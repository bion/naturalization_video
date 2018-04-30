import * as THREE from 'three'
import _ from 'lodash'

import Base from './base'

const DATA = {
  applicationsApproved: 716465,
  roundApplicationsApproved: 717
}

// meshStore adds:
//   acceptedNaturalizationDots: []
export default class EnterNaturalizationDots extends Base {
  init() {
    this.imageCenter = this.camera.position

    this.meshStore.acceptedNaturalizationDots = []

    for (let i = 0; i < DATA.roundApplicationsApproved; i++) {
      this.meshStore.acceptedNaturalizationDots.push(this.makeDot(i))
    }
  }

  start() {
    _.forEach(this.meshStore.acceptedNaturalizationDots, dot =>
      this.scene.add(dot)
    )

    this.running = true
    this.audioPlayer.playTicks()
    this.timeZero = Date.now()

    this.onDone(() => this.audioPlayer.stopTicks())
  }

  update() {
    if (!this.running) return

    const revealedCount = Math.min(
      Math.round(this.elapsedTime() * 600),
      DATA.roundApplicationsApproved
    )

    const dots = this.meshStore.acceptedNaturalizationDots
    let willReveal = false

    for (let i = 0; i < revealedCount; i++) {
      willReveal = !willReveal && dots[i].material.opacity === 0
      dots[i].material.opacity = 1
    }

    if (revealedCount === DATA.roundApplicationsApproved) {
      this.finish()
    }
  }

  // private

  dotGeometry = new THREE.CircleGeometry(0.3, 16)

  makeDot = i => {
    const person = new THREE.Mesh(
      this.dotGeometry,
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

    let x = (i % rowWidth) * scaler
    let y = Math.floor(i / rowWidth) * scaler

    x += this.imageCenter.x - 7.5
    y += this.imageCenter.y - 25

    return new THREE.Vector3(x, y, 0)
  }
}
