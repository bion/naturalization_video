import * as THREE from 'three'
import _ from 'lodash'

import Base from './base'

const DATA = {
  roundTotalEligible: 9000
}

const sinEaseProgress = (start, end, duration) => elapsedTime => {
  var progress = Math.min(elapsedTime / duration, 1)

  return start + (end - start) * (-Math.cos(Math.PI * progress) * 0.5 + 0.5)
}

const NAT_DOT_TRASITION_DUR = 1

// meshStore adds:
//   eligibleDots: []
export default class EnterEligibleDots extends Base {
  init() {
    this.imageCenter = this.camera.position

    this.meshStore.eligibleNaturalizationDots = []

    for (let i = 0; i < DATA.roundTotalEligible; i++) {
      this.meshStore.eligibleNaturalizationDots.push(this.makeDot(i))
    }
  }

  start() {
    this.timeZero = Date.now()
    this.running = true
    this.eligibleDotsRunning = false

    this.startNatDotTransition()
    setTimeout(this.startEligibleDotTransition, NAT_DOT_TRASITION_DUR * 1000)
  }

  update() {
    if (!this.running) return

    this.updateNatDotTransition()
    this.updateEligibleDotTransition()
  }

  // private

  startEligibleDotTransition = () => {
    this.eligibleDotsRunning = true

    _.forEach(this.meshStore.eligibleNaturalizationDots, dot =>
      this.scene.add(dot)
    )

    this.audioPlayer.playTicks()
    this.eligibleTimeZero = Date.now()

    this.onDone(() => {
      this.eligibleDotsRunning = false
      this.audioPlayer.stopTicks()
    })
  }

  updateEligibleDotTransition() {
    if (!this.eligibleDotsRunning) return

    this.camera.position.z += 1.8
    this.camera.position.y += 0.8

    const revealedCount = Math.min(
      Math.round(this.elapsedTime(this.eligibleTimeZero) * 600),
      DATA.roundTotalEligible
    )

    const dots = this.meshStore.eligibleNaturalizationDots
    let willReveal = false

    for (let i = 0; i < revealedCount; i++) {
      willReveal = !willReveal && dots[i].material.opacity === 0
      dots[i].material.opacity = 1
    }

    if (revealedCount === DATA.roundTotalEligible) {
      this.finish()
    }
  }

  dotGeometry = new THREE.CircleGeometry(0.3, 16)

  makeDot = i => {
    const person = new THREE.Mesh(
      this.dotGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xd90000,
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

  startNatDotTransition() {
    this.natDotDone = false

    this.natDoneTransitionFuncs = this.meshStore.acceptedNaturalizationDots.map(
      mesh => {
        const easeFn = sinEaseProgress(
          mesh.position.x,
          mesh.position.x - 30,
          NAT_DOT_TRASITION_DUR
        )

        return elapsed => {
          const newX = easeFn(elapsed)

          if (newX === mesh.position.x) {
            this.natDotDone = true
          } else {
            mesh.position.x = newX
          }
        }
      }
    )
  }

  updateNatDotTransition() {
    if (this.natDotDone) return

    const elapsedTime = this.elapsedTime()

    for (let i = 0; i < this.natDoneTransitionFuncs.length; i++) {
      if (this.natDotDone) break

      this.natDoneTransitionFuncs[i](elapsedTime)
    }
  }
}
