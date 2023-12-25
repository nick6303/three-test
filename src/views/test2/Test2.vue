<template lang="pug">
.testPage2
</template>
<script>
import { onMounted } from 'vue'
import * as THREE from 'three'
// import Stats from 'three/examples/jsm/libs/stats.module'

// import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import LineMaterial from 'three/examples/jsm/lines/LineMaterial'
// import Wireframe from 'three/examples/jsm/lines/Wireframe'
// import WireframeGeometry2 from 'three/examples/jsm/lines/WireframeGeometry2'

export default {
  name: 'testPage2',
  setup() {
    let renderer, camera, controls, scene
    // let wireframe
    // let wireframe1
    // let matLine
    // , matLineBasic, matLineDashed
    // let stats
    // let gui

    // viewport
    // let insetWidth
    // let insetHeight

    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x000000, 0.0)
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)

      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      camera.position.set(-50, 0, 50)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.minDistance = 10
      controls.maxDistance = 500
      createMatal()
    }

    const createMatal = () => {
      // let geo = new THREE.IcosahedronGeometry(20, 1)
      // const geometry = new WireframeGeometry2(geo)
      // matLine = new LineMaterial({
      //   color: 0x4080ff,
      //   linewidth: 5,
      //   dashed: false,
      // })
      // wireframe = new Wireframe(geometry, matLine)
      // wireframe.computeLineDistances()
      // wireframe.scale.set(1, 1, 1)
      // scene.add(wireframe)
      //   geo = new THREE.WireframeGeometry(geo)
      //   matLineBasic = new THREE.LineBasicMaterial({ color: 0x4080ff })
      //   matLineDashed = new THREE.LineDashedMaterial({
      //     scale: 2,
      //     dashSize: 1,
      //     gapSize: 1,
      //   })
      //   wireframe1 = new THREE.LineSegments(geo, matLineBasic)
      //   wireframe1.computeLineDistances()
      //   wireframe1.visible = false
      //   scene.add(wireframe1)
      //   window.addEventListener('resize', onWindowResize)
      //   onWindowResize()
      //   stats = new Stats()
      //   document.body.appendChild(stats.dom)
      // initGui()
    }

    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight
    //   camera.updateProjectionMatrix()

    //   renderer.setSize(window.innerWidth, window.innerHeight)

    //   insetWidth = window.innerHeight / 4 // square
    //   insetHeight = window.innerHeight / 4
    // }

    function animate() {
      //   requestAnimationFrame(animate)
      //   stats.update()
      //   renderer.setClearColor(0x000000, 0)
      //   renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
      //   matLine.resolution.set(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
      //   renderer.setClearColor(0x222222, 1)
      //   renderer.clearDepth()
      //   renderer.setScissorTest(true)
      //   renderer.setScissor(20, 20, insetWidth, insetHeight)
      //   renderer.setViewport(20, 20, insetWidth, insetHeight)
      //   matLine.resolution.set(insetWidth, insetHeight)
      //   renderer.setScissorTest(false)
    }

    // //

    // function initGui() {
    //   gui = new GUI()

    //   const param = {
    //     'line type': 0,
    //     'width (px)': 5,
    //     dashed: false,
    //     'dash scale': 1,
    //     'dash / gap': 1,
    //   }

    //   gui
    //     .add(param, 'line type', { LineGeometry: 0, 'gl.LINE': 1 })
    //     .onChange(function (val) {
    //       switch (val) {
    //         case 0:
    //           wireframe.visible = true

    //           wireframe1.visible = false

    //           break

    //         case 1:
    //           wireframe.visible = false

    //           wireframe1.visible = true

    //           break
    //       }
    //     })

    //   gui.add(param, 'width (px)', 1, 10).onChange(function (val) {
    //     matLine.linewidth = val
    //   })

    //   gui.add(param, 'dashed').onChange(function (val) {
    //     matLine.dashed = val

    //     if (val) matLine.defines.USE_DASH = ''
    //     else delete matLine.defines.USE_DASH
    //     matLine.needsUpdate = true

    //     wireframe1.material = val ? matLineDashed : matLineBasic
    //   })

    //   gui.add(param, 'dash scale', 0.5, 1, 0.1).onChange(function (val) {
    //     matLine.dashScale = val
    //     matLineDashed.scale = val
    //   })

    //   gui
    //     .add(param, 'dash / gap', { '2 : 1': 0, '1 : 1': 1, '1 : 2': 2 })
    //     .onChange(function (val) {
    //       switch (val) {
    //         case 0:
    //           matLine.dashSize = 2
    //           matLine.gapSize = 1

    //           matLineDashed.dashSize = 2
    //           matLineDashed.gapSize = 1

    //           break

    //         case 1:
    //           matLine.dashSize = 1
    //           matLine.gapSize = 1

    //           matLineDashed.dashSize = 1
    //           matLineDashed.gapSize = 1

    //           break

    //         case 2:
    //           matLine.dashSize = 1
    //           matLine.gapSize = 2

    //           matLineDashed.dashSize = 1
    //           matLineDashed.gapSize = 2

    //           break
    //       }
    //     })
    // }

    onMounted(() => {
      init()
      animate()
    })
    return {}
  },
}
</script>
<style lang="sass">
body
  background-color: #222

canvas
  width: 100%
  height: 100%
</style>
