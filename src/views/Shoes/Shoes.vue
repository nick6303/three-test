<template lang="pug">
.info
</template>

<script>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted } from '@vue/runtime-core'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export default {
  name: 'Test',
  setup() {
    let camera, scene, renderer

    function init() {
      const container = document.createElement('div')
      document.body.appendChild(container)

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.25,
        20
      )
      camera.position.set(2.5, 1.5, 3.0)

      scene = new THREE.Scene()

      new RGBELoader()
        .setPath('glTF/')
        .load('quarry_01_1k.hdr', function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping

          scene.background = texture
          scene.environment = texture

          render()

          // model

          const loader = new GLTFLoader().setPath('glTF/')
          loader.load('MaterialsVariantsShoe.gltf', function (gltf) {
            gltf.scene.scale.set(10.0, 10.0, 10.0)
            console.log(gltf.scene)
            scene.add(gltf.scene)

            render()
          })
        })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.outputEncoding = THREE.sRGBEncoding
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.addEventListener('change', render) // use if there is no animation loop
      controls.minDistance = 2
      controls.maxDistance = 10
      controls.target.set(0, 0.5, -0.2)
      controls.update()

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)

      render()
    }

    //

    function render() {
      renderer.render(scene, camera)
    }
    onMounted(() => {
      init()
      render()
    })
  },
}
</script>
