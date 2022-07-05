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
    // const moveForward = ref(false)
    // const moveLeft = ref(false)
    // const moveBackward = ref(false)
    // const moveRight = ref(false)

    let camera, cameraControl, renderer, actives, gui
    // ,controls
    // let prevTime = Date.now() // 初始時間
    // let velocity = new THREE.Vector3() // 移動速度向量
    // let direction = new THREE.Vector3() // 移動方向向量

    const cameraPosition = [0, 180, 180] // 攝影機位置

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    function onPointerMove(event) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    let targetTween, positionTween

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

      // initPointerLockControls()

      const backStart = () => {
        cameraControl.target.set(0, 0, 0)
        target = { x: 0, y: 0, z: 0 }
        position = { x: 0, y: 180, z: 180 }
        cameraControl.object.position.set(...cameraPosition)
        targetTween.start()
        positionTween.start()
      }

      let controls = new (function () {
        this.backStart = backStart
      })()

      gui = new dat.GUI()
      gui.add(controls, 'backStart')
      // 將渲染出來的畫面放到網頁上的 DOM
      serverRef.value.appendChild(renderer.domElement)
      tweenHandler()
    }

    let target = { x: 0, y: 0, z: 0 }
    let position = { x: 0, y: 180, z: 180 }

    const tweenHandler = () => {
      const updateTarget = () => {
        console.log(target)
        cameraControl.target.x = target.x
        cameraControl.target.y = target.y
        cameraControl.target.z = target.z
      }

      const updatePostion = () => {
        cameraControl.object.position.x = position.x
        cameraControl.object.position.y = position.y
        cameraControl.object.position.z = position.z
      }

      targetTween = new TWEEN.Tween(cameraControl.target)
        .to(target, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(updateTarget)
        .onComplete(() => {})

      positionTween = new TWEEN.Tween(cameraControl.object.position)
        .to(position, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(updatePostion)
        .onComplete(() => {})
    }

    // function initPointerLockControls() {
    //   // 鼠標鎖定初始化
    //   controls = new THREE.PointerLockControls(camera)
    //   controls.getObject().position.set(...cameraPosition)
    //   scene.add(controls.getObject())

    //   const onKeyDown = function (event) {
    //     switch (event.keyCode) {
    //       // case 38: // up
    //       case 87: // w
    //         moveForward.value = true
    //         break
    //       // case 37: // left
    //       case 65: // a
    //         moveLeft.value = true
    //         break
    //       // case 40: // down
    //       case 83: // s
    //         moveBackward.value = true
    //         break
    //       // case 39: // right
    //       case 68: // d
    //         moveRight.value = true
    //         break
    //       default:
    //         break
    //     }
    //   }
    //   const onKeyUp = function (event) {
    //     switch (event.keyCode) {
    //       case 38: // up
    //       case 87: // w
    //         moveForward.value = false
    //         break
    //       case 37: // left
    //       case 65: // a
    //         moveLeft.value = false
    //         break
    //       case 40: // down
    //       case 83: // s
    //         moveBackward.value = false
    //         break
    //       case 39: // right
    //       case 68: // d
    //         moveRight.value = false
    //         break
    //     }
    //   }
    //   document.addEventListener('keydown', onKeyDown, false)
    //   document.addEventListener('keyup', onKeyUp, false)
    // }

    // function pointerLockControlsRender() {
    //   // 計算時間差
    //   const time = Date.now()
    //   const delta = (time - prevTime) / 1000 // 大約為 0.016
    //   prevTime = time

    //   // 設定初始速度變化
    //   velocity.x -= velocity.x * 10.0 * delta
    //   velocity.z -= velocity.z * 10.0 * delta
    //   // velocity.y -= velocity.y * 10.0 * delta // 預設墜落速度

    //   // 判斷按鍵朝什麼方向移動，並設定對應方向速度變化
    //   direction.z = Number(moveForward.value) - Number(moveBackward.value)
    //   direction.x = Number(moveLeft.value) - Number(moveRight.value)
    //   if (moveForward.value || moveBackward.value) {
    //     velocity.z -= direction.z * 1500.0 * delta
    //   }
    //   if (moveLeft.value || moveRight.value) {
    //     velocity.x -= direction.x * 1500.0 * delta
    //   }

    //   // 根據速度值移動控制器位置
    //   controls.getObject().translateX(velocity.x * delta)
    //   controls.getObject().translateZ(velocity.z * delta)

    //   // const x = controls.getObject().position.x
    //   // const z = controls.getObject().position.z
    //   // const y = controls.getObject().position.y

    //   // 控制器下墜超過 -2000 則重置位置
    //   // if (y < 10) {
    //   // controls.getObject().position.set(x, 10, z)
    //   // }
    //   cameraControl.update()

    //   prevTime = time
    // }

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
        cameraControl.target.set(...actives.position)
        cameraControl.object.position.x = actives.position.x
        cameraControl.object.position.y = actives.position.y
        cameraControl.object.position.z =
          actives.position.z + hostOption.hostLong * 4
      }
    }

    function render() {
      cameraControl.update()

      // pointerLockControlsRender()

      pointerHover()

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
    return { serverRef, cameraControl }
  },
}
</script>
<style lang="sass" scoped>
#Server
  &.pointer
    cursor: pointer
</style>
