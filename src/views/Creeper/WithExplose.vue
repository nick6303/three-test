<template lang="pug">
.Creeper(ref="creeper")
</template>
<script>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

import * as dat from 'dat.gui'

import { useCreeper, useExplosion, cameraSet } from '@/hooks'

export default {
  name: 'WithExplose',
  setup() {
    const creeper = ref(null)

    let camera, renderer, cameraControl, gui
    let scene = new THREE.Scene()

    // 製作苦力怕
    const { creeperScaleBody, creeperObj } = useCreeper(scene)
    const { explosionTrigger, resetCreeper, explosion } = useExplosion(
      scene,
      creeperObj
    )

    // dat.GUI
    let controls = new (function () {
      this.explosionTrigger = explosionTrigger
      this.resetCreeper = resetCreeper
    })()

    const init = () => {
      // 相機設定與 OrbitControls
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        20,
        1000
      )
      camera.position.set(50, 50, 50)
      camera.lookAt(scene.position)

      const baseSet = cameraSet(camera)
      renderer = baseSet.renderer
      cameraControl = baseSet.cameraControl

      // 三軸座標輔助
      let axes = new THREE.AxesHelper(10)
      scene.add(axes)

      // 簡單的地板
      const planeGeometry = new THREE.PlaneGeometry(60, 60)
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
      let plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(0, -7, 0)
      plane.receiveShadow = true
      scene.add(plane)

      // light
      let ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)
      let spotLight = new THREE.SpotLight(0xf0f0f0)
      spotLight.position.set(-10, 30, 20)
      // spotLight.castShadow = true
      scene.add(spotLight)
      let pointLight = new THREE.PointLight(0xccffcc, 1, 100) // 顏色, 強度, 距離
      pointLight.castShadow = true // 投影
      pointLight.position.set(-30, 30, 30)
      scene.add(pointLight)

      gui = new dat.GUI()
      gui.add(controls, 'explosionTrigger')
      gui.add(controls, 'resetCreeper')

      // 將渲染出來的畫面放到網頁上的 DOM
      creeper.value.appendChild(renderer.domElement)
    }

    function render() {
      if (explosion) {
        const len = explosion.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            explosion[i].update()
          }
        }
      }
      cameraControl.update() // 需設定 update
      creeperScaleBody()

      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
    })

    return {
      creeper,
    }
  },
}
</script>
