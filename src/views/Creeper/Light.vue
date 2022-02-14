<template lang="pug">
.Creeper(ref="creeper")
#stats
</template>
<script>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    // 苦力怕臉部貼圖
    const headMap = new THREE.TextureLoader().load(
      'https://dl.dropboxusercontent.com/s/bkqu0tty04epc46/creeper_face.png'
    )
    // 苦力怕皮膚貼圖
    const skinMap = new THREE.TextureLoader().load(
      'https://dl.dropboxusercontent.com/s/eev6wxdxfmukkt8/creeper_skin.png'
    )

    // 身體與腳的材質設定
    const skinMat = new THREE.MeshStandardMaterial({
      roughness: 0.3, // 粗糙度
      metalness: 0.8, // 金屬感
      transparent: true, // 透明與否
      opacity: 0.9, // 透明度
      side: THREE.DoubleSide, // 雙面材質
      map: skinMap, // 皮膚貼圖
    })

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 1) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
    }

    // 頭
    this.head = new THREE.Mesh(headGeo, headMaterials)

    this.head.position.set(0, 6, 0)

    // 身體
    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 0, 0)

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, skinMat)
    this.foot1.position.set(-1, -5.5, 2)
    this.foot2 = this.foot1.clone() // 剩下三隻腳都複製第一隻的 Mesh
    this.foot2.position.set(-1, -5.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, -5.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, -5.5, -2)

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group()
    this.feet.add(this.foot1)
    this.feet.add(this.foot2)
    this.feet.add(this.foot3)
    this.feet.add(this.foot4)

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)
    // 苦力怕投影設定，利用 traverse 遍歷各個子元件設定陰影
    this.creeper.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

export default {
  name: 'Light',
  setup() {
    const creeper = ref(null)
    let camera, scene, renderer, cameraControl, pointLight, sphereLightMesh
    let rotateAngle = 0

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

      // 三軸座標輔助
      let axes = new THREE.AxesHelper(10)
      scene.add(axes)

      // 渲染器設定
      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true // 設定需渲染陰影效果
      renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

      // 建立 OrbitControls
      cameraControl = new OrbitControls(camera, renderer.domElement)
      cameraControl.enableDamping = true // 啟用阻尼效果
      cameraControl.dampingFactor = 0.25 // 阻尼系數
      // cameraControl.autoRotate = true // 啟用自動旋轉

      // 簡單的地板
      const planeGeometry = new THREE.PlaneGeometry(60, 60)
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
      let plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(0, -7, 0)
      plane.receiveShadow = true
      scene.add(plane)

      // 設置環境光提供輔助柔和白光
      let ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      // 設置聚光燈幫忙照亮物體
      let spotLight = new THREE.SpotLight(0xf0f0f0)
      spotLight.position.set(-10, 30, 20)
      scene.add(spotLight)

      // 移動點光源
      pointLight = new THREE.PointLight(0xccffcc, 0.5, 100) // 顏色, 強度, 距離
      pointLight.castShadow = true // 投影
      pointLight.position.y = 16
      scene.add(pointLight)

      // // 小球體模擬點光源實體
      const sphereLightGeo = new THREE.SphereGeometry(0.3)
      const sphereLightMat = new THREE.MeshBasicMaterial({ color: 0xccffcc })
      sphereLightMesh = new THREE.Mesh(sphereLightGeo, sphereLightMat)
      sphereLightMesh.castShadow = true
      sphereLightMesh.position.y = 16
      scene.add(sphereLightMesh)

      // 產生苦力怕物件並加到場景
      createCreeper()

      // 將渲染出來的畫面放到網頁上的 DOM
      creeper.value.appendChild(renderer.domElement)
    }

    // 點光源繞 Y 軸旋轉動畫
    function pointLightAnimation() {
      if (rotateAngle > 2 * Math.PI) {
        rotateAngle = 0 // 超過 360 度後歸零
      } else {
        rotateAngle += 0.03 // 遞增角度
      }
      // 光源延橢圓軌道繞 Y 軸旋轉
      sphereLightMesh.position.x = 8 * Math.cos(rotateAngle)
      sphereLightMesh.position.z = 4 * Math.sin(rotateAngle)
      // 點光源位置與球體同步
      pointLight.position.copy(sphereLightMesh.position)
    }

    function render() {
      cameraControl.update() // 需設定 update
      pointLightAnimation() // update
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    // 生成苦力怕並加到場景
    function createCreeper() {
      const creeperObj = new Creeper()
      scene.add(creeperObj.creeper)
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

    return { creeper }
  },
}
</script>

<style lang="sass" scoped>
#stats
  position: absolute
  left: 0
  top: 0
</style>
