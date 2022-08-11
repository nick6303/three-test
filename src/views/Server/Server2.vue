<template lang="pug">
#Server(ref="serverRef")
</template>
<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import data from './data'
import * as dat from 'dat.gui'
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene = new THREE.Scene()

const createPlane = (row) => {
  const loader = new GLTFLoader()
  loader.load(row.url, function (gltf) {
    const x = row.position[0]
    const y = 0
    const z = row.position[2]
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(x, y, z)
    gltf.scene.name = 'floor'

    scene.add(gltf.scene)
  })
}

export default {
  name: 'server2',
  setup() {
    const serverRef = ref(null)

    let camera, cameraControl, renderer, gui
    // , actives
    // let targetTween, positionTween

    const cameraPosition = [0, 18, 18] // 攝影機位置
    const planeWidth = 60 // 機房平面寬度
    const planeLong = 60 // 機房平面長度

    const init = () => {
      scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x000000, 0.0008)

      // camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500
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
      let ambientLight = new THREE.AmbientLight(0xffffff)
      scene.add(ambientLight)
      let spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(0, 100, 100)
      spotLight.castShadow = true
      scene.add(spotLight)

      generateStructor()

      let controls = new (function () {
        // this.backStart = backStart
        this.backStart = () => {}
      })()

      gui = new dat.GUI()
      gui.add(controls, 'backStart')
      // 將渲染出來的畫面放到網頁上的 DOM
      serverRef.value.appendChild(renderer.domElement)
      // 將渲染出來的畫面放到網頁上的 DOM
      serverRef.value.appendChild(renderer.domElement)
    }

    const render = () => {
      cameraControl.update()
      // pointerHover()
      // TWEEN.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

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

      const house = data[0]
      const planePosiX = offsetCenter(1, 0, 0, planeWidth, 0.5)
      createPlane({
        houseName: house.houseName,
        url: house.url,
        width: planeWidth,
        long: planeLong,
        position: [planePosiX, 0, 0],
      })
    }

    onMounted(() => {
      init()
      render()
      // window.addEventListener('pointermove', onPointerMove)
      // window.addEventListener('click', clickCabinet)
    })

    onBeforeUnmount(() => {
      // window.removeEventListener('pointermove', onPointerMove)
      // window.removeEventListener('click', clickCabinet)
    })

    return {
      serverRef,
    }
  },
}
</script>
