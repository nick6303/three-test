<template lang="pug">
#Server(ref="serverRef")
#blocker
  #instructions
</template>
<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

import '@js/PointerLockControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { server, text, plane } from './utils'
import { cloneDeep } from 'lodash'
import data from './data'
import * as dat from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

let scene = new THREE.Scene()

// 主機伺服器參數
const hostOption = {
  hostLimit: 6, // 一個機櫃中最多幾台主機
  hostWidth: 20, // 主機寬度
  hostLong: 20, // 主機長度
  hostHieght: 10, // 主機高度
}

// 創造機櫃
const createCabinets = ({ position, servers }) => {
  let serverObj = new server(position, servers, hostOption)
  scene.add(serverObj.cabinet)
}

// 創造平面及機房名稱
const createPlane = (row) => {
  const planeObj = new plane(row)
  scene.add(planeObj.plane)

  const createText = (message, position) => {
    const textObj = new text(message, position)
    scene.add(textObj.text)
  }

  // 機房名稱
  const textPosition = cloneDeep(row.position)
  textPosition[0] -= row.width / 2 - 2
  textPosition[1] += 0.1
  textPosition[2] += row.long / 2 - 2
  createText(row.houseName, textPosition)
}

// 產生結構
const generateStructor = () => {
  const offsetCenter = (dataLength, parentPosi, i, width, interval) => {
    const middle = Math.ceil(dataLength / 2)
    let direction = middle > i ? -1 : 1
    let numb
    let posi
    if (dataLength % 2 === 1) {
      numb = i + 1 - middle
      posi = numb * (width + interval) + parentPosi
    } else {
      numb = i + 1 - middle
      if (numb > 0) {
        numb--
      }
      posi =
        numb * (width + interval) +
        ((width + interval) / 2) * direction +
        parentPosi
    }
    return posi
  }

  data.forEach((house, i) => {
    const planeWidth = 150 // 機房平面寬度
    const planeLong = 300 // 機房平面長度

    const planePosiX = offsetCenter(data.length, 0, i, planeWidth, 1)

    createPlane({
      houseName: house.houseName,
      width: planeWidth,
      long: planeLong,
      position: [planePosiX, 0, 0],
    })

    // 計算一個平面的寬可以塞幾個主機
    let cabineWidthtLimit = 0
    while ((cabineWidthtLimit + 1) * (hostOption.hostWidth + 1) <= planeWidth) {
      cabineWidthtLimit++
    }

    // 判斷是否需要第二行
    const limit =
      house.cabinets.length >= cabineWidthtLimit
        ? cabineWidthtLimit
        : house.cabinets.length

    house.cabinets.forEach((item, cabinetIndex) => {
      let newIndex = ((cabinetIndex + 1) % limit) - 1
      if (newIndex === -1) {
        newIndex = limit - 1
      }

      const cabinetPosiX = offsetCenter(
        limit,
        planePosiX,
        newIndex,
        hostOption.hostWidth,
        1
      )

      const cabinetPosiZ = offsetCenter(
        Math.ceil(house.cabinets.length / limit),
        0,
        Math.floor(cabinetIndex / limit),
        hostOption.hostLong,
        hostOption.hostLong * 4
      )

      createCabinets({
        position: [cabinetPosiX, 0, cabinetPosiZ],
        servers: item.servers,
      })
    })
  })
}

export default {
  name: 'Server',
  setup() {
    const serverRef = ref(null)

    let camera, cameraControl, renderer, actives, gui
    let targetTween, positionTween

    let target = { x: 0, y: 0, z: 0 }
    let position = { x: 0, y: 180, z: 180 }
    let targetStart = { x: 0, y: 0, z: 0 }
    let positionStart = { x: 0, y: 180, z: 180 }

    const cameraPosition = [0, 180, 180] // 攝影機位置

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const onPointerMove = (event) => {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const backStart = () => {
      target.x = 0
      target.y = 0
      target.z = 0
      position.x = 0
      position.y = 180
      position.z = 180
      targetStart.x = cameraControl.target.x
      targetStart.y = cameraControl.target.y
      targetStart.z = cameraControl.target.z
      positionStart.x = cameraControl.object.position.x
      positionStart.y = cameraControl.object.position.y
      positionStart.z = cameraControl.object.position.z
      targetTween.start()
      positionTween.start()
    }

    const init = () => {
      scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x000000, 0.0008)

      // camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      camera.position.set(...cameraPosition)
      camera.lookAt(scene.position)

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setClearColor(0x80adfc, 1.0)
      renderer.setClearColor(0x111111, 1.0)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

      cameraControl = new OrbitControls(camera, renderer.domElement)
      cameraControl.listenToKeyEvents(window)
      cameraControl.keyPanSpeed = 50

      // light
      let ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)
      let spotLight = new THREE.SpotLight(0xf0f0f0)
      spotLight.position.set(0, 500, 500)
      spotLight.castShadow = true
      scene.add(spotLight)

      generateStructor()
      tweenHandler()

      let controls = new (function () {
        this.backStart = backStart
      })()

      gui = new dat.GUI()
      gui.add(controls, 'backStart')
      // 將渲染出來的畫面放到網頁上的 DOM
      serverRef.value.appendChild(renderer.domElement)
    }

    const tweenHandler = () => {
      const onUpdate = () => {
        cameraControl.target.set(targetStart.x, targetStart.y, targetStart.z)
      }

      const updatePostion = () => {
        cameraControl.object.position.set(
          positionStart.x,
          positionStart.y,
          positionStart.z
        )
      }

      targetTween = new TWEEN.Tween(targetStart)
        .to(target, 1200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)

      positionTween = new TWEEN.Tween(positionStart)
        .to(position, 1200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(updatePostion)
    }

    function pointerHover() {
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(pointer, camera)

      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length > 0) {
        if (actives !== intersects[0].object) {
          if (actives) {
            actives.material.forEach((material) => {
              material.color.set(0xffffff)
            })
          }
          if (intersects[0].object.name === 'cabinet') {
            serverRef.value.classList.add('pointer')
            actives = intersects[0].object
            actives.material.forEach((material) => {
              material.color.set(0x0)
            })
          } else {
            serverRef.value.classList.remove('pointer')
            actives = null
          }
        }
      } else {
        if (actives) {
          actives.material.forEach((material) => {
            material.color.set(0xffffff)
          })
        }
        serverRef.value.classList.remove('pointer')
        actives = null
      }
    }

    const clickCabinet = () => {
      if (actives) {
        target.x = actives.position.x
        target.y = actives.position.y
        target.z = actives.position.z
        position.x = actives.position.x
        position.y = actives.position.y
        position.z = actives.position.z + hostOption.hostLong * 4
        targetStart.x = cameraControl.target.x
        targetStart.y = cameraControl.target.y
        targetStart.z = cameraControl.target.z
        positionStart.x = cameraControl.object.position.x
        positionStart.y = cameraControl.object.position.y
        positionStart.z = cameraControl.object.position.z
        targetTween.start()
        positionTween.start()
      }
    }

    const render = () => {
      cameraControl.update()
      pointerHover()
      TWEEN.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('click', clickCabinet)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('click', clickCabinet)
    })
    return { serverRef, cameraControl, backStart }
  },
}
</script>
<style lang="sass" scoped>
#Server
  &.pointer
    cursor: pointer
</style>
