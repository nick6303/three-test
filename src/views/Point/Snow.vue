<template lang="pug">
.snow(ref="snow")
</template>

<script>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'Snow',
  setup() {
    const snow = ref(null)

    let camera, scene, renderer, cameraControl

    const init = () => {
      scene = new THREE.Scene()

      // 相機設定與 OrbitControls
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )

      camera.position.set(30, 30, 30)
      camera.lookAt(scene.position)

      // 渲染器設定
      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true // 設定需渲染陰影效果
      renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

      // 建立 OrbitControls
      cameraControl = new OrbitControls(camera, renderer.domElement)
      cameraControl.enableDamping = true // 啟用阻尼效果
      cameraControl.dampingFactor = 0.25 // 阻尼系數

      scene.fog = new THREE.FogExp2(0x000000, 0.0008)

      // camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      camera.position.set(0, 0, 100)
      camera.lookAt(scene.position)

      createPoints()

      // 將渲染出來的畫面放到網頁上的 DOM
      document.body.appendChild(renderer.domElement)
    }

    function render() {
      cameraControl.update() // 需設定 update
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    const particleCount = 15000
    let points

    // 建立粒子系統
    function createPoints() {
      const geometry = new THREE.BufferGeometry()

      const texture = new THREE.TextureLoader().load('./snowflake.png')
      let material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7,
      })

      const range = 250
      for (let i = 0; i < particleCount; i++) {
        const x = THREE.Math.randInt(-range, range)
        const y = THREE.Math.randInt(-range, range)
        const z = THREE.Math.randInt(-range, range)

        const point = new THREE.Vector3(x, y, z)
        geometry.vertices.push(point)
      }

      points = new THREE.Points(geometry, material)
      scene.add(points)
    }

    onMounted(() => {
      init()
      render()
      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })
    })
    return { snow }
  },
}
</script>
