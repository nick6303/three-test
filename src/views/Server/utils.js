import * as THREE from 'three'
import { FontLoader } from '@js/FontLoader.js'

export class server {
  constructor(position) {
    const hostHeight = 10
    const hostGeo = new THREE.BoxGeometry(20, hostHeight, 20)
    const frontImg = require('@img/serverFront.jpg')
    const frontMap = new THREE.TextureLoader().load(frontImg)
    const backImg = require('@img/serverBack.png')
    const backMap = new THREE.TextureLoader().load(backImg)
    const sideImg = require('@img/serverSide.png')
    const sideMap = new THREE.TextureLoader().load(sideImg)
    const topImg = require('@img/serverTop.png')
    const topMap = new THREE.TextureLoader().load(topImg)

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map
      switch (i) {
        case 4:
          map = frontMap
          break
        case 5:
          map = backMap
          break
        case 2:
          map = topMap
          break
        case 6:
          map = topMap
          break
        default:
          map = sideMap
          break
      }

      headMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
    }

    this.cabinet = new THREE.Group()
    const hostlength = 5

    for (let i = 0; i < hostlength; i++) {
      const host = new THREE.Mesh(hostGeo, headMaterials)

      const translateY = i * hostHeight + 5 - 30
      host.translateY(translateY)

      this.cabinet.add(host)
    }

    const helper = new THREE.BoxHelper(
      new THREE.Mesh(new THREE.BoxGeometry(20, 60, 20))
    )
    helper.material.color.setHex(0x101010)
    helper.material.blending = THREE.AdditiveBlending
    helper.material.transparent = true
    this.cabinet.add(helper)

    const x = position[0]
    const y = (6 * 10) / 2
    const z = position[2]

    this.cabinet.position.set(x, y, z)
  }
}

export class text {
  constructor(message, position) {
    const loader = new FontLoader()
    const vm = this
    loader.load('', function (font) {
      const color = 0x006699

      vm.matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      })

      const shapes = font.generateShapes(message, 5)

      vm.geometry = new THREE.ShapeGeometry(shapes)

      vm.geometry.computeBoundingBox()
      const deg = Math.PI
      vm.geometry.rotateX(deg / -2)
      vm.text = new THREE.Mesh(vm.geometry, vm.matLite)
      vm.text.position.set(...position)
    })
  }
}
