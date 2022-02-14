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

    let renderer, scene, camera
    let cameraControl

    // points
    let points
    let positions = []
    let velocity = []

    // 建立粒子系統
    function createPoints() {
      const snowimage = require('@img/snowflake.png')
      const texture = new THREE.TextureLoader().load(snowimage)

      const material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
      })

      const geometry = new THREE.BufferGeometry()

      for (let i = 0; i < 15000; i++) {
        const x = THREE.Math.randInt(-250, 250)
        const y = THREE.Math.randInt(-250, 250)
        const z = THREE.Math.randInt(-250, 250)
        positions.push(x, y, z)
        const velocityX = THREE.Math.randFloat(-0.16, 0.16)
        const velocityY = THREE.Math.randFloat(0.1, 0.3)
        velocity.push(velocityX, velocityY, 0)
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      )

      points = new THREE.Points(geometry, material)
      scene.add(points)
    }

    function init() {
      // scene
      scene = new THREE.Scene()
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

      // renderer
      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)

      // OrbitControls
      cameraControl = new OrbitControls(camera, renderer.domElement)
      cameraControl.enableDamping = true
      cameraControl.dampingFactor = 0.25

      createPoints()

      snow.value.appendChild(renderer.domElement)
    }

    function animation() {
      const positions = points.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i++) {
        switch ((i + 1) % 3) {
          case 1:
            positions[i] -= velocity[i]
            if (positions[i] <= -250) {
              positions[i] = 250
              if (positions[i] <= -250 || positions[i] >= 250)
                velocity[i] = velocity[i] * -1
            }
            break
          case 2:
            positions[i] -= velocity[i]
            if (positions[i] <= -250) {
              positions[i] = 250
            }
            break
          default:
            break
        }
      }

      points.geometry.attributes.position.needsUpdate = true
    }

    function render() {
      requestAnimationFrame(render)
      cameraControl.update()
      animation()
      renderer.render(scene, camera)
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
