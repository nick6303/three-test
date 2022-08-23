import * as THREE from 'three'
import { FontLoader } from '@js/FontLoader.js'

export class plane {
  constructor(row) {
    const planeGeometry = new THREE.PlaneGeometry(row.width, row.long)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xacacac })
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
    this.plane.rotation.x = -0.5 * Math.PI
    this.plane.position.set(...row.position)
    this.plane.receiveShadow = true
    this.plane.name = 'floor'
  }
}

export class server {
  constructor(position, servers, option = {}) {
    const hostWidth = option.hostWidth ?? 20
    const hostHeight = option.hostHeight ?? 10
    const hostLong = option.hostLong ?? 20
    const hostLimit = option.hostLimit ?? 6
    const hostGeo = new THREE.BoxGeometry(hostWidth, hostHeight, hostLong)
    const frontImg = require('@img/serverFront.jpg')
    const frontMap = new THREE.TextureLoader().load(frontImg)
    const backImg = require('@img/serverBack.png')
    const backMap = new THREE.TextureLoader().load(backImg)
    const sideImg = require('@img/serverSide.png')
    const sideMap = new THREE.TextureLoader().load(sideImg)
    const topImg = require('@img/serverTop.png')
    const topMap = new THREE.TextureLoader().load(topImg)

    // 準備頭部與臉的材質
    const hostMaterials = []
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
        case 0:
          map = topMap
          break
        default:
          map = sideMap
          break
      }

      hostMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
    }

    const boxGeo = new THREE.BoxGeometry(
      hostWidth + 1,
      hostHeight * hostLimit + 1,
      hostLong + 1
    )
    const boxMaterials = []
    const boxSideImg = require('@img/boxSide.jpg')
    const boxSideMap = new THREE.TextureLoader().load(boxSideImg)
    for (let i = 0; i < 6; i++) {
      let map, opacity, transparent
      switch (i) {
        case 1:
          map = boxSideMap
          transparent = false
          opacity = 1
          break
        case 2:
          map = boxSideMap
          transparent = false
          opacity = 1
          break
        case 3:
          map = boxSideMap
          transparent = false
          opacity = 1
          break
        case 0:
          map = boxSideMap
          transparent = false
          opacity = 1
          break
        default:
          map = boxSideMap
          opacity = 0.1
          transparent = true
          break
      }

      boxMaterials.push(
        new THREE.MeshStandardMaterial({
          map: map,
          opacity: opacity,
          transparent: transparent,
          side: THREE.DoubleSide,
        })
      )
    }

    this.cabinet = new THREE.Mesh(boxGeo, boxMaterials)
    this.cabinet.name = 'cabinet'
    // const box = new THREE.Mesh(boxGeo, boxMaterials)
    // this.cabinet.add(box)

    for (let i = 0; i < servers.length; i++) {
      const host = new THREE.Mesh(hostGeo, hostMaterials)

      const translateY = i * hostHeight + 5 - (hostHeight * hostLimit) / 2
      host.translateY(translateY)

      this.cabinet.add(host)
    }

    const x = position[0]
    const y = (hostHeight * hostLimit) / 2
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

      const shapes = font.generateShapes(message, 0.5)

      vm.geometry = new THREE.ShapeGeometry(shapes)

      vm.geometry.computeBoundingBox()
      const deg = Math.PI
      vm.geometry.rotateX(deg / -2)
      vm.text = new THREE.Mesh(vm.geometry, vm.matLite)
      vm.text.position.set(...position)
    })
  }
}

export const removeEmpty = (params) => {
  const tem = params
  Object.keys(params).forEach((key) => {
    if (params[key] === null || params[key] === undefined) {
      delete tem[key]
    }
  })
  return tem
}

export const updateLocalStorgeToken = (response) => {
  const { access_token } = response
  localStorage.setItem('access_token', access_token)
  const csrftoken = getCookie('csrftoken')
  localStorage.setItem('csrftoken', csrftoken)
}

export const getCookie = (cname) => {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export function assemblyParams(params) {
  // api url 組字串
  let str = ''
  Object.keys(params).forEach((key) => {
    if (params[key] || params[key] === false || params[key] === 0) {
      str += `${key}=${params[key]}&`
    }
  })
  return str.substring(0, str.length - 1) // 去結尾&
}
