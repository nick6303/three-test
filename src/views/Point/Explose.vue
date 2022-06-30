<template lang="pug">
.Explose(ref="explose")
#stats
</template>
<script>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui'

export default {
  name: 'Explose',
  setup() {
    const explose = ref(null)
    let camera, scene, renderer, cameraControl, gui

    // 變數宣告
    const pointCount = 10000 // 粒子總數
    const movementSpeed = 20 // 移速種子
    let explosion // 爆炸物件
    let size = 20 // 粒子尺寸
    const smoke = require('@img/smoke.png')
    const smokeTexture = new THREE.TextureLoader().load(smoke)

    // dat.GUI
    let controls = new (function () {
      this.explosionTrigger = function () {
        if (explosion) {
          explosion.destroy()
        }
        explosion = new Explosion(0, 0)
      }
      this.pointSize = 20
      this.cameraNear = 500
      // this.pointCount = 1000
    })()

    // 爆炸類別
    class Explosion {
      constructor(x, y) {
        // 幾何體
        const geometry = new THREE.BufferGeometry()

        // 材質
        this.material = new THREE.PointsMaterial({
          size: size,
          color: new THREE.Color(Math.random() * 0xffffff), // 顏色隨機
          map: smokeTexture,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
          opacity: 0.7,
        })

        this.pCount = pointCount
        this.movementSpeed = movementSpeed
        this.dirs = []
        this.positions = []

        // 建立粒子系統所需頂點
        for (let i = 0; i < this.pCount; i++) {
          // const vertex = new THREE.Vector3(x, y, 0) // 每個頂點起點都在爆炸起源點
          // geometry.vertices.push(vertex)
          this.positions.push(x, y, 0)
          const r = this.movementSpeed * THREE.Math.randFloat(0, 1)
          // 噴射方向隨機 -> 不規則球體
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          this.dirs.push({
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi),
          })
        }

        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(this.positions, 3)
        )

        let points = new THREE.Points(geometry, this.material)

        this.object = points

        scene.add(this.object)
      }
      update() {
        let p = this.pCount
        const d = this.dirs
        const positions = this.object.geometry.attributes.position.array
        while (p--) {
          positions[3 * p] += d[p].x
          positions[3 * p + 1] += d[p].y
          positions[3 * p + 2] += d[p].z
        }
        this.object.geometry.attributes.position.needsUpdate = true
      }
      destroy() {
        this.object.geometry.dispose()
        scene.remove(this.object)
        // console.log(renderer.info) // 驗證
        this.dirs.length = 0
      }
    }

    const init = () => {
      scene = new THREE.Scene()

      // 相機設定與 OrbitControls
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        500,
        5000
      )
      camera.position.set(0, 0, 1000)
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

      gui = new dat.GUI()
      gui.add(controls, 'explosionTrigger')
      gui.add(controls, 'pointSize', 10, 200).onChange((e) => {
        size = e
      })
      gui.add(controls, 'cameraNear', 1, 1000).onChange((near) => {
        camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          near,
          5000
        )
        camera.position.set(0, 0, 1000)
        camera.lookAt(scene.position)
      })

      // 將渲染出來的畫面放到網頁上的 DOM
      explose.value.appendChild(renderer.domElement)
    }

    function render() {
      if (explosion) {
        explosion.update()
      }
      cameraControl.update() // 需設定 update

      requestAnimationFrame(render)
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

    return {
      explose,
    }
  },
}
</script>
<style lang="sass" scoped>
#stats
  position: absolute
  left: 0
  top: 0
</style>
