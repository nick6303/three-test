<template lang="pug">
#Server(ref="serverRef")
#blocker
  #instructions
</template>
<script>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

import '@js/PointerLockControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from '@js/FontLoader.js'

class server {
  constructor() {
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const faceImg = require('@img/creeper_face.png')
    const headMap = new THREE.TextureLoader().load(faceImg)
    // 苦力怕皮膚貼圖
    const skinImg = require('@img/creeper_skin.png')
    const skinMap = new THREE.TextureLoader().load(skinImg)

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 1) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
    }

    this.cabinet = new THREE.Group()
    for (let p = 0; p < 6; p++) {
      for (let i = 0; i < 6; i++) {
        const host = new THREE.Mesh(headGeo, headMaterials)
        const y = i * 4 + 2
        const x = p * 6
        host.position.set(x, y, 0)
        this.cabinet.add(host)
      }
    }
  }
}

export default {
  name: 'Server',
  setup() {
    const serverRef = ref(null)
    const moveForward = ref(false)
    const moveLeft = ref(false)
    const moveBackward = ref(false)
    const moveRight = ref(false)

    let camera, renderer, controls, raycaster
    let cameraControl
    let prevTime = Date.now() // 初始時間
    let velocity = new THREE.Vector3() // 移動速度向量
    let direction = new THREE.Vector3() // 移動方向向量
    let scene = new THREE.Scene()

    const createBox = () => {
      let creeperObj = new server()
      scene.add(creeperObj.cabinet)
    }

    const createText = (message, position) => {
      const loader = new FontLoader()
      loader.load('@mock/helvetiker_regular.typeface.json', function (font) {
        const color = 0x006699

        const matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        })

        const shapes = font.generateShapes(message, 100)

        const geometry = new THREE.ShapeGeometry(shapes)

        geometry.computeBoundingBox()

        const xMid =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)

        geometry.translate(xMid, 0, 0)

        const text = new THREE.Mesh(geometry, matLite)
        text.position = position
        scene.add(text)
      })
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
      camera.position.set(0, 50, 50)
      camera.lookAt(scene.position)

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setClearColor(0x80adfc, 1.0)
      renderer.setClearColor(0x111111, 1.0)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

      cameraControl = new OrbitControls(camera, renderer.domElement)
      console.log(cameraControl)

      // 簡單的地板
      const planeGeometry = new THREE.PlaneGeometry(60, 60)
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
      let plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(30.5, 0, 0)
      plane.receiveShadow = true
      plane.name = 'floor'
      scene.add(plane)

      let plane2 = new THREE.Mesh(planeGeometry, planeMaterial)
      plane2.rotation.x = -0.5 * Math.PI
      plane2.position.set(-30.5, 0, 0)
      plane2.receiveShadow = true
      plane.name = 'floor'
      scene.add(plane2)

      // light
      let ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)
      let spotLight = new THREE.SpotLight(0xf0f0f0)
      spotLight.position.set(-10, 30, 20)
      spotLight.castShadow = true
      scene.add(spotLight)

      createBox()
      createText()
      initPointerLockControls()

      // 將渲染出來的畫面放到網頁上的 DOM
      serverRef.value.appendChild(renderer.domElement)
    }

    function initPointerLockControls() {
      // 鼠標鎖定初始化
      controls = new THREE.PointerLockControls(camera)
      controls.getObject().position.set(0, 50, 50)
      scene.add(controls.getObject())

      const onKeyDown = function (event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            moveForward.value = true
            break
          case 37: // left
          case 65: // a
            moveLeft.value = true
            break
          case 40: // down
          case 83: // s
            moveBackward.value = true
            break
          case 39: // right
          case 68: // d
            moveRight.value = true
            break
          default:
            break
        }
      }
      const onKeyUp = function (event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            moveForward.value = false
            break
          case 37: // left
          case 65: // a
            moveLeft.value = false
            break
          case 40: // down
          case 83: // s
            moveBackward.value = false
            break
          case 39: // right
          case 68: // d
            moveRight.value = false
            break
        }
      }
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)

      // 使用 Raycaster 實現簡單碰撞偵測
      raycaster = new THREE.Raycaster(
        new THREE.Vector3(),
        new THREE.Vector3(0, 10, 0),
        0,
        10
      )
    }

    function pointerLockControlsRender() {
      // 使用 Raycaster 判斷腳下是否與場景中物體相交
      raycaster.ray.origin.copy(controls.getObject().position) // 複製控制器的位置
      // 計算時間差
      const time = Date.now()
      const delta = (time - prevTime) / 1000 // 大約為 0.016
      prevTime = time

      // 設定初始速度變化
      velocity.x -= velocity.x * 10.0 * delta
      velocity.z -= velocity.z * 10.0 * delta
      // velocity.y -= velocity.y * 10.0 * delta // 預設墜落速度

      // 判斷按鍵朝什麼方向移動，並設定對應方向速度變化
      direction.z = Number(moveForward.value) - Number(moveBackward.value)
      direction.x = Number(moveLeft.value) - Number(moveRight.value)
      // direction.normalize() // 向量正規化（長度為 1），確保每個方向保持一定移動量
      if (moveForward.value || moveBackward.value) {
        velocity.z -= direction.z * 400.0 * delta
      }
      if (moveLeft.value || moveRight.value) {
        velocity.x -= direction.x * 400.0 * delta
      }

      // 根據速度值移動控制器位置
      controls.getObject().translateX(velocity.x * delta)
      // controls.getObject().translateY(velocity.y * delta)
      controls.getObject().translateZ(velocity.z * delta)

      const x = controls.getObject().position.x
      const z = controls.getObject().position.z
      const y = controls.getObject().position.y

      // 控制器下墜超過 -2000 則重置位置
      if (y < 10) {
        controls.getObject().position.set(x, 10, z)
      }

      prevTime = time
    }

    function render() {
      // cameraControl.update()
      pointerLockControlsRender()

      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
    })
    return { serverRef }
  },
}
</script>
