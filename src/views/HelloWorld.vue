<template lang="pug">
.hello(ref="hello")
</template>

<script>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

export default {
  name: 'HelloWorld',
  setup() {
    const hello = ref(null)

    let camera, scene, renderer, cube

    const init = () => {
      scene = new THREE.Scene()

      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
      renderer.setClearColor(0xeeeeee, 1.0) // 預設背景顏色
      renderer.shadowMap.enable = true // 陰影效果

      // 將渲染器的 DOM 綁到網頁上
      hello.value.appendChild(renderer.domElement)

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      )
      camera.position.set(100, 100, 100) // 相機位置
      camera.lookAt(scene.position) // 相機焦點

      let pointLight = new THREE.PointLight(0xffffff)
      pointLight.position.set(10, 10, -10)
      scene.add(pointLight)

      const geometry = new THREE.BoxGeometry(10, 10, 10) // 幾何體
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
      }) // 材質

      cube = new THREE.Mesh(geometry, material) // 建立網格物件
      cube.position.set(0, 0, 0)
      scene.add(cube)
    }

    function animate() {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }

    function render() {
      animate()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    onMounted(() => {
      init()
      render()
      // 監聽螢幕寬高變化來做簡單 RWD 設定
      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })
    })
    return { hello }
  },
}
</script>
